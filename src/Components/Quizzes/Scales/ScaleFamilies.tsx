import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Families", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  const flashCardSetId = "scaleFamilies";

  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "ionian" }),
      "Ionian (Major)", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "dorian" }),
      "Dorian", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "phrygian" }),
      "Phrygian", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "lydian" }),
      "Lydian", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "mixolydian" }),
      "Mixolydian", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "aeolian" }),
      "Aeolian (Natural Minor)", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "locrian" }),
      "Locrian", "Minor7b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "melodicMinor" }),
      "Melodic Minor", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "harmonicMinor" }),
      "Harmonic Minor", "Minor7"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "tonicDiminished" }),
      "Tonic Diminished", "Diminished"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "dominantDiminished" }),
      "Dominant Diminished", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "wholeTone" }),
      "Whole Tone", "Dom7, Augmented"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "augmented" }),
      "Augmented", "Augmented, Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "majorPentatonic" }),
      "Major Pentatonic", "Dom7, Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "minorPentatonic" }),
      "Minor Pentatonic", "Dom7, Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "majorBlues" }),
      "Major Blues", "Dom7, Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "minorBlues" }),
      "Minor Blues", "Dom7, Minor7"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "lydianAugmented" }),
      "Lydian aug", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "ionianAugmented" }),
      "Ionian aug", "Major7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "dorianb2" }),
      "Dorian b2", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "dorian#4" }),
      "Dorian #4", "Minor7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "locrianNat2" }),
      "Locrian nat2", "Minor7b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "locrianNat6" }),
      "Locrian nat6", "Minor7b5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "mixolydian#11" }),
      "Mixolydian #11", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "mixolydianb6" }),
      "Mixolydian b6", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "alteredDominant" }),
      "Altered Dominant", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "phrygianMajor" }),
      "Phrygian Major", "Dom7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "alteredDominantbb7" }),
      "Altered Dominant bb7", "Diminished"),
  ];
}