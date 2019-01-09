export class QuestionStats {
  public constructor(
    public questionId: any,
    public numCorrectGuesses: number,
    public numIncorrectGuesses: number
  ) {}
}