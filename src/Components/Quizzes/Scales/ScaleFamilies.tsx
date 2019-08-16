import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

const flashCardSetId = "scaleFamilies";

function configDataToEnabledFlashCardIds(
  info: FlashCardStudySessionInfo, configData: any
): Array<FlashCardId> {
  return info.flashCards
    .filter((_, i) => i <= 8)
    .map(fc => fc.id);
}

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Families", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Ionian" }),
      "Ionian (Major)", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dorian" }),
      "Dorian", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Phrygian" }),
      "Phrygian", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Lydian" }),
      "Lydian", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Mixolydian" }),
      "Mixolydian", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Aeolian" }),
      "Aeolian (Natural Minor)", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Locrian" }),
      "Locrian", "Minor7b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Melodic Minor" }),
      "Melodic Minor", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Harmonic Minor" }),
      "Harmonic Minor", "Minor7"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Tonic Diminished" }),
      "Tonic Diminished", "Diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dominant Diminished" }),
      "Dominant Diminished", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Whole Tone" }),
      "Whole Tone", "Dom7, Augmented"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Augmented" }),
      "Augmented", "Augmented, Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Major Pentatonic" }),
      "Major Pentatonic", "Dom7, Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Minor Pentatonic" }),
      "Minor Pentatonic", "Dom7, Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Major Blues" }),
      "Major Blues", "Dom7, Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Minor Blues" }),
      "Minor Blues", "Dom7, Minor7"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Lydian Augmented" }),
      "Lydian aug", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Ionian Augmented" }),
      "Ionian aug", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dorian b2" }),
      "Dorian b2", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dorian #4" }),
      "Dorian #4", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Locrian Nat. 2" }),
      "Locrian nat2", "Minor7b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Locrian Nat. 6" }),
      "Locrian nat6", "Minor7b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Mixolydian #11" }),
      "Mixolydian #11", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Mixolydian b6" }),
      "Mixolydian b6", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Altered Dominant" }),
      "Altered Dominant", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Phrygian Major" }),
      "Phrygian Major", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Altered Dominant bb7" }),
      "Altered Dominant bb7", "Diminished"),
  ];
}