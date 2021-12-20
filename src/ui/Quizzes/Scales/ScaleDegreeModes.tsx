import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "scaleDegreeModes";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 6)
    .map(fc => fc.id);
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Degree Modes", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/scales-and-modes";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M1" }),
      "Major Degree 1 Mode", "Ionian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M2" }),
      "Major Degree 2 Mode", "Dorian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M3" }),
      "Major Degree 3 Mode", "Phrygian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M4" }),
      "Major Degree 4 Mode", "Lydian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M5" }),
      "Major Degree 5 Mode", "Mixolydian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M6" }),
      "Major Degree 6 Mode", "Aeolian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "M7" }),
      "Major Degree 7 Mode", "Locrian"),

    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin1" }),
      "Melodic Minor Degree 1 Mode", "Melodic Minor"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin2" }),
      "Melodic Minor Degree 2 Mode", "Phrygian ♯6 or Dorian ♭2"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin3" }),
      "Melodic Minor Degree 3 Mode", "Lydian Augmented"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin4" }),
      "Melodic Minor Degree 4 Mode", "Lydian Dominant"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin5" }),
      "Melodic Minor Degree 5 Mode", "Mixolydian ♭6"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin6" }),
      "Melodic Minor Degree 6 Mode", "Half-Diminished"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "melMin7" }),
      "Melodic Minor Degree 7 Mode", "Altered dominant"),
    
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin1" }),
      "Harmonic Minor Degree 1 Mode", "Harmonic Minor"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin2" }),
      "Harmonic Minor Degree 2 Mode", "Locrian ♯6"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin3" }),
      "Harmonic Minor Degree 3 Mode", "Ionian ♯5"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin4" }),
      "Harmonic Minor Degree 4 Mode", "Ukrainian Dorian"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin5" }),
      "Harmonic Minor Degree 5 Mode", "Phrygian Dominant"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin6" }),
      "Harmonic Minor Degree 6 Mode", "Lydian ♯2"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMin7" }),
      "Harmonic Minor Degree 7 Mode", "Altered Diminished"),
    
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj1" }),
      "Harmonic Major Degree 1 Mode", "Harmonic Major"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj2" }),
      "Harmonic Major Degree 2 Mode", "Dorian b5"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj3" }),
      "Harmonic Major Degree 3 Mode", "Phrygian b4"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj4" }),
      "Harmonic Major Degree 4 Mode", "Lydian b3"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj5" }),
      "Harmonic Major Degree 5 Mode", "Mixolydian b9"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj6" }),
      "Harmonic Major Degree 6 Mode", "Lydian Augmented #2"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "harmMaj7" }),
      "Harmonic Major Degree 7 Mode", "Locrian bb7"),
    
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj1" }),
      "Double Harmonic Major Degree 1 Mode", "Double Harmonic Major"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj2" }),
      "Double Harmonic Major Degree 2 Mode", "Lydian ♯2 ♯6"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj3" }),
      "Double Harmonic Major Degree 3 Mode", "Phrygian ♭♭7 ♭4"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj4" }),
      "Double Harmonic Major Degree 4 Mode", "Hungarian Minor"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj5" }),
      "Double Harmonic Major Degree 5 Mode", "Locrian ♮6 ♮3 or Mixolydian ♭5 ♭2"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj6" }),
      "Double Harmonic Major Degree 6 Mode", "Ionian ♯5 ♯2"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dHarmMaj7" }),
      "Double Harmonic Major Degree 7 Mode", "Locrian ♭♭3 ♭♭7 "),
  ];
}

export const flashCardSet = createFlashCardSet();