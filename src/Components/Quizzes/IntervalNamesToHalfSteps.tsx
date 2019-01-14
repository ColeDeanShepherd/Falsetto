import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Interval Names To Half Steps", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Unison", "0"),
    new FlashCard("m2", "1"),
    new FlashCard("M2", "2"),
    new FlashCard("m3", "3"),
    new FlashCard("M3", "4"),
    new FlashCard("P4", "5"),
    new FlashCard("A4/d5", "6"),
    new FlashCard("P5", "7"),
    new FlashCard("m6", "8"),
    new FlashCard("M6", "9"),
    new FlashCard("m7", "10"),
    new FlashCard("M7", "11"),
    new FlashCard("P8", "12"),
  ];
}