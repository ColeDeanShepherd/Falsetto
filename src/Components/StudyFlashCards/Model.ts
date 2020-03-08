import * as Utils from "../../Utils";
import { AnswerDifficulty, answerDifficultyToPercentCorrect, isAnswerDifficultyCorrect } from "../../AnswerDifficulty";
import { FlashCardSet, FlashCardLevel } from '../../FlashCardSet';
import { IDatabase, FlashCardAnswer } from '../../Database';
import { FlashCardSetStats } from '../../FlashCardSetStats';
import { FlashCardStats } from '../../FlashCardStats';
import { FlashCard } from '../../FlashCard';

export function getFlashCardSetStatsFromAnswers(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, answers: Array<FlashCardAnswer>
): FlashCardSetStats {
  const minPctCorrect = answerDifficultyToPercentCorrect(AnswerDifficulty.Easy);
  const flashCardStats = flashCards
    .map(fc => {
      const numCorrectGuesses = Utils.arrayCountPassing(
        answers, a => (a.flashCardId === fc.id) && (a.percentCorrect >= minPctCorrect)
      );
      const numIncorrectGuesses = Utils.arrayCountPassing(
        answers, a => (a.flashCardId === fc.id) && (a.percentCorrect < minPctCorrect)
      );
      return new FlashCardStats(fc.id, numCorrectGuesses, numIncorrectGuesses);
    });
    return new FlashCardSetStats(flashCardSet.id, flashCardStats);
}

export const MIN_PCT_CORRECT_FLASH_CARD_LEVEL = 0.85;
export function getCurrentFlashCardLevel(
  flashCardSet: FlashCardSet, flashCardLevels: Array<FlashCardLevel>, flashCardSetStats: FlashCardSetStats
): [number, FlashCardLevel] {
  for (let i = 0; i < flashCardLevels.length - 1; i++) {
    const level = flashCardLevels[i];
    const percentToNextLevel = getPercentToNextLevel(level, flashCardSetStats);
    if (percentToNextLevel < MIN_PCT_CORRECT_FLASH_CARD_LEVEL) {
      return [i, level];
    }
  }

  const lastLevelIndex = flashCardLevels.length - 1;
  return [lastLevelIndex, flashCardLevels[lastLevelIndex]];
}

export function getPercentToNextLevel(currentFlashCardLevel: FlashCardLevel, flashCardSetStats: FlashCardSetStats): number {
  const percentCorrects = flashCardSetStats.flashCardStats
    .filter(qs => Utils.arrayContains(currentFlashCardLevel.flashCardIds, qs.flashCardId))
    .map(qs => qs.percentCorrect);
  return Utils.sum(percentCorrects, p => Math.min(p, MIN_PCT_CORRECT_FLASH_CARD_LEVEL) / percentCorrects.length) / (MIN_PCT_CORRECT_FLASH_CARD_LEVEL - 0.001);
}