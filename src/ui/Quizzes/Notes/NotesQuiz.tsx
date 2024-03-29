import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "esmNotesQuiz";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Notes Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "noteDef" }),
      "A _ is a sound with a distinct pitch and a duration.", "note"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "pitchDef" }),
      "A _ is the \"highness\" or \"lowness\" of a sound", "pitch"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "numPitches" }),
      "There are _ distinct pitch names.", "12"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "pitchRepeat" }),
      "There are only 12 pitch names, but they _ as you go higher or lower.", "repeat"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "pitchLetters" }),
      "The base of all pitch names is a letter from _ to _.", "A, G"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "7ns" }),
      "We do not use more than seven letters to name pitches because most Western music is based on _ which use each letter exactly once.", "7-note scales"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "natNOtes" }),
      "Notes with a one-letter name and no symbol are called _ notes.", "natural"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "sharpDef" }),
      "# is read \"_\", and means the pitch is _", "sharp, slightly raised"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "flatDef" }),
      "b is read \"_\", and means the pitch is _", "flat, slightly raised"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "accDef" }),
      "Sharps and flats are called _.", "accidentals"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "noAccBetw" }),
      "There are no accidental notes between _ & _ and _ & _.", "E & F, B & C"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "natCb" }),
      "The natural note name for Cb is _.", "B"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "natE#" }),
      "The natural note name for E# is _.", "F")
  ];
}

export const flashCardSet = createFlashCardSet();