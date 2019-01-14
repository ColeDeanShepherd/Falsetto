import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Degree Names", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "Tonic"),
    new FlashCard("2", "Supertonic"),
    new FlashCard("3", "Mediant"),
    new FlashCard("4", "Subdominant"),
    new FlashCard("5", "Dominant"),
    new FlashCard("6", "Submediant"),
    new FlashCard("7 (in major)", "Leading Tone"),
    new FlashCard("7 (in minor)", "Subtonic"),
  ];
}