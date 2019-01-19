import * as Utils from "../../Utils";
import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Families", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Ionian (Major)", "Major7"),
    new FlashCard("Dorian", "Minor7"),
    new FlashCard("Phrygian", "Minor7"),
    new FlashCard("Lydian", "Major7"),
    new FlashCard("Mixolydian", "Dom7"),
    new FlashCard("Aeolian (Natural Minor)", "Minor7"),
    new FlashCard("Locrian", "Minor7b5"),
    new FlashCard("Melodic Minor", "Minor7"),
    new FlashCard("Harmonic Minor", "Minor7"),

    new FlashCard("Tonic Diminished", "Diminished"),
    new FlashCard("Dominant Diminished", "Dom7"),
    new FlashCard("Whole Tone", "Dom7, Augmented"),
    new FlashCard("Augmented", "Augmented, Major7"),
    new FlashCard("Major Pentatonic", "Dom7, Major7"),
    new FlashCard("Minor Pentatonic", "Dom7, Minor7"),
    new FlashCard("Major Blues", "Dom7, Major7"),
    new FlashCard("Minor Blues", "Dom7, Minor7"),

    new FlashCard("Lydian aug", "Major7"),
    new FlashCard("Ionian aug", "Major7"),
    new FlashCard("Dorian b2", "Minor7"),
    new FlashCard("Dorian #4", "Minor7"),
    new FlashCard("Locrian nat2", "Minor7b5"),
    new FlashCard("Locrian nat6", "Minor7b5"),
    new FlashCard("Mixolydian #11", "Dom7"),
    new FlashCard("Mixolydian b6", "Dom7"),
    new FlashCard("Altered Dominant", "Dom7"),
    new FlashCard("Phrygian Major", "Dom7"),
    new FlashCard("Altered Dominant bb7", "Diminished"),
  ];
}