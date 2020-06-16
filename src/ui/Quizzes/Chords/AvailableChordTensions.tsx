import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "availableChordTensions";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Available Chord Tensions", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
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

export const flashCardSet = createFlashCardSet();