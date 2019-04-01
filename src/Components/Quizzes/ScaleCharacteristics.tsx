import * as Utils from "../../Utils";
import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Characteristics", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Ionian", "sus4"),
    FlashCard.fromRenderFns("Dorian", "6"),
    FlashCard.fromRenderFns("Phrygian", "b2, 5, b6"),
    FlashCard.fromRenderFns("Lydian", "#4 (#11)"),
    FlashCard.fromRenderFns("Mixolydian", "sus4, b7"),
    FlashCard.fromRenderFns("Aeolian", "b6"),
    FlashCard.fromRenderFns("Locrian", "b2, b5"),
    FlashCard.fromRenderFns("Melodic Minor", "6, 7"),
    FlashCard.fromRenderFns("Harmonic Minor", "b6, 7"),

    FlashCard.fromRenderFns("Tonic Diminished", "9, 11, b13, 7"),
    FlashCard.fromRenderFns("Dominant Diminished", "b9, #9, b5, 5, 13"),
    FlashCard.fromRenderFns("Whole Tone", "#4, #5"),
    FlashCard.fromRenderFns("Augmented", "(#2, 5, #5, 7), (b3, #5)"),
    FlashCard.fromRenderFns("Major Pentatonic", "{no 4 or b7}, {no 4 or 7}"),
    FlashCard.fromRenderFns("Minor Pentatonic", "{#9, no b7}, {4 (11)}"),
    FlashCard.fromRenderFns("Major Blues", "b3, no b7"),
    FlashCard.fromRenderFns("Minor Blues", "{4, #4 (11, #11)}, {#9, sus4, b5}"),
    FlashCard.fromRenderFns("Major Blues", "b3, no4 or 7"),

    FlashCard.fromRenderFns("Lydian aug", "#4, #5"),
    FlashCard.fromRenderFns("Ionian aug", "sus4, #5"),
    FlashCard.fromRenderFns("Dorian b2", "b2, 6"),
    FlashCard.fromRenderFns("Dorian #4", "#4, 6"),
    FlashCard.fromRenderFns("Locrian nat2", "2, b5"),
    FlashCard.fromRenderFns("Locrian nat6", "b2, b5, 6"),
    FlashCard.fromRenderFns("Mixolydian #11", "#4 (b5), b7"),
    FlashCard.fromRenderFns("Mixolydian b6", "sus4, b6(#5), b7"),
    FlashCard.fromRenderFns("Altered Dominant", "b9, #9, b5, #5"),
    FlashCard.fromRenderFns("Phrygian Major", "sus4, #5, 5"),
    FlashCard.fromRenderFns("Altered Dominant bb7", "b9, 3, b13"),
  ];
}