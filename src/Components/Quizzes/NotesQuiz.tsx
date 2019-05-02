import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Notes Quiz", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.containerHeight = "160px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("A _ is a sound with a distinct pitch and a duration.", "note"),
    FlashCard.fromRenderFns("A _ is the \"highness\" or \"lowness\" of a sound", "pitch"),
    FlashCard.fromRenderFns("There are _ distinct pitch names.", "12"),
    FlashCard.fromRenderFns("There are only 12 pitch names, but they _ as you go higher or lower.", "repeat"),
    FlashCard.fromRenderFns("The base of all pitch names is a letter from _ to _.", "A, G"),
    FlashCard.fromRenderFns("We do not use more than seven letters to name pitches because most Western music is based on _ which use each letter exactly once.", "7-note scales"),
    FlashCard.fromRenderFns("Notes with a one-letter name and no symbol are called _ notes.", "natural"),
    FlashCard.fromRenderFns("# is read \"_\", and means the pitch is _", "sharp, slightly raised"),
    FlashCard.fromRenderFns("b is read \"_\", and means the pitch is _", "flat, slightly raised"),
    FlashCard.fromRenderFns("Sharps and flats are called _.", "accidentals"),
    FlashCard.fromRenderFns("There are no accidental notes between _ & _ and _ & _.", "E & F, B & C"),
    FlashCard.fromRenderFns("The natural note name for Cb is _.", "B"),
    FlashCard.fromRenderFns("The natural note name for E# is _.", "F")
  ];
}