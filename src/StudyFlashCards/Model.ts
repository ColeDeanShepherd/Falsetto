import * as Utils from "../lib/Core/Utils";
import { FlashCard, FlashCardId } from "../FlashCard";
import { StudyAlgorithm, LeitnerStudyAlgorithm, QuizStudyAlgorithm } from '../Study/StudyAlgorithm';
import { AnswerDifficulty, answerDifficultyToPercentCorrect, isAnswerDifficultyCorrect } from "../Study/AnswerDifficulty";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../FlashCardSet";
import { IDatabase, FlashCardAnswer } from "../Database";
import { IUserManager } from "../UserManager";
import { Size2D } from "../lib/Core/Size2D";
import { DependencyInjector } from "../DependencyInjector";
import { IAnalytics } from "../Analytics";
import { FlashCardSetStats } from "../Study/FlashCardSetStats";
import { FlashCardStats } from '../Study/FlashCardStats';
import { arrayCountPassing, arrayContains, sum, removeElement, uniq, areArraysEqual } from "../lib/Core/ArrayUtils";
import { assert } from "../lib/Core/Dbc";

export function getFlashCardSetStatsFromAnswers(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, answers: Array<FlashCardAnswer>
): FlashCardSetStats {
  const minPctCorrect = answerDifficultyToPercentCorrect(AnswerDifficulty.Easy);
  const flashCardStats = flashCards
    .map(fc => {
      const numCorrectGuesses = arrayCountPassing(
        answers, a => (a.flashCardId === fc.id) && (a.percentCorrect >= minPctCorrect)
      );
      const numIncorrectGuesses = arrayCountPassing(
        answers, a => (a.flashCardId === fc.id) && (a.percentCorrect < minPctCorrect)
      );
      return new FlashCardStats(fc.id, numCorrectGuesses, numIncorrectGuesses);
    });
    return new FlashCardSetStats(flashCardSet.id, flashCardStats);
}
export async function getFlashCardSetStatsFromDatabase(
  database: IDatabase, userManager: IUserManager,
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>
): Promise<FlashCardSetStats> {
  const user = userManager.getCurrentUser();
  const userId = ""; // TODO: user ? user.id : "";
  const flashCardIds = flashCards.map(fc => fc.id);
  const answers = await database.getAnswers(flashCardIds, userId);
  return getFlashCardSetStatsFromAnswers(flashCardSet, flashCards, answers);
}

export const MIN_PCT_CORRECT_FLASH_CARD_LEVEL = 0.85;

export function getCurrentFlashCardLevel(
  flashCardSet: FlashCardSet, flashCardLevels: Array<FlashCardLevel>, flashCardSetStats: FlashCardSetStats
): [number, FlashCardLevel] {
  for (let i = 0; i < flashCardLevels.length - 1; i++) {
    const level = flashCardLevels[i];
    const percentToNextLevel = getPercentToNextLevel(level, flashCardSetStats);
    if (percentToNextLevel < MIN_PCT_CORRECT_FLASH_CARD_LEVEL) {
      return [i, level];
    }
  }

  const lastLevelIndex = flashCardLevels.length - 1;
  return [lastLevelIndex, flashCardLevels[lastLevelIndex]];
}

export function getPercentToNextLevel(currentFlashCardLevel: FlashCardLevel, flashCardSetStats: FlashCardSetStats): number {
  const percentCorrects = flashCardSetStats.flashCardStats
    .filter(qs => arrayContains(currentFlashCardLevel.flashCardIds, qs.flashCardId))
    .map(qs => qs.percentCorrect);
  return sum(percentCorrects, p => Math.min(p, MIN_PCT_CORRECT_FLASH_CARD_LEVEL) / percentCorrects.length) / MIN_PCT_CORRECT_FLASH_CARD_LEVEL;
}

// TODO: make study algorithm stateless? (leitner algorithm is stateful)
export class StudyFlashCardsModel {
  private userManager: IUserManager;
  //private database: IDatabase;
  private analytics: IAnalytics;

  public flashCardSet: FlashCardSet;
  public flashCards: Array<FlashCard>;
  public flashCardLevels: Array<FlashCardLevel>;
  public configData: any; // TODO: handle "any" in a better way?
  public enabledFlashCardIds: Array<FlashCardId>; // TODO: configData & enabled flash card IDs redundant?
  public currentFlashCardId: FlashCardId;
  public incorrectAnswersToCurrentFlashCard: Array<any>;
  public isShowingBackSide: boolean;
  public studyAlgorithm: StudyAlgorithm;

  // correct/incorrect icon state
  public correctAnswerIconKeySuffix: number;
  public startShowingCorrectAnswerIcon: boolean;

  public incorrectAnswerIconKeySuffix: number;
  public startShowingIncorrectAnswerIcon: boolean;

  // old state that I might want to review
  public sessionFlashCardNumber: number;
  public haveGottenCurrentFlashCardWrong: boolean;
  public lastCorrectAnswer: any;
  public incorrectAnswers: Array<any>;
  public showConfiguration: boolean;
  public showDetailedStats: boolean;

  public get isInitialized(): boolean {
    return this.currentFlashCardId.length > 0;
  }

  public constructor(flashCardSet: FlashCardSet, studyAlgorithm?: StudyAlgorithm) {
    this.userManager = DependencyInjector.instance.getRequiredService<IUserManager>("IUserManager");
    //this.database = DependencyInjector.instance.getRequiredService<IDatabase>("IDatabase");
    this.analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");

    this.flashCardSet = flashCardSet;
    this.flashCards = this.flashCardSet.createFlashCards();
    
    this.sessionFlashCardNumber = 0;
    this.showConfiguration = false;
    this.showDetailedStats = false;
    this.isShowingBackSide = false;
    this.haveGottenCurrentFlashCardWrong = false;
    this.lastCorrectAnswer = null;
    this.incorrectAnswers = [];
    this.incorrectAnswersToCurrentFlashCard = [];
    this.isShowingBackSide = false;

    // correct/incorrect icon state
    this.correctAnswerIconKeySuffix = 0;
    this.startShowingCorrectAnswerIcon = false;

    this.incorrectAnswerIconKeySuffix = 0;
    this.startShowingIncorrectAnswerIcon = false;
    
    this.studyAlgorithm = (studyAlgorithm !== undefined)
      ? studyAlgorithm
      : new LeitnerStudyAlgorithm(5);
    this.studyAlgorithm.customNextFlashCardIdFilter = this.flashCardSet.customNextFlashCardIdFilter;

    this.flashCardLevels = this.flashCardSet.createFlashCardLevels
      ? this.flashCardSet.createFlashCardLevels(this.flashCardSet, this.flashCards) // TODO: don"t pass in these args?
      : [];
    
    // actually initialized in static create method
    this.enabledFlashCardIds = [];
    this.currentFlashCardId = "";
  }

  public async initAsync(): Promise<void> {
    const flashCardSetStats = new FlashCardSetStats(
      this.flashCardSet.id,
      this.flashCards
        .map(fc => new FlashCardStats(fc.id, 0, 0))
    )

    this.studyAlgorithm.reset(
      this.flashCards.map(fc => fc.id), this.flashCards, flashCardSetStats
    );
    
    this.configData = this.getInitialConfigData();
    this.enabledFlashCardIds = this.getInitialEnabledFlashCardIds();
    
    if (this.enabledFlashCardIds) {
      this.studyAlgorithm.enabledFlashCardIds = this.enabledFlashCardIds;
    }
    
    this.currentFlashCardId = this.studyAlgorithm.getNextFlashCardId();
    
    if (
      this.configData &&
      !this.flashCardSet.configDataToEnabledFlashCardIds
    ) {
      assert(false);
    }

    this.enabledFlashCardIds = this.studyAlgorithm.enabledFlashCardIds;

    this.publishUpdate(); // TODO: remove?
  }
  
  // #region pub/sub

  public subscribeToUpdates(updateHandler: () => void) {
    this.updateHandlers.push(updateHandler);
  }
  public unsubscribeFromUpdates(updateHandler: () => void) {
    removeElement(this.updateHandlers, updateHandler);
  }

  private publishUpdate() {
    for (const updateHandler of this.updateHandlers) {
      updateHandler();
    }
  }

  private updateHandlers = new Array<() => void>();

  // #endregion

  public flipFlashCard() {
    this.handleFlipFlashCardAction();
  }

  public skipFlashCard() {
    this.handleSkipFlashCardAction(this.lastCorrectAnswer);
  }

  public changeLevel(levelIndex: number) {
    this.handleChangeLevelAction(levelIndex);
  }

  public toggleShowConfiguration() {
    this.handleToggleConfigurationAction();
  }

  public changeEnabledFlashCards(newValue: Array<FlashCardId>, newConfigData: any) {
    this.handleChangeEnabledFlashCardsAction(newValue, newConfigData);
  }

  private get hasFlashCardLevels(): boolean { return this.flashCardLevels && (this.flashCardLevels.length > 0); }

  private getInitialConfigData(): any {
    const setInitialConfigData = this.flashCardSet.getInitialConfigData
      ? this.flashCardSet.getInitialConfigData()
      : null; // TODO: get rid of this conditional. make every set define the function & a config data type
    return this.hasFlashCardLevels
      ? this.flashCardLevels[0].createConfigData(setInitialConfigData) // TODO: don"t pass this argument?
      : setInitialConfigData;
  }

  private getInitialEnabledFlashCardIds(): Array<FlashCardId> {
    if (this.hasFlashCardLevels) {
      const [_, level] = getCurrentFlashCardLevel(this.flashCardSet, this.flashCardLevels, this.studyAlgorithm.flashCardSetStats);
      return level.flashCardIds.slice();
    } else {
      return this.flashCardSet.configDataToEnabledFlashCardIds
        ? this.flashCardSet.configDataToEnabledFlashCardIds(
          this.flashCardSet, this.flashCards, this.getInitialConfigData()
        )
        : this.flashCards.map(fc => fc.id); // TODO: get rid of this conditional. make every set define the function & a config data type
    }
  }
  
  private async handleUserAnswerAction(
    flashCardId: FlashCardId,
    answer: any,
    answerDifficulty: AnswerDifficulty): Promise<void> {
    this.uiStateHandleUserAnswerAction(flashCardId, answer, answerDifficulty);
    this.studyAlgorithmHandleUserAnswerAction(flashCardId, answer, answerDifficulty);
    await this.databaseHandleUserAnswerAction(flashCardId, answer, answerDifficulty);
    await this.analyticsHandleUserAnswerAction(flashCardId, answer, answerDifficulty);
    this.handleUserAnswerActionInternal(flashCardId, answer, answerDifficulty);
  }

  private uiStateHandleUserAnswerAction(
    flashCardId: FlashCardId,
    answer: any,
    answerDifficulty: AnswerDifficulty
  ) {
    if (!this.haveGottenCurrentFlashCardWrong) {
      this.startShowingCorrectAnswerIcon = false;
      this.startShowingIncorrectAnswerIcon = false;

      const isCorrect = isAnswerDifficultyCorrect(answerDifficulty);

      if (isCorrect) {
        this.correctAnswerIconKeySuffix++;
        this.startShowingCorrectAnswerIcon = true;
      } else {
        this.incorrectAnswerIconKeySuffix++;
        this.startShowingIncorrectAnswerIcon = true;
      }
    }
  }

  private studyAlgorithmHandleUserAnswerAction(
    flashCardId: FlashCardId,
    answer: any,
    answerDifficulty: AnswerDifficulty) {
    if (!this.haveGottenCurrentFlashCardWrong) {
      this.studyAlgorithm.onAnswer(answerDifficulty);
    }
  }

  private async databaseHandleUserAnswerAction(
    flashCardId: FlashCardId,
    answer: any,
    answerDifficulty: AnswerDifficulty): Promise<void> {
    // if (!this.haveGottenCurrentFlashCardWrong) {
    //   const user = this.userManager.getCurrentUser();
    //   const userId = user ? user.id : "";
    //   const answeredAt = new Date();

    //   await this.database.addAnswers([new FlashCardAnswer(
    //     this.currentFlashCardId, userId,
    //     answerDifficultyToPercentCorrect(answerDifficulty), answeredAt
    //   )]);
    // }
  }

  private async analyticsHandleUserAnswerAction(
    flashCardId: FlashCardId,
    answer: any,
    answerDifficulty: AnswerDifficulty) {
    if (!this.haveGottenCurrentFlashCardWrong) {
      const eventId = isAnswerDifficultyCorrect(answerDifficulty)
        ? "answer_correct"
        : "answer_incorrect";
      const eventLabel = this.currentFlashCardId;
      const eventValue = undefined;
      const eventCategory = this.flashCardSet.id;
      await this.analytics.trackCustomEvent(
        eventId, eventLabel, eventValue, eventCategory
      );
    }
  }

  private handleUserAnswerActionInternal(
    flashCardId: FlashCardId,
    answer: any,
    answerDifficulty: AnswerDifficulty
  ) {
      const currentFlashCard = Utils.unwrapValueOrUndefined(
        this.flashCards.find(fc => fc.id === this.currentFlashCardId)
      );
  
      // If the user is correct, or if the user determines their correctness, move to the next flash card.
      const isCurrentAnswerCorrect = isAnswerDifficultyCorrect(answerDifficulty);
  
      if (currentFlashCard.doesUserDetermineCorrectness || isCurrentAnswerCorrect) {
        this.moveToNextFlashCardInternal(answer);
      }
      // Otherwise, register the incorrect answer and don't move to the next flash card.
      else {
        this.haveGottenCurrentFlashCardWrong = true;
        this.incorrectAnswers = uniq(this.incorrectAnswers.concat(answer));
  
        this.publishUpdate();
      }
  }
  
  // #region Action Handlers
  
  private handleFlipFlashCardAction() {
    const currentFlashCard = Utils.unwrapValueOrUndefined(
      this.flashCards.find(fc => fc.id === this.currentFlashCardId)
    );

    // If the user doesn't determine whether they were correct or not, showing the back side of the flash card
    // should count as an incorrect answer.
    if (!currentFlashCard.doesUserDetermineCorrectness) {
      this.handleUserAnswerAction(this.currentFlashCardId, null, AnswerDifficulty.Incorrect);
    }

    this.isShowingBackSide = !this.isShowingBackSide;

    this.publishUpdate();
  }

  private handleSkipFlashCardAction(lastCorrectAnswer: any) {
    this.currentFlashCardId = this.studyAlgorithm.getNextFlashCardId(
      this.getStudySessionInfo(new Size2D(0, 0))
    );
    this.sessionFlashCardNumber = this.sessionFlashCardNumber + 1;
    this.haveGottenCurrentFlashCardWrong = false;
    this.isShowingBackSide = false;
    this.lastCorrectAnswer = lastCorrectAnswer;
    this.incorrectAnswers = [];

    this.publishUpdate();
  }

  private handleChangeLevelAction(levelIndex: number) {
    const level = this.flashCardLevels[levelIndex];
    const newEnabledFlashCardIds = level.flashCardIds.slice();
    this.handleChangeEnabledFlashCardsAction(newEnabledFlashCardIds, level.createConfigData(this.configData));
  }

  private handleToggleConfigurationAction() {
    this.showConfiguration = !this.showConfiguration;

    this.publishUpdate();
  }

  private handleChangeEnabledFlashCardsAction(enabledFlashCardIds2: Array<FlashCardId>, newConfigData: any) {
    const enabledFlashCardIds = enabledFlashCardIds2.slice();
    const configData = newConfigData; // TODO: copy?

    this.studyAlgorithm.enabledFlashCardIds = enabledFlashCardIds;

    this.enabledFlashCardIds = enabledFlashCardIds;
    this.configData = configData;

    if (!arrayContains(enabledFlashCardIds, this.currentFlashCardId)) {
      this.moveToNextFlashCardInternal(null);
    }

    this.publishUpdate();
  }

  // #endregion Action Handlers
  
  private moveToNextFlashCardInternal(lastCorrectAnswer: any) {
    this.handleSkipFlashCardAction(lastCorrectAnswer);
  }

  // #region Level

  public getCurrentLevelIndex(): number | undefined {
    if (this.flashCardLevels.length === 0) {
      return undefined;
    }

    const result = this.flashCardLevels
      .findIndex(level => areArraysEqual(this.enabledFlashCardIds, level.flashCardIds));
    return (result >= 0)
      ? result
      : undefined;
  }

  public getPrevLevelIndex(): number | undefined {
    const currentLevelIndex = this.getCurrentLevelIndex();
    if ((currentLevelIndex === undefined) || (currentLevelIndex === 0)) {
      return undefined;
    }

    return currentLevelIndex - 1;
  }

  public getNextLevelIndex(): number | undefined {
    const currentLevelIndex = this.getCurrentLevelIndex();
    if ((currentLevelIndex === undefined) || (currentLevelIndex >= (this.flashCardLevels.length - 1))) {
      return undefined;
    }

    return currentLevelIndex + 1;
  }

  // TODO: move to view?
  public getLevelDisplayName(levelIndex: number): string {
    const level = this.flashCardLevels[levelIndex];
    return (level.name.length > 0)
      ? `${1 + levelIndex}: ${level.name}`
      : (1 + levelIndex).toString();
  }
  
  public moveToNextLevel() {
    const nextLevelIndex = this.getNextLevelIndex();
    if (nextLevelIndex === undefined) { return; }

    this.activateLevel(nextLevelIndex);
  }
  public moveToPrevLevel() {
    const prevLevelIndex = this.getPrevLevelIndex();
    if (prevLevelIndex === undefined) { return; }

    this.activateLevel(prevLevelIndex);
  }

  private activateLevel(levelIndex: number) {
    const level = this.flashCardLevels[levelIndex];
    const newEnabledFlashCardIds = level.flashCardIds.slice();
    const newConfigData = level.createConfigData(this.configData);

    this.handleChangeEnabledFlashCardsAction(newEnabledFlashCardIds, newConfigData);
  }

  // #endregion

  public getStudySessionInfo(
    containerSize: Size2D,
  ): FlashCardStudySessionInfo {
    const currentFlashCard = Utils.unwrapValueOrUndefined(
      this.flashCards.find(fc => fc.id === this.currentFlashCardId)
    );
    const onUserAnswer = (answerDifficulty: AnswerDifficulty, answer: any) =>
      this.handleUserAnswerAction(this.currentFlashCardId, answer, answerDifficulty);
    const skipFlashCard = () =>
      this.handleSkipFlashCardAction(this.lastCorrectAnswer);

    return new FlashCardStudySessionInfo(
      containerSize, this.flashCardSet, this.flashCards,
      this.enabledFlashCardIds, this.configData, this.currentFlashCardId,
      currentFlashCard, onUserAnswer, skipFlashCard, this.lastCorrectAnswer,
      this.incorrectAnswers, this.studyAlgorithm
    );
  }
}