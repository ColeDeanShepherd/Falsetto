import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "scaleDegreeModes";

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Degree Modes", createFlashCards);
  flashCardSet.initialSelectedFlashCardIndices = Utils.range(0, 6);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/modes";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
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
      JSON.stringify({ set: flashCardSetId, id: "melMin1" }),
      "Melodic Minor Degree 1 Mode", "Melodic Minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "melMin2" }),
      "Melodic Minor Degree 2 Mode", "Phrygian ♯6 or Dorian ♭2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "melMin3" }),
      "Melodic Minor Degree 3 Mode", "Lydian Augmented"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "melMin4" }),
      "Melodic Minor Degree 4 Mode", "Lydian Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "melMin5" }),
      "Melodic Minor Degree 5 Mode", "Mixolydian ♭6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "melMin6" }),
      "Melodic Minor Degree 6 Mode", "Half-Diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "melMin7" }),
      "Melodic Minor Degree 7 Mode", "Altered dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin1" }),
      "Harmonic Minor Degree 1 Mode", "Harmonic Minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin2" }),
      "Harmonic Minor Degree 2 Mode", "Locrian ♯6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin3" }),
      "Harmonic Minor Degree 3 Mode", "Ionian ♯5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin4" }),
      "Harmonic Minor Degree 4 Mode", "Ukrainian Dorian"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin5" }),
      "Harmonic Minor Degree 5 Mode", "Phrygian Dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin6" }),
      "Harmonic Minor Degree 6 Mode", "Lydian ♯2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "harmMin7" }),
      "Harmonic Minor Degree 7 Mode", "Altered Diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj1" }),
      "Double Harmonic Major Degree 1 Mode", "Double Harmonic Major"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj2" }),
      "Double Harmonic Major Degree 2 Mode", "Lydian ♯2 ♯6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj3" }),
      "Double Harmonic Major Degree 3 Mode", "Phrygian ♭♭7 ♭4"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj4" }),
      "Double Harmonic Major Degree 4 Mode", "Hungarian Minor"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj5" }),
      "Double Harmonic Major Degree 5 Mode", "Locrian ♮6 ♮3 or Mixolydian ♭5 ♭2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj6" }),
      "Double Harmonic Major Degree 6 Mode", "Ionian ♯5 ♯2"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dHarmMaj7" }),
      "Double Harmonic Major Degree 7 Mode", "Locrian ♭♭3 ♭♭7 "),
  ];
}