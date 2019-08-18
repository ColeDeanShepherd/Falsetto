import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

const flashCardSetId = "scaleCharacteristics";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 8)
    .map(fc => fc.id);
}

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Characteristics", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Ionian" }),
      "Ionian", "sus4"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dorian" }),
      "Dorian", "6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Phrygian" }),
      "Phrygian", "b2, 5, b6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Lydian" }),
      "Lydian", "#4 (#11)"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Mixolydian" }),
      "Mixolydian", "sus4, b7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Aeolian" }),
      "Aeolian", "b6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Locrian" }),
      "Locrian", "b2, b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Melodic Minor" }),
      "Melodic Minor", "6, 7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Harmonic Minor" }),
      "Harmonic Minor", "b6, 7"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Tonic Diminished" }),
      "Tonic Diminished", "9, 11, b13, 7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dominant Diminished" }),
      "Dominant Diminished", "b9, #9, b5, 5, 13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Whole Tone" }),
      "Whole Tone", "#4, #5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Augmented" }),
      "Augmented", "(#2, 5, #5, 7), (b3, #5)"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Major Pentatonic" }),
      "Major Pentatonic", "{no 4 or b7}, {no 4 or 7}"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Minor Pentatonic" }),
      "Minor Pentatonic", "{#9, no b7}, {4 (11)}"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Major Blues" }),
      "Major Blues", "b3, no b7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Minor Blues" }),
      "Minor Blues", "{4, #4 (11, #11)}, {#9, sus4, b5}"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Lydian aug" }),
      "Lydian aug", "#4, #5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Ionian aug" }),
      "Ionian aug", "sus4, #5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dorian b2" }),
      "Dorian b2", "b2, 6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Dorian #4" }),
      "Dorian #4", "#4, 6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Locrian nat2" }),
      "Locrian nat2", "2, b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Locrian nat6" }),
      "Locrian nat6", "b2, b5, 6"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Mixolydian #11" }),
      "Mixolydian #11", "#4 (b5), b7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Mixolydian b6" }),
      "Mixolydian b6", "sus4, b6(#5), b7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Altered Dominant" }),
      "Altered Dominant", "b9, #9, b5, #5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Phrygian Major" }),
      "Phrygian Major", "sus4, #5, 5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "Altered Dominant bb7" }),
      "Altered Dominant bb7", "b9, 3, b13"),
  ];
}