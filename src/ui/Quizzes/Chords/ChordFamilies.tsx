import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "diatonicChordFamilies";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Harmonic Functions", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "https://davidkulma.com/musictheory/harmonicfunction";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 1 }),
      "1", "Tonic"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 2 }),
      "2", "Pre-Dominant"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 3 }),
      "3", "Tonic"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 4 }),
      "4", "Pre-Dominant"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 5 }),
      "5", "Dominant"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 6 }),
      "6", "Tonic"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scaleDegree: 7 }),
      "7", "Dominant"),
  ];
}

export const flashCardSet = createFlashCardSet();