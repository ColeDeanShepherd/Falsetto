import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Interval Quality Symbols To Qualities", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("m", "minor"),
    new FlashCard("M", "major"),
    new FlashCard("A", "augmented"),
    new FlashCard("d", "diminished"),
    new FlashCard("P", "perfect"),
  ];
}
export function createQuiz(): Quiz {
  const intervalQualitySymbols = [
    "m",
    "M",
    "A",
    "d",
    "P"
  ];
  const intervalQualities = [
    "minor",
    "major",
    "augmented",
    "diminished",
    "perfect"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Interval Names to Half Steps",
    intervalQualitySymbols,
    intervalQualities,
    intervalQualities,
    false
  );
}