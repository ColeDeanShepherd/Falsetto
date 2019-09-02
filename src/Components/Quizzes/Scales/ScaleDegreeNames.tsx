import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "scaleDegreeNames";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Degree Names", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://musictheoryblog.blogspot.com/2007/01/scale-degrees.html";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "1" }),
      "1", "Tonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "2" }),
      "2", "Supertonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "3" }),
      "3", "Mediant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "4" }),
      "4", "Subdominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "5" }),
      "5", "Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "6" }),
      "6", "Submediant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "7" }),
      "7 (in major)", "Leading Tone"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scaleDegree: "7min" }),
      "7 (in minor)", "Subtonic"),
  ];
}

export const flashCardSet = createFlashCardSet();