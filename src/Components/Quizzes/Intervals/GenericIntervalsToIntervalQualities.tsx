import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "genericIntervalQualities";

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Generic Intervals To Interval Qualities", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 1 }),
      "1st", "perfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 2 }),
      "2nd", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 3 }),
      "3rd", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 4 }),
      "4th", "perfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 5 }),
      "5th", "perfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 6 }),
      "6th", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 7 }),
      "7th", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, interval: 8 }),
      "8th", "perfect"),
  ];
}