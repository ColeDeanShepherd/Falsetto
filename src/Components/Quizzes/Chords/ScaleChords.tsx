import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Chords", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-scales/chord-scale-system/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  const flashCardSetId = "scalesAsChords";

  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "maj13" }),
      "Ionian", "maj13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "m13" }),
      "Dorian", "m13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "m7b9b13" }),
      "Phrygian", "m7♭9♭13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "maj13#11" }),
      "Lydian", "maj13#11"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "13" }),
      "Mixolydian", "13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "m11b13" }),
      "Aeolian", "m11♭13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "m7b5b9b13" }),
      "Locrian", "m7♭5♭9♭13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "mMaj7" }),
      "Melodic minor", "mMaj7"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "mMaj7b13" }),
      "Harmonic minor", "mMaj7b13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "m13b9" }),
      "Phrygian ♮6", "m13♭9"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "maj13#5#11" }),
      "Lydian Augmented", "maj13#5#11"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "13#11" }),
      "Lydian Dominant", "13#11"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "11b13" }),
      "Mixolydian b6", "11♭13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "m7b5b13" }),
      "Half-diminished", "m7♭5♭13"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: "7alt" }),
      "Altered", "7♭5♭9#9♭13 (7alt)")
  ];
}