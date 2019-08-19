import * as Utils from "./Utils";
import { FlashCardSetStats } from "./FlashCardSetStats";
import { FlashCardStats } from "./FlashCardStats";
import { CustomNextFlashCardIdFilter as CustomNextFlashCardIdFilterFn, FlashCardStudySessionInfo } from './FlashCardSet';
import { FlashCard, FlashCardId } from './FlashCard';
import { AnswerDifficulty } from './AnswerDifficulty';

export function isAnswerDifficultyCorrect(answerDifficulty: AnswerDifficulty): boolean {
  switch (answerDifficulty) {
    case AnswerDifficulty.Incorrect:
      return false;
    case AnswerDifficulty.Hard:
    case AnswerDifficulty.Medium:
    case AnswerDifficulty.Easy:
      return true;
    default:
      throw new Error(`Unknown answer difficulty ${answerDifficulty}`);
  }
}

export abstract class StudyAlgorithm {
  public enabledFlashCardIds: Array<FlashCardId> = [];
  public customNextFlashCardIdFilter?: CustomNextFlashCardIdFilterFn;

  public get currentFlashCardId(): FlashCardId | undefined {
    return this._currentFlashCardId;
  }
  public get flashCardSetStats(): FlashCardSetStats {
    return this._flashCardSetStats;
  }

  public reset(flashCardIds: Array<FlashCardId>, flashCards: Array<FlashCard>) {
    this._flashCardIds = flashCardIds;
    this._flashCards = flashCards;
    this.enabledFlashCardIds = flashCardIds.slice();
    this._currentFlashCardId = undefined;
    this._flashCardSetStats = new FlashCardSetStats(
      this._flashCardIds.map(id => new FlashCardStats(id, 0, 0))
    );
  }
  public onAnswer(answerDifficulty: AnswerDifficulty): void {
    Utils.precondition(this._currentFlashCardId !== undefined);

    const flashCardStats = this._flashCardSetStats.flashCardStats.find(qs => qs.flashCardId === this._currentFlashCardId);
    if (!flashCardStats) {
      Utils.assert(false);
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
      
    Utils.assert(enabledFlashCardIds.length > 0);

    return this.getNextFlashCardIdInternal(enabledFlashCardIds);
  }

  protected abstract getNextFlashCardIdInternal(enabledFlashCardIds: FlashCardId[]): FlashCardId;

  protected _flashCards: Array<FlashCard> = [];
  protected _flashCardIds: Array<FlashCardId> = [];
  protected _currentFlashCardId: FlashCardId | undefined;
  protected _flashCardSetStats: FlashCardSetStats = new FlashCardSetStats([]);
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
      nextFlashCardId = Utils.randomElement(enabledFlashCardIds);
    } while(nextFlashCardId === this._currentFlashCardId);

    this._currentFlashCardId = nextFlashCardId;
    return nextFlashCardId;
  }
}

export class LeitnerStudyAlgorithm extends StudyAlgorithm {
  public constructor(numTiers: number) {
    Utils.invariant(Number.isInteger(numTiers) && (numTiers > 0));
    super();

    this.tieredFlashCardIds = new Array<Array<FlashCardId>>(numTiers);
    for (let i = 0; i < this.tieredFlashCardIds.length; i++) {
      this.tieredFlashCardIds[i] = new Array<FlashCardId>();
    }
  }
  public reset(flashCardIds: Array<FlashCardId>, flashCards: Array<FlashCard>) {
    super.reset(flashCardIds, flashCards);
    
    this.tieredFlashCardIds[0] = this.enabledFlashCardIds.slice();
    for (let i = 1; i < this.tieredFlashCardIds.length; i++) {
      this.tieredFlashCardIds[i] = new Array<FlashCardId>();
    }
  }
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    Utils.precondition(this.currentFlashCardId !== undefined);

    const currentFlashCardId = Utils.unwrapValueOrUndefined(this.currentFlashCardId);

    super.onAnswer(answerDifficulty);

    const oldTierIndex = this.getTierIndex(currentFlashCardId);
    const newTierIndex = isAnswerDifficultyCorrect(answerDifficulty)
      ? Math.min(oldTierIndex + 1, this.tieredFlashCardIds.length - 1)
      : 0;
    
    if (newTierIndex !== oldTierIndex) {
      const removedFromOldTier = Utils.tryRemoveArrayElement(
        this.tieredFlashCardIds[oldTierIndex],
        currentFlashCardId
      );
      Utils.assert(removedFromOldTier);

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
      .filter(id => Utils.arrayContains(enabledFlashCardIds, id));

    let nextFlashCardId: FlashCardId;
    do {
      nextFlashCardId = Utils.randomElement(enabledFlashCardIdsInTier);
    } while(nextFlashCardId === this._currentFlashCardId);

    this._currentFlashCardId = nextFlashCardId;
    return nextFlashCardId;
  }

  private tieredFlashCardIds: Array<Array<FlashCardId>>;

  private getTierIndex(flashCardId: FlashCardId): number {
    for (let tierIndex = 0; tierIndex < this.tieredFlashCardIds.length; tierIndex++) {
      if (Utils.arrayContains(this.tieredFlashCardIds[tierIndex], flashCardId)) {
        return tierIndex;
      }
    }

    Utils.assert(false);
    return -1;
  }
  private getLowestTierWithNewEnabledFlashCard(): number {
    for (let tierIndex = 0; tierIndex < this.tieredFlashCardIds.length; tierIndex++) {
      if (this.tieredFlashCardIds[tierIndex].some(id =>
        (id !== this._currentFlashCardId) && Utils.arrayContains(this.enabledFlashCardIds, id))
      ) {
        return tierIndex;
      }
    }

    Utils.assert(false);
    return -1;
  }
}