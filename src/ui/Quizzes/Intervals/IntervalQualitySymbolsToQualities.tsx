import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "intervalQualitySymbols";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Interval Quality Symbols", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/intervals";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M" }),
      "M", "major"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "m" }),
      "m", "minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "A" }),
      "A", "augmented"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "d" }),
      "d", "diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "P" }),
      "P", "perfect"),
  ];
}

export const flashCardSet = createFlashCardSet();