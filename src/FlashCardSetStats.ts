import * as Utils from "./Utils";
import { FlashCardStats } from "./FlashCardStats";

export class FlashCardSetStats {
  public constructor(
    public flashCardSetId: string,
    public flashCardStats: Array<FlashCardStats>
  ) {}
  
  public get numCorrectGuesses(): number {
    return Utils.sumNumbers(this.flashCardStats.map(x => x.numCorrectGuesses));
  }
  public get numIncorrectGuesses(): number {
    return Utils.sumNumbers(this.flashCardStats.map(x => x.numIncorrectGuesses));
  }
}