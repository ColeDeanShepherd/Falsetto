import * as Utils from "./Utils";
import { QuizStats } from './QuizStats';
import { QuestionStats } from './QuestionStats';

export enum AnswerDifficulty {
  Incorrect,
  Hard,
  Medium,
  Easy
}

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
  public enabledQuestionIds: number[];
  public get currentQuestionId(): number | undefined {
    return this._currentQuestionId;
  }
  public get quizStats(): QuizStats {
    return this._quizStats;
  }

  public reset(questionIds: number[]) {
    this.questionIds = questionIds;
    this.enabledQuestionIds = questionIds.slice();
    this._currentQuestionId = undefined;
    this._quizStats = new QuizStats(
      this.questionIds.map(id => new QuestionStats(id, 0, 0))
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
  public abstract getNextQuestionId(): number;

  protected questionIds: number[];
  protected _currentQuestionId: number | undefined;
  protected _quizStats: QuizStats;
}

export class RandomStudyAlgorithm extends StudyAlgorithm {
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    super.onAnswer(answerDifficulty);
  }
  public getNextQuestionId(): number {
    Utils.precondition(this.enabledQuestionIds.length > 0);

    if (this.enabledQuestionIds.length === 1) {
      const questionId = this.enabledQuestionIds[0];

      this._currentQuestionId = questionId;
      return questionId;
    }
    
    let nextQuestionId: number;
    do {
      nextQuestionId = Utils.randomElement(this.enabledQuestionIds);
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
  public reset(questionIds: number[]) {
    super.reset(questionIds);
    
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
  public getNextQuestionId(): number {
    Utils.precondition(this.enabledQuestionIds.length > 0);

    if (this.enabledQuestionIds.length === 1) {
      const questionId = this.enabledQuestionIds[0];

      this._currentQuestionId = questionId;
      return questionId;
    }

    const tierIndex = this.getLowestTierWithNewEnabledQuestion();
    const enabledQuestionIdsInTier = this.tieredQuestionIds[tierIndex]
      .filter(id => Utils.arrayContains(this.enabledQuestionIds, id));

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