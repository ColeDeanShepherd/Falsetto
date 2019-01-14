import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Intervals To Consonance Dissonance", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("m2", "sharp dissonance"),
    new FlashCard("M2", "mild dissonance"),
    new FlashCard("m3", "soft consonance"),
    new FlashCard("M3", "soft consonance"),
    new FlashCard("P4", "consonance or dissonance"),
    new FlashCard("A4/d5", "neutral or restless"),
    new FlashCard("P5", "open consonance"),
    new FlashCard("m6", "soft consonance"),
    new FlashCard("M6", "soft consonance"),
    new FlashCard("m7", "mild dissonance"),
    new FlashCard("M7", "sharp dissonance"),
    new FlashCard("P8", "open consonance"),
  ];
}