import * as Utils from "../../Utils";
import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Chord Harmonic Functions", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://davidkulma.com/musictheory/harmonicfunction";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "Tonic"),
    new FlashCard("2", "Pre-Dominant"),
    new FlashCard("3", "Tonic"),
    new FlashCard("4", "Pre-Dominant"),
    new FlashCard("5", "Dominant"),
    new FlashCard("6", "Tonic"),
    new FlashCard("7", "Dominant"),
  ];
}