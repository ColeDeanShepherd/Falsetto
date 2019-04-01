import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Chords", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-scales/chord-scale-system/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Ionian", "Maj13"),
    FlashCard.fromRenderFns("Dorian", "m13"),
    FlashCard.fromRenderFns("Phrygian", "m7♭9♭13"),
    FlashCard.fromRenderFns("Lydian", "Maj13#11"),
    FlashCard.fromRenderFns("Mixolydian", "13"),
    FlashCard.fromRenderFns("Aeolian", "m11♭13"),
    FlashCard.fromRenderFns("Locrian", "m7♭5♭9♭13"),
    FlashCard.fromRenderFns("Melodic minor", "mMaj7"),
    FlashCard.fromRenderFns("Harmonic minor", "mMaj7b13"),
    FlashCard.fromRenderFns("Phrygian ♮6", "m13♭9"),
    FlashCard.fromRenderFns("Lydian Augmented", "Maj13#5#11"),
    FlashCard.fromRenderFns("Lydian Dominant", "13#11"),
    FlashCard.fromRenderFns("Mixolydian b6", "11♭13"),
    FlashCard.fromRenderFns("Half-diminished", "m7♭5♭13"),
    FlashCard.fromRenderFns("Altered", "7♭5♭9#9♭13 (7alt)")
  ];
}