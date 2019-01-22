import * as Utils from "src/Utils";
import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Chords", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-scales/chord-scale-system/";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Ionian", "Maj13"),
    new FlashCard("Dorian", "m13"),
    new FlashCard("Phrygian", "m7♭9♭13"),
    new FlashCard("Lydian", "Maj13#11"),
    new FlashCard("Mixolydian", "13"),
    new FlashCard("Aeolian", "m11♭13"),
    new FlashCard("Locrian", "m7♭5♭9♭13"),
    new FlashCard("Melodic minor", "mMaj7"),
    new FlashCard("Harmonic minor", "mMaj7b13"),
    new FlashCard("Phrygian ♮6", "m13♭9"),
    new FlashCard("Lydian Augmented", "Maj13#5#11"),
    new FlashCard("Lydian Dominant", "13#11"),
    new FlashCard("Mixolydian b6", "11♭13"),
    new FlashCard("Half-diminished", "m7♭5♭13"),
    new FlashCard("Altered", "7♭5♭9#9♭13 (7alt)")
  ];
}