import { FlashCardStats } from "./FlashCardStats";
import { sumNumbers } from '../lib/Core/ArrayUtils';

export class FlashCardSetStats {
  public constructor(
    public flashCardSetId: string,
    public flashCardStats: Array<FlashCardStats>
  ) {}
  
  public get numCorrectGuesses(): number {
    return sumNumbers(this.flashCardStats.map(x => x.numCorrectGuesses));
  }
  public get numIncorrectGuesses(): number {
    return sumNumbers(this.flashCardStats.map(x => x.numIncorrectGuesses));
  }
}