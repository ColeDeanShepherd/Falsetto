import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "scaleDegNames";

export function createFlashCardGroup(): FlashCardSet {
  const flashCardGroup = new FlashCardSet(flashCardSetId, "Scale Degree Names", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://musictheoryblog.blogspot.com/2007/01/scale-degrees.html";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "1" }),
      "1", "Tonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "2" }),
      "2", "Supertonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "3" }),
      "3", "Mediant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "4" }),
      "4", "Subdominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "5" }),
      "5", "Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "6" }),
      "6", "Submediant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "7" }),
      "7 (in major)", "Leading Tone"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDeg: "7min" }),
      "7 (in minor)", "Subtonic"),
  ];
}