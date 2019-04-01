import * as Utils from "../../Utils";
import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Families", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Ionian (Major)", "Major7"),
    FlashCard.fromRenderFns("Dorian", "Minor7"),
    FlashCard.fromRenderFns("Phrygian", "Minor7"),
    FlashCard.fromRenderFns("Lydian", "Major7"),
    FlashCard.fromRenderFns("Mixolydian", "Dom7"),
    FlashCard.fromRenderFns("Aeolian (Natural Minor)", "Minor7"),
    FlashCard.fromRenderFns("Locrian", "Minor7b5"),
    FlashCard.fromRenderFns("Melodic Minor", "Minor7"),
    FlashCard.fromRenderFns("Harmonic Minor", "Minor7"),

    FlashCard.fromRenderFns("Tonic Diminished", "Diminished"),
    FlashCard.fromRenderFns("Dominant Diminished", "Dom7"),
    FlashCard.fromRenderFns("Whole Tone", "Dom7, Augmented"),
    FlashCard.fromRenderFns("Augmented", "Augmented, Major7"),
    FlashCard.fromRenderFns("Major Pentatonic", "Dom7, Major7"),
    FlashCard.fromRenderFns("Minor Pentatonic", "Dom7, Minor7"),
    FlashCard.fromRenderFns("Major Blues", "Dom7, Major7"),
    FlashCard.fromRenderFns("Minor Blues", "Dom7, Minor7"),

    FlashCard.fromRenderFns("Lydian aug", "Major7"),
    FlashCard.fromRenderFns("Ionian aug", "Major7"),
    FlashCard.fromRenderFns("Dorian b2", "Minor7"),
    FlashCard.fromRenderFns("Dorian #4", "Minor7"),
    FlashCard.fromRenderFns("Locrian nat2", "Minor7b5"),
    FlashCard.fromRenderFns("Locrian nat6", "Minor7b5"),
    FlashCard.fromRenderFns("Mixolydian #11", "Dom7"),
    FlashCard.fromRenderFns("Mixolydian b6", "Dom7"),
    FlashCard.fromRenderFns("Altered Dominant", "Dom7"),
    FlashCard.fromRenderFns("Phrygian Major", "Dom7"),
    FlashCard.fromRenderFns("Altered Dominant bb7", "Diminished"),
  ];
}