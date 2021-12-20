import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "diatonicTriads";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((fc, i) => i <= 13)
    .map(fc => fc.id);
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Diatonic Triads", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/keys/";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return new Array<FlashCard>()
    .concat([
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 1" }),
        "Major 1 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 2" }),
        "Major 2 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 3" }),
        "Major 3 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 4" }),
        "Major 4 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 5" }),
        "Major 5 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 6" }),
        "Major 6 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Major 7" }),
        "Major 7 Chord Type", "diminished"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 1" }),
        "Natural Minor 1 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 2" }),
        "Natural Minor 2 Chord Type", "diminished"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 3" }),
        "Natural Minor 3 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 4" }),
        "Natural Minor 4 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 5" }),
        "Natural Minor 5 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 6" }),
        "Natural Minor 6 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Minor 7" }),
        "Natural Minor 7 Chord Type", "major"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 1" }),
        "Melodic Minor 1 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 2" }),
        "Melodic Minor 2 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 3" }),
        "Melodic Minor 3 Chord Type", "augmented"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 4" }),
        "Melodic Minor 4 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 5" }),
        "Melodic Minor 5 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 6" }),
        "Melodic Minor 6 Chord Type", "diminished"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Melodic Minor 7" }),
        "Melodic Minor 7 Chord Type", "diminished"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 1" }),
        "Harmonic Minor 1 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 2" }),
        "Harmonic Minor 2 Chord Type", "diminished"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 3" }),
        "Harmonic Minor 3 Chord Type", "augmented"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 4" }),
        "Harmonic Minor 4 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 5" }),
        "Harmonic Minor 5 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 6" }),
        "Harmonic Minor 6 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Minor 7" }),
        "Harmonic Minor 7 Chord Type", "diminished"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 1" }),
        "Harmonic Major 1 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 2" }),
        "Harmonic Major 2 Chord Type", "diminished"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 3" }),
        "Harmonic Major 3 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 4" }),
        "Harmonic Major 4 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 5" }),
        "Harmonic Major 5 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 6" }),
        "Harmonic Major 6 Chord Type", "augmented"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Harmonic Major 7" }),
        "Harmonic Major 7 Chord Type", "diminished"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 1" }),
        "Double Harmonic Major 1 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 2" }),
        "Double Harmonic Major 2 Chord Type", "major"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 3" }),
        "Double Harmonic Major 3 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 4" }),
        "Double Harmonic Major 4 Chord Type", "minor"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 5" }),
        "Double Harmonic Major 5 Chord Type", "major b5"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 6" }),
        "Double Harmonic Major 6 Chord Type", "augmented"),
      FlashCard.fromRenderFns(
        createFlashCardId(flashCardSetId, { id: "Double Harmonic Major 7" }),
        "Double Harmonic Major 7 Chord Type", "sus2 b5"),
    ]);
}

export const flashCardSet = createFlashCardSet();