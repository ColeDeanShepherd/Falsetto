import * as Utils from "./Utils";
import { QuizStats } from "./QuizStats";
import { QuestionStats } from "./QuestionStats";
import { CustomNextFlashCardIdFilter as CustomNextFlashCardIdFilterFn } from './FlashCardSet';
import { FlashCard } from './FlashCard';
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
  public enabledQuestionIds: number[] = [];
  public customNextQuestionIdFilter?: CustomNextFlashCardIdFilterFn;

  public get currentQuestionId(): number | undefined {
    return this._currentQuestionId;
  }
  public get quizStats(): QuizStats {
    return this._quizStats;
  }

  public reset(questionIds: number[], flashCards: Array<FlashCard>) {
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
  public getNextQuestionId(): number {
    const enabledQuestionIds = this.customNextQuestionIdFilter
      ? this.customNextQuestionIdFilter(this, this._flashCards, this.enabledQuestionIds)
      : this.enabledQuestionIds;
      
    Utils.assert(enabledQuestionIds.length > 0);

    return this.getNextQuestionIdInternal(enabledQuestionIds);
  }

  protected abstract getNextQuestionIdInternal(enabledQuestionIds: number[]): number;

  protected _flashCards: Array<FlashCard> = [];
  protected _questionIds: number[] = [];
  protected _currentQuestionId: number | undefined;
  protected _quizStats: QuizStats = new QuizStats([]);
}

export class RandomStudyAlgorithm extends StudyAlgorithm {
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    super.onAnswer(answerDifficulty);
  }
  public getNextQuestionIdInternal(enabledQuestionIds: number[]): number {
    if (enabledQuestionIds.length === 1) {
      const questionId = enabledQuestionIds[0];

      this._currentQuestionId = questionId;
      return questionId;
    }
    
    let nextQuestionId: number;
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

    this.tieredQuestionIds = new Array<Array<number>>(numTiers);
    for (let i = 0; i < this.tieredQuestionIds.length; i++) {
      this.tieredQuestionIds[i] = new Array<number>();
    }
  }
  public reset(questionIds: number[], flashCards: Array<FlashCard>) {
    super.reset(questionIds, flashCards);
    
    this.tieredQuestionIds[0] = this.enabledQuestionIds.slice();
    for (let i = 1; i < this.tieredQuestionIds.length; i++) {
      this.tieredQuestionIds[i] = new Array<number>();
    }
  }
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    Utils.precondition(this.currentQuestionId !== undefined);

    super.onAnswer(answerDifficulty);

    const oldTierIndex = this.getTierIndex(this.currentQuestionId as number);
    const newTierIndex = isAnswerDifficultyCorrect(answerDifficulty)
      ? Math.min(oldTierIndex + 1, this.tieredQuestionIds.length - 1)
      : 0;
    
    if (newTierIndex !== oldTierIndex) {
      const removedFromOldTier = Utils.tryRemoveArrayElement(
        this.tieredQuestionIds[oldTierIndex],
        this.currentQuestionId as number
      );
      Utils.assert(removedFromOldTier);

      this.tieredQuestionIds[newTierIndex].push(this.currentQuestionId as number);
    }
  }
  public getNextQuestionIdInternal(enabledQuestionIds: number[]): number {
    console.log(enabledQuestionIds.length);
    if (enabledQuestionIds.length === 1) {
      const questionId = enabledQuestionIds[0];

      this._currentQuestionId = questionId;
      return questionId;
    }

    const tierIndex = this.getLowestTierWithNewEnabledQuestion();
    const enabledQuestionIdsInTier = this.tieredQuestionIds[tierIndex]
      .filter(id => Utils.arrayContains(enabledQuestionIds, id));

    let nextQuestionId: number;
    do {
      nextQuestionId = Utils.randomElement(enabledQuestionIdsInTier);
    } while(nextQuestionId === this._currentQuestionId);

    this._currentQuestionId = nextQuestionId;
    return nextQuestionId;
  }

  private tieredQuestionIds: Array<Array<number>>;

  private getTierIndex(questionId: number): number {
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