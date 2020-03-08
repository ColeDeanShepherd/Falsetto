import * as Utils from "./lib/Core/Utils";
import { FlashCardSetStats } from "./FlashCardSetStats";
import { CustomNextFlashCardIdFilter as CustomNextFlashCardIdFilterFn, FlashCardStudySessionInfo } from './FlashCardSet';
import { FlashCard, FlashCardId } from './FlashCard';
import { AnswerDifficulty, isAnswerDifficultyCorrect } from './AnswerDifficulty';
import { precondition, invariant, assert } from './lib/Core/Dbc';
import { randomElement } from './lib/Core/Random';
import { tryRemoveArrayElement, arrayContains } from './lib/Core/ArrayUtils';

export abstract class StudyAlgorithm {
  public enabledFlashCardIds: Array<FlashCardId> = [];
  public customNextFlashCardIdFilter?: CustomNextFlashCardIdFilterFn;

  public get currentFlashCardId(): FlashCardId | undefined {
    return this._currentFlashCardId;
  }
  public get flashCardSetStats(): FlashCardSetStats {
    return this._flashCardSetStats;
  }

  public reset(
    flashCardIds: Array<FlashCardId>,
    flashCards: Array<FlashCard>,
    stats: FlashCardSetStats
  ) {
    this._flashCardIds = flashCardIds;
    this._flashCards = flashCards;
    this.enabledFlashCardIds = flashCardIds.slice();
    this._currentFlashCardId = undefined;
    this._flashCardSetStats = stats;
  }
  public onAnswer(answerDifficulty: AnswerDifficulty): void {
    precondition(this._currentFlashCardId !== undefined);

    const flashCardStats = this._flashCardSetStats.flashCardStats.find(qs => qs.flashCardId === this._currentFlashCardId);
    if (!flashCardStats) {
      assert(false);
      return;
    }
    
    if (isAnswerDifficultyCorrect(answerDifficulty)) {
      flashCardStats.numCorrectGuesses++;
    } else {
      flashCardStats.numIncorrectGuesses++;
    }
  }
  public getNextFlashCardId(studySessionInfo?: FlashCardStudySessionInfo): FlashCardId {
    // TODO: fix this shit
    const enabledFlashCardIds = (this.customNextFlashCardIdFilter && studySessionInfo)
      ? this.customNextFlashCardIdFilter(studySessionInfo)
      : this.enabledFlashCardIds;
      
    assert(enabledFlashCardIds.length > 0);

    return this.getNextFlashCardIdInternal(enabledFlashCardIds);
  }

  protected abstract getNextFlashCardIdInternal(enabledFlashCardIds: FlashCardId[]): FlashCardId;

  protected _flashCards: Array<FlashCard> = [];
  protected _flashCardIds: Array<FlashCardId> = [];
  protected _currentFlashCardId: FlashCardId | undefined;
  protected _flashCardSetStats: FlashCardSetStats = new FlashCardSetStats("", []);
}

export class RandomStudyAlgorithm extends StudyAlgorithm {
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    super.onAnswer(answerDifficulty);
  }
  public getNextFlashCardIdInternal(enabledFlashCardIds: FlashCardId[]): FlashCardId {
    if (enabledFlashCardIds.length === 1) {
      const flashCardId = enabledFlashCardIds[0];

      this._currentFlashCardId = flashCardId;
      return flashCardId;
    }
    
    let nextFlashCardId: FlashCardId;
    do {
      nextFlashCardId = randomElement(enabledFlashCardIds);
    } while(nextFlashCardId === this._currentFlashCardId);

    this._currentFlashCardId = nextFlashCardId;
    return nextFlashCardId;
  }
}

export class LeitnerStudyAlgorithm extends StudyAlgorithm {
  public constructor(numTiers: number) {
    invariant(Number.isInteger(numTiers) && (numTiers > 0));
    super();

    this.tieredFlashCardIds = new Array<Array<FlashCardId>>(numTiers);
    for (let i = 0; i < this.tieredFlashCardIds.length; i++) {
      this.tieredFlashCardIds[i] = new Array<FlashCardId>();
    }
  }
  public reset(
    flashCardIds: Array<FlashCardId>,
    flashCards: Array<FlashCard>,
    stats: FlashCardSetStats
  ) {
    super.reset(flashCardIds, flashCards, stats);
    
    this.tieredFlashCardIds[0] = this.enabledFlashCardIds.slice();
    for (let i = 1; i < this.tieredFlashCardIds.length; i++) {
      this.tieredFlashCardIds[i] = new Array<FlashCardId>();
    }
  }
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    precondition(this.currentFlashCardId !== undefined);

    const currentFlashCardId = Utils.unwrapValueOrUndefined(this.currentFlashCardId);

    super.onAnswer(answerDifficulty);

    const oldTierIndex = this.getTierIndex(currentFlashCardId);
    const newTierIndex = isAnswerDifficultyCorrect(answerDifficulty)
      ? Math.min(oldTierIndex + 1, this.tieredFlashCardIds.length - 1)
      : 0;
    
    if (newTierIndex !== oldTierIndex) {
      const removedFromOldTier = tryRemoveArrayElement(
        this.tieredFlashCardIds[oldTierIndex],
        currentFlashCardId
      );
      assert(removedFromOldTier);

      this.tieredFlashCardIds[newTierIndex].push(currentFlashCardId);
    }
  }
  public getNextFlashCardIdInternal(enabledFlashCardIds: Array<FlashCardId>): FlashCardId {
    if (enabledFlashCardIds.length === 1) {
      const flashCardId = enabledFlashCardIds[0];

      this._currentFlashCardId = flashCardId;
      return flashCardId;
    }

    const tierIndex = this.getLowestTierWithNewEnabledFlashCard();
    const enabledFlashCardIdsInTier = this.tieredFlashCardIds[tierIndex]
      .filter(id => arrayContains(enabledFlashCardIds, id));

    let nextFlashCardId: FlashCardId;
    do {
      nextFlashCardId = randomElement(enabledFlashCardIdsInTier);
    } while(nextFlashCardId === this._currentFlashCardId);

    this._currentFlashCardId = nextFlashCardId;
    return nextFlashCardId;
  }

  private tieredFlashCardIds: Array<Array<FlashCardId>>;

  private getTierIndex(flashCardId: FlashCardId): number {
    for (let tierIndex = 0; tierIndex < this.tieredFlashCardIds.length; tierIndex++) {
      if (arrayContains(this.tieredFlashCardIds[tierIndex], flashCardId)) {
        return tierIndex;
      }
    }

    assert(false);
    return -1;
  }
  private getLowestTierWithNewEnabledFlashCard(): number {
    for (let tierIndex = 0; tierIndex < this.tieredFlashCardIds.length; tierIndex++) {
      if (this.tieredFlashCardIds[tierIndex].some(id =>
        (id !== this._currentFlashCardId) && arrayContains(this.enabledFlashCardIds, id))
      ) {
        return tierIndex;
      }
    }

    assert(false);
    return -1;
  }
}