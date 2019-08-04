import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

const flashCardSetId = "availableChordTensions";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup(flashCardSetId, "Available Chord Tensions", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "maj7" }),
      "Maj7", "9, #11, 13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "m7" }),
      "m7", "9, 11, 13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "halfDim7" }),
      "ø7", "9, 11, b13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "mMaj7" }),
      "mMaj7", "9, 11, 13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "augMaj7" }),
      "Maj+7", "9, #11"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "dim7" }),
      "o", "9, 11, b13, 7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "7" }),
      "7", "b9, 9, #9, #11, b13, 13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "7sus" }),
      "7sus", "b9, 9, #9, b11, b13, 13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ "set": flashCardSetId, chordType: "aug7" }),
      "+7", "b9, 9, #9, #11, 13"),
  ];
}