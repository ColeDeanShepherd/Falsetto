export class QuestionStats<T> {
  public constructor(
    public numCorrectGuesses: number,
    public numIncorrectGuesses: number
  ) {}
}