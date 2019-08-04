import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Generic Intervals To Interval Qualities", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  const flashCardSetId = "genericIntervalQualities";

  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 1 }),
      "1st", "perfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 2 }),
      "2nd", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 3 }),
      "3rd", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 4 }),
      "4th", "perfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 5 }),
      "5th", "perfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 6 }),
      "6th", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 7 }),
      "7th", "imperfect"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, int: 8 }),
      "8th", "perfect"),
  ];
}