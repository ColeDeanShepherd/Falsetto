import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Chord Harmonic Functions", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://davidkulma.com/musictheory/harmonicfunction";
  flashCardGroup.containerHeight = "80px";

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