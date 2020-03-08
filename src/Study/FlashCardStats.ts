export class FlashCardStats {
  public constructor(
    public flashCardId: string,
    public numCorrectGuesses: number,
    public numIncorrectGuesses: number
  ) {}

  public get numGuesses(): number {
    return this.numCorrectGuesses + this.numIncorrectGuesses;
  }
  public get percentCorrect(): number {
    return (this.numGuesses > 0)
      ? (this.numCorrectGuesses / this.numGuesses)
      : 0;
  }
}