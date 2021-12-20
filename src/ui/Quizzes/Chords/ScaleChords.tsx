import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "scalesAsChords";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 8)
    .map(fc => fc.id);
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Chords", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-scales/chord-scale-system/";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "maj13" }),
      "Ionian", "maj13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "m13" }),
      "Dorian", "m13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "m7b9b13" }),
      "Phrygian", "m7♭9♭13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "maj13#11" }),
      "Lydian", "maj13#11"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "13" }),
      "Mixolydian", "13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "m11b13" }),
      "Aeolian", "m11♭13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "m7b5b9b13" }),
      "Locrian", "m7♭5♭9♭13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "mMaj7" }),
      "Melodic minor", "mMaj7"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "mMaj7b13" }),
      "Harmonic minor", "mMaj7b13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "m13b9" }),
      "Phrygian ♮6", "m13♭9"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "maj13#5#11" }),
      "Lydian Augmented", "maj13#5#11"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "13#11" }),
      "Lydian Dominant", "13#11"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "11b13" }),
      "Mixolydian b6", "11♭13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "m7b5b13" }),
      "Half-diminished", "m7♭5♭13"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { scale: "7alt" }),
      "Altered", "7♭5♭9#9♭13 (7alt)")
  ];
}

export const flashCardSet = createFlashCardSet();