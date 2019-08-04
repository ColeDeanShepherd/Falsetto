import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Interval Semitones", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/chords-intervals/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  const flashCardSetId = "intervalHalfSteps";

  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 0 }),
      "Unison", "0"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 1 }),
      "m2", "1"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 2 }),
      "M2", "2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 3 }),
      "m3", "3"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 4 }),
      "M3", "4"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 5 }),
      "P4", "5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 6 }),
      "A4/d5", "6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 7 }),
      "P5", "7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 8 }),
      "m6", "8"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 9 }),
      "M6", "9"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 10 }),
      "m7", "10"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 11 }),
      "M7", "11"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, answer: 12 }),
      "P8", "12"),
  ];
}