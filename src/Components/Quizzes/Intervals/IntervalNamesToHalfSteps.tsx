import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "intervalHalfSteps";

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Interval Semitones", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/chords-intervals/";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "P0" }),
      "Unison", "0"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "m2" }),
      "m2", "1"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "M2" }),
      "M2", "2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "m3" }),
      "m3", "3"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "M3" }),
      "M3", "4"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "P4" }),
      "P4", "5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "A4/d5" }),
      "A4/d5", "6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "P5" }),
      "P5", "7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "m6" }),
      "m6", "8"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "M6" }),
      "M6", "9"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "m7" }),
      "m7", "10"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "M7" }),
      "M7", "11"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: "P8" }),
      "P8", "12"),
  ];
}