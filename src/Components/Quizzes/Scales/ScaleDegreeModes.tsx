import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "scaleDegModes";

export function createFlashCardGroup(): FlashCardSet {
  const flashCardGroup = new FlashCardSet(flashCardSetId, "Scale Degree Modes", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 6);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/modes";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M1" }),
      "Major Degree 1 Mode", "Ionian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M2" }),
      "Major Degree 2 Mode", "Dorian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M3" }),
      "Major Degree 3 Mode", "Phrygian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M4" }),
      "Major Degree 4 Mode", "Lydian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M5" }),
      "Major Degree 5 Mode", "Mixolydian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M6" }),
      "Major Degree 6 Mode", "Aeolian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "M7" }),
      "Major Degree 7 Mode", "Locrian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel1" }),
      "Melodic Minor Degree 1 Mode", "Melodic Minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel2" }),
      "Melodic Minor Degree 2 Mode", "Phrygian ♯6 or Dorian ♭2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel3" }),
      "Melodic Minor Degree 3 Mode", "Lydian Augmented"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel4" }),
      "Melodic Minor Degree 4 Mode", "Lydian Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel5" }),
      "Melodic Minor Degree 5 Mode", "Mixolydian ♭6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel6" }),
      "Melodic Minor Degree 6 Mode", "Half-Diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mel7" }),
      "Melodic Minor Degree 7 Mode", "Altered dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm1" }),
      "Harmonic Minor Degree 1 Mode", "Harmonic Minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm2" }),
      "Harmonic Minor Degree 2 Mode", "Locrian ♯6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm3" }),
      "Harmonic Minor Degree 3 Mode", "Ionian ♯5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm4" }),
      "Harmonic Minor Degree 4 Mode", "Ukrainian Dorian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm5" }),
      "Harmonic Minor Degree 5 Mode", "Phrygian Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm6" }),
      "Harmonic Minor Degree 6 Mode", "Lydian ♯2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harm7" }),
      "Harmonic Minor Degree 7 Mode", "Altered Diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm1" }),
      "Double Harmonic Major Degree 1 Mode", "Double Harmonic Major"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm2" }),
      "Double Harmonic Major Degree 2 Mode", "Lydian ♯2 ♯6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm3" }),
      "Double Harmonic Major Degree 3 Mode", "Phrygian ♭♭7 ♭4"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm4" }),
      "Double Harmonic Major Degree 4 Mode", "Hungarian Minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm5" }),
      "Double Harmonic Major Degree 5 Mode", "Locrian ♮6 ♮3 or Mixolydian ♭5 ♭2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm6" }),
      "Double Harmonic Major Degree 6 Mode", "Ionian ♯5 ♯2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarm7" }),
      "Double Harmonic Major Degree 7 Mode", "Locrian ♭♭3 ♭♭7 "),
  ];
}