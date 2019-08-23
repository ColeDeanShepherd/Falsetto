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
export function answerDifficultyToPercentCorrect(answerDifficulty: AnswerDifficulty): number {
  switch (answerDifficulty) {
    case AnswerDifficulty.Easy:
      return 1;
    case AnswerDifficulty.Medium:
      return 0.85;
    case AnswerDifficulty.Hard:
      return 0.7;
    case AnswerDifficulty.Incorrect:
      return 0;
    default:
      throw new Error(`Unknown AnswerDifficulty: ${answerDifficulty}`);
  }
}