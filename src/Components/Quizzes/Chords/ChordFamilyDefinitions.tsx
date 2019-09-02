import * as FlashCardUtils from "../Utils";

import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "diatonicChordFamilyDefinitions";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Family Definitions", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, family: "Tonic" }),
      "Tonic", "doesn't contain the 4th scale degree"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, family: "Pre-Dominant" }),
      "Pre-Dominant", "contains only 4th scale degree"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, family: "Dominant" }),
      "Dominant", "contains the 4th and 7th scale degrees"),
  ];
}

export const flashCardSet = createFlashCardSet();