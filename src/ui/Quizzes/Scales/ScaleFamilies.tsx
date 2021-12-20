import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

const flashCardSetId = "scaleFamilies";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 8)
    .map(fc => fc.id);
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Families", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Ionian" }),
      "Ionian (Major)", "Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Dorian" }),
      "Dorian", "Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Phrygian" }),
      "Phrygian", "Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Lydian" }),
      "Lydian", "Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Mixolydian" }),
      "Mixolydian", "Dom7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Aeolian" }),
      "Aeolian (Natural Minor)", "Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Locrian" }),
      "Locrian", "Minor7b5"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Melodic Minor" }),
      "Melodic Minor", "Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Harmonic Minor" }),
      "Harmonic Minor", "Minor7"),

    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Tonic Diminished" }),
      "Tonic Diminished", "Diminished"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Dominant Diminished" }),
      "Dominant Diminished", "Dom7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Whole Tone" }),
      "Whole Tone", "Dom7, Augmented"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Augmented" }),
      "Augmented", "Augmented, Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Major Pentatonic" }),
      "Major Pentatonic", "Dom7, Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Minor Pentatonic" }),
      "Minor Pentatonic", "Dom7, Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Major Blues" }),
      "Major Blues", "Dom7, Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Minor Blues" }),
      "Minor Blues", "Dom7, Minor7"),

    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Lydian Augmented" }),
      "Lydian aug", "Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Ionian Augmented" }),
      "Ionian aug", "Major7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Dorian b2" }),
      "Dorian b2", "Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Dorian #4" }),
      "Dorian #4", "Minor7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Locrian Nat. 2" }),
      "Locrian nat2", "Minor7b5"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Locrian Nat. 6" }),
      "Locrian nat6", "Minor7b5"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Mixolydian #11" }),
      "Mixolydian #11", "Dom7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Mixolydian b6" }),
      "Mixolydian b6", "Dom7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Altered Dominant" }),
      "Altered Dominant", "Dom7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Phrygian Major" }),
      "Phrygian Major", "Dom7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "Altered Dominant bb7" }),
      "Altered Dominant bb7", "Diminished"),
  ];
}

export const flashCardSet = createFlashCardSet();