import * as FlashCardUtils from "../Utils";

import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Chord Family Definitions", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Tonic", "doesn't contain the 4th scale degree"),
    FlashCard.fromRenderFns("Pre-Dominant", "contains only 4th scale degree"),
    FlashCard.fromRenderFns("Dominant", "contains the 4th and 7th scale degrees"),
  ];
}