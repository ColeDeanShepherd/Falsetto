import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Chord Harmonic Functions", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://davidkulma.com/musictheory/harmonicfunction";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("1", "Tonic"),
    FlashCard.fromRenderFns("2", "Pre-Dominant"),
    FlashCard.fromRenderFns("3", "Tonic"),
    FlashCard.fromRenderFns("4", "Pre-Dominant"),
    FlashCard.fromRenderFns("5", "Dominant"),
    FlashCard.fromRenderFns("6", "Tonic"),
    FlashCard.fromRenderFns("7", "Dominant"),
  ];
}