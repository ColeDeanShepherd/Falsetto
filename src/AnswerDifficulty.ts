export enum AnswerDifficulty {
  Incorrect,
  Hard,
  Medium,
  Easy
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