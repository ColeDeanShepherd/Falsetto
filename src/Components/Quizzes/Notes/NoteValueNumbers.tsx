import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Note Value Numbers", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.containerHeight = "80px";
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/overview/";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  const flashCardSetId = "noteVal#s";

  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 1 }),
      "1", "Whole Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 2 }),
      "2", "Half Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 4 }),
      "4", "Quarter Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 8 }),
      "8", "Eighth Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 16 }),
      "16", "Sixteenth Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 32 }),
      "32", "32nd Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 64 }),
      "64", "64th Note/Rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, num: 128 }),
      "128", "128th Note/Rest")
  ];
}