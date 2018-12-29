import * as Utils from "./Utils";
import { FlashCard } from './FlashCard';
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
  public enabledFlashCardIndices: Array<number>;
  public get currentFlashCardIndex(): number | undefined {
    return this._currentFlashCardIndex;
  }
  public get quizStats(): QuizStats<string> {
    return this._quizStats;
  }

  public reset(flashCards: Array<FlashCard>) {
    this.flashCards = flashCards;
    this.enabledFlashCardIndices = this.flashCards.map((_, i) => i);
    this._currentFlashCardIndex = undefined;
    this._quizStats = new QuizStats<string>(
      this.flashCards.map(_ => new QuestionStats<string>(0, 0))
    );
  }
  public onAnswer(answerDifficulty: AnswerDifficulty): void {
    Utils.precondition(this._currentFlashCardIndex !== undefined);

    const questionStats = this._quizStats.questionStats[this._currentFlashCardIndex as number];

    if (isAnswerDifficultyCorrect(answerDifficulty)) {
      questionStats.numCorrectGuesses++;
    } else {
      questionStats.numIncorrectGuesses++;
    }
  }
  public abstract getNextFlashCardIndex(): number;

  protected flashCards: Array<FlashCard>;
  protected _currentFlashCardIndex: number | undefined;
  protected _quizStats: QuizStats<string>;
}

export class RandomStudyAlgorithm extends StudyAlgorithm {
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    super.onAnswer(answerDifficulty);
  }
  public getNextFlashCardIndex(): number {
    Utils.precondition(this.enabledFlashCardIndices.length > 0);

    if (this.enabledFlashCardIndices.length === 1) {
      const flashCardIndex = this.enabledFlashCardIndices[0];

      this._currentFlashCardIndex = flashCardIndex;
      return flashCardIndex;
    }
    
    let nextFlashCardIndex: number;
    do {
      nextFlashCardIndex = Utils.randomElement(this.enabledFlashCardIndices);
    } while(nextFlashCardIndex === this._currentFlashCardIndex);

    this._currentFlashCardIndex = nextFlashCardIndex;
    return nextFlashCardIndex;
  }
}

export class LeitnerStudyAlgorithm extends StudyAlgorithm {
  public constructor(numTiers: number) {
    Utils.invariant(Number.isInteger(numTiers) && (numTiers > 0));
    super();

    this.tieredFlashCardIndices = new Array<Array<number>>(numTiers);
    for (let i = 0; i < this.tieredFlashCardIndices.length; i++) {
      this.tieredFlashCardIndices[i] = new Array<number>();
    }
  }
  public reset(flashCards: Array<FlashCard>) {
    super.reset(flashCards);
    
    this.tieredFlashCardIndices[0] = this.enabledFlashCardIndices.slice();
    for (let i = 1; i < this.tieredFlashCardIndices.length; i++) {
      this.tieredFlashCardIndices[i] = new Array<number>();
    }
  }
  public onAnswer(answerDifficulty: AnswerDifficulty) {
    Utils.precondition(this.currentFlashCardIndex !== undefined);

    super.onAnswer(answerDifficulty);

    const oldTierIndex = this.getTierIndex(this.currentFlashCardIndex as number);
    const newTierIndex = isAnswerDifficultyCorrect(answerDifficulty)
      ? Math.min(oldTierIndex + 1, this.tieredFlashCardIndices.length - 1)
      : 0;
    
    if (newTierIndex !== oldTierIndex) {
      const removedFromOldTier = Utils.tryRemoveArrayElement(
        this.tieredFlashCardIndices[oldTierIndex],
        this.currentFlashCardIndex as number
      );
      Utils.assert(removedFromOldTier);

      this.tieredFlashCardIndices[newTierIndex].push(this.currentFlashCardIndex as number);
    }
  }
  public getNextFlashCardIndex(): number {
    Utils.precondition(this.enabledFlashCardIndices.length > 0);

    if (this.enabledFlashCardIndices.length === 1) {
      const flashCardIndex = this.enabledFlashCardIndices[0];

      this._currentFlashCardIndex = flashCardIndex;
      return flashCardIndex;
    }

    const tierIndex = this.getLowestTierWithNewEnabledFlashCard();
    const enabledFlashCardIndicesInTier = this.tieredFlashCardIndices[tierIndex]
      .filter(i => Utils.arrayContains(this.enabledFlashCardIndices, i));

    let nextFlashCardIndex: number;
    do {
      nextFlashCardIndex = Utils.randomElement(enabledFlashCardIndicesInTier);
    } while(nextFlashCardIndex === this._currentFlashCardIndex);

    this._currentFlashCardIndex = nextFlashCardIndex;
    return nextFlashCardIndex;
  }

  private tieredFlashCardIndices: Array<Array<number>>;

  private getTierIndex(flashCardIndex: number): number {
    for (let tierIndex = 0; tierIndex < this.tieredFlashCardIndices.length; tierIndex++) {
      if (Utils.arrayContains(this.tieredFlashCardIndices[tierIndex], flashCardIndex)) {
        return tierIndex;
      }
    }

    Utils.assert(false);
    return -1;
  }
  private getLowestTierWithNewEnabledFlashCard(): number {
    for (let tierIndex = 0; tierIndex < this.tieredFlashCardIndices.length; tierIndex++) {
      if (this.tieredFlashCardIndices[tierIndex].some(i =>
        (i !== this._currentFlashCardIndex) && Utils.arrayContains(this.enabledFlashCardIndices, i))
      ) {
        return tierIndex;
      }
    }

    Utils.assert(false);
    return -1;
  }
}