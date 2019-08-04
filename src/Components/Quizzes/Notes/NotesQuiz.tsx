import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Notes Quiz", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.containerHeight = "160px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  const flashCardSetId = "esmNotesQuiz";

  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "noteDef" }),
      "A _ is a sound with a distinct pitch and a duration.", "note"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "pitchDef" }),
      "A _ is the \"highness\" or \"lowness\" of a sound", "pitch"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "numPitches" }),
      "There are _ distinct pitch names.", "12"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "pitchRepeat" }),
      "There are only 12 pitch names, but they _ as you go higher or lower.", "repeat"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "pitchLetters" }),
      "The base of all pitch names is a letter from _ to _.", "A, G"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "7ns" }),
      "We do not use more than seven letters to name pitches because most Western music is based on _ which use each letter exactly once.", "7-note scales"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "natNOtes" }),
      "Notes with a one-letter name and no symbol are called _ notes.", "natural"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "sharpDef" }),
      "# is read \"_\", and means the pitch is _", "sharp, slightly raised"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "flatDef" }),
      "b is read \"_\", and means the pitch is _", "flat, slightly raised"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "accDef" }),
      "Sharps and flats are called _.", "accidentals"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "noAccBetw" }),
      "There are no accidental notes between _ & _ and _ & _.", "E & F, B & C"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "natCb" }),
      "The natural note name for Cb is _.", "B"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "natE#" }),
      "The natural note name for E# is _.", "F")
  ];
}