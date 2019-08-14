import * as Utils from "./Utils";
import { QuizStats } from "./QuizStats";
import { QuestionStats } from "./QuestionStats";
import { CustomNextFlashCardIdFilter as CustomNextFlashCardIdFilterFn } from './FlashCardSet';
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
  public enabledQuestionIds: Array<FlashCardId> = [];
  public customNextQuestionIdFilter?: CustomNextFlashCardIdFilterFn;

  public get currentQuestionId(): FlashCardId | undefined {
    return this._currentQuestionId;
  }
  public get quizStats(): QuizStats {
    return this._quizStats;
  }

  public reset(questionIds: Array<FlashCardId>, flashCards: Array<FlashCard>) {
    this._questionIds = questionIds;
    this._flashCards = flashCards;
    this.enabledQuestionIds = questionIds.slice();
    this._currentQuestionId = undefined;
    this._quizStats = new QuizStats(
      this._questionIds.map(id => new QuestionStats(id, 0, 0))
    );
  }
  public onAnswer(answerDifficulty: AnswerDifficulty): void {
    Utils.precondition(this._currentQuestionId !== undefined);

    const questionStats = this._quizStats.questionStats.find(qs => qs.questionId === this._currentQuestionId);
    if (!questionStats) {
      Utils.assert(false);
      return;
    }
    
    if (isAnswerDifficultyCorrect(answerDifficulty)) {
      questionStats.numCorrectGuesses++;
    } else {
      questionStats.numIncorrectGuesses++;
    }
  }
  public getNextQuestionId(): FlashCardId {
    const enabledQuestionIds = this.customNextQuestionIdFilter
      ? this.customNextQuestionIdFilter(this, this._flashCards, this.enabledQuestionIds)
      : this.enabledQuestionIds;
      
    Utils.assert(enabledQuestionIds.length > 0);

    return this.getNextQuestionIdInternal(enabledQuestionIds);
  }

  protected abstract getNextQuestionIdInternal(enabledQuestionIds: FlashCardId[]): FlashCardId;

  protected _flashCards: Array<FlashCard> = [];
  protected _questionIds: Array<FlashCardId> = [];
  protected _currentQuestionId: FlashCardId | undefined;
  protected _quizStats: QuizStats = new QuizStats([]);
}

export class RandomStudyAlgorithm extends StudyAlgorithm {
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    super.onAnswer(answerDifficulty);
  }
  public getNextQuestionIdInternal(enabledQuestionIds: FlashCardId[]): FlashCardId {
    if (enabledQuestionIds.length === 1) {
      const questionId = enabledQuestionIds[0];

      this._currentQuestionId = questionId;
      return questionId;
    }
    
    let nextQuestionId: FlashCardId;
    do {
      nextQuestionId = Utils.randomElement(enabledQuestionIds);
    } while(nextQuestionId === this._currentQuestionId);

    this._currentQuestionId = nextQuestionId;
    return nextQuestionId;
  }
}

export class LeitnerStudyAlgorithm extends StudyAlgorithm {
  public constructor(numTiers: number) {
    Utils.invariant(Number.isInteger(numTiers) && (numTiers > 0));
    super();

    this.tieredQuestionIds = new Array<Array<FlashCardId>>(numTiers);
    for (let i = 0; i < this.tieredQuestionIds.length; i++) {
      this.tieredQuestionIds[i] = new Array<FlashCardId>();
    }
  }
  public reset(questionIds: Array<FlashCardId>, flashCards: Array<FlashCard>) {
    super.reset(questionIds, flashCards);
    
    this.tieredQuestionIds[0] = this.enabledQuestionIds.slice();
    for (let i = 1; i < this.tieredQuestionIds.length; i++) {
      this.tieredQuestionIds[i] = new Array<FlashCardId>();
    }
  }
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    Utils.precondition(this.currentQuestionId !== undefined);

    const currentFlashCardId = Utils.unwrapValueOrUndefined(this.currentQuestionId);

    super.onAnswer(answerDifficulty);

    const oldTierIndex = this.getTierIndex(currentFlashCardId);
    const newTierIndex = isAnswerDifficultyCorrect(answerDifficulty)
      ? Math.min(oldTierIndex + 1, this.tieredQuestionIds.length - 1)
      : 0;
    
    if (newTierIndex !== oldTierIndex) {
      const removedFromOldTier = Utils.tryRemoveArrayElement(
        this.tieredQuestionIds[oldTierIndex],
        currentFlashCardId
      );
      Utils.assert(removedFromOldTier);

      this.tieredQuestionIds[newTierIndex].push(currentFlashCardId);
    }
  }
  public getNextQuestionIdInternal(enabledQuestionIds: Array<FlashCardId>): FlashCardId {
    console.log(enabledQuestionIds.length);
    if (enabledQuestionIds.length === 1) {
      const questionId = enabledQuestionIds[0];

      this._currentQuestionId = questionId;
      return questionId;
    }

    const tierIndex = this.getLowestTierWithNewEnabledQuestion();
    const enabledQuestionIdsInTier = this.tieredQuestionIds[tierIndex]
      .filter(id => Utils.arrayContains(enabledQuestionIds, id));

    let nextQuestionId: FlashCardId;
    do {
      nextQuestionId = Utils.randomElement(enabledQuestionIdsInTier);
    } while(nextQuestionId === this._currentQuestionId);

    this._currentQuestionId = nextQuestionId;
    return nextQuestionId;
  }

  private tieredQuestionIds: Array<Array<FlashCardId>>;

  private getTierIndex(questionId: FlashCardId): number {
    for (let tierIndex = 0; tierIndex < this.tieredQuestionIds.length; tierIndex++) {
      if (Utils.arrayContains(this.tieredQuestionIds[tierIndex], questionId)) {
        return tierIndex;
      }
    }

    Utils.assert(false);
    return -1;
  }
  private getLowestTierWithNewEnabledQuestion(): number {
    for (let tierIndex = 0; tierIndex < this.tieredQuestionIds.length; tierIndex++) {
      if (this.tieredQuestionIds[tierIndex].some(id =>
        (id !== this._currentQuestionId) && Utils.arrayContains(this.enabledQuestionIds, id))
      ) {
        return tierIndex;
      }
    }

    Utils.assert(false);
    return -1;
  }
}