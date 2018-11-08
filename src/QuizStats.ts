import * as Utils from "./Utils";
import { QuestionStats } from "./QuestionStats";

export class QuizStats<T> {
  public constructor(
    public questionStats: Array<QuestionStats<T>>
  ) {}
  
  public get numCorrectGuesses(): number {
    return Utils.sumNumbers(this.questionStats.map(x => x.numCorrectGuesses));
  }
  public get numIncorrectGuesses(): number {
    return Utils.sumNumbers(this.questionStats.map(x => x.numIncorrectGuesses));
  }
}