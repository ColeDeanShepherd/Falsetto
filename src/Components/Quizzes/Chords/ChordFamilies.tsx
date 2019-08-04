import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "diatonicChordFamilies";

export function createFlashCardGroup(): FlashCardSet {
  const flashCardGroup = new FlashCardSet(flashCardSetId, "Chord Harmonic Functions", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://davidkulma.com/musictheory/harmonicfunction";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 1 }),
      "1", "Tonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 2 }),
      "2", "Pre-Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 3 }),
      "3", "Tonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 4 }),
      "4", "Pre-Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 5 }),
      "5", "Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 6 }),
      "6", "Tonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: 7 }),
      "7", "Dominant"),
  ];
}