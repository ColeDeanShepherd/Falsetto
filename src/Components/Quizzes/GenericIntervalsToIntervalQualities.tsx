import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Generic Intervals To Interval Qualities", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1st", "perfect"),
    new FlashCard("2nd", "imperfect"),
    new FlashCard("3rd", "imperfect"),
    new FlashCard("4th", "perfect"),
    new FlashCard("5th", "perfect"),
    new FlashCard("6th", "imperfect"),
    new FlashCard("7th", "imperfect"),
    new FlashCard("8th", "perfect"),
  ];
}