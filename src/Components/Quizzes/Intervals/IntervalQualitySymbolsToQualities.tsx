import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

const flashCardSetId = "intervalQualitySymbols";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup(flashCardSetId, "Interval Quality Symbols", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://method-behind-the-music.com/theory/intervals/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "m" }),
      "m", "minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M" }),
      "M", "major"),
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