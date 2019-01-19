import * as Utils from "src/Utils";
import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Characteristics", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Ionian", "sus4"),
    new FlashCard("Dorian", "6"),
    new FlashCard("Phrygian", "b2, 5, b6"),
    new FlashCard("Lydian", "#4 (#11)"),
    new FlashCard("Mixolydian", "sus4, b7"),
    new FlashCard("Aeolian", "b6"),
    new FlashCard("Locrian", "b2, b5"),
    new FlashCard("Melodic Minor", "6, 7"),
    new FlashCard("Harmonic Minor", "b6, 7"),

    new FlashCard("Tonic Diminished", "9, 11, b13, 7"),
    new FlashCard("Dominant Diminished", "b9, #9, b5, 5, 13"),
    new FlashCard("Whole Tone", "#4, #5"),
    new FlashCard("Augmented", "(#2, 5, #5, 7), (b3, #5)"),
    new FlashCard("Major Pentatonic", "{no 4 or b7}, {no 4 or 7}"),
    new FlashCard("Minor Pentatonic", "{#9, no b7}, {4 (11)}"),
    new FlashCard("Major Blues", "b3, no b7"),
    new FlashCard("Minor Blues", "{4, #4 (11, #11)}, {#9, sus4, b5}"),
    new FlashCard("Major Blues", "b3, no4 or 7"),

    new FlashCard("Lydian aug", "#4, #5"),
    new FlashCard("Ionian aug", "sus4, #5"),
    new FlashCard("Dorian b2", "b2, 6"),
    new FlashCard("Dorian #4", "#4, 6"),
    new FlashCard("Locrian nat2", "2, b5"),
    new FlashCard("Locrian nat6", "b2, b5, 6"),
    new FlashCard("Mixolydian #11", "#4 (b5), b7"),
    new FlashCard("Mixolydian b6", "sus4, b6(#5), b7"),
    new FlashCard("Altered Dominant", "b9, #9, b5, #5"),
    new FlashCard("Phrygian Major", "sus4, #5, 5"),
    new FlashCard("Altered Dominant bb7", "b9, 3, b13"),
  ];
}