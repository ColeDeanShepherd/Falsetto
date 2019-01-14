import * as Utils from "src/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Notes", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  //flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Ionian (Major)", "1 2 3 4 5 6 7"),
    new FlashCard("Dorian", "1 2 b3 4 5 6 b7"),
    new FlashCard("Phrygian", "1 b2 b3 4 5 b6 b7"),
    new FlashCard("Lydian", "1 2 3 #4 5 6 7"),
    new FlashCard("Mixolydian", "1 2 3 4 5 6 b7"),
    new FlashCard("Aeolian (Natural Minor)", "1 2 b3 4 5 b6 b7"),
    new FlashCard("Locrian", "1 b2 b3 4 b5 b6 b7"),
    new FlashCard("Melodic Minor", "1 2 b3 4 5 6 7"),
    new FlashCard("Harmonic Minor", "1 2 b3 4 5 b6 7"),

    new FlashCard("Tonic Diminished (W H)", "1 2 b3 4 b5 b6 bb7 7"),
    new FlashCard("Dominant Diminished (H W)", "1 b2 b3 b4 b5 5 6 b7"),
    new FlashCard("Whole Tone", "1 2 3 #4 #5 b7"),
    new FlashCard("Augmented", "1 #2 3 5 #5 7"),
    new FlashCard("Major Pentatonic", "1 2 3 5 6"),
    new FlashCard("Minor Pentatonic", "1 b3 4 5 b7"),
    new FlashCard("Major Blues", "1 2 b3 3 5 6"),
    new FlashCard("Minor Blues", "1 b3 4 b5 5 b7"),

    new FlashCard("Dorian b2", "1 b2 b3 4 5 6 b7"),
    new FlashCard("Lydian Aug.", "1 2 3 #4 #5 6 7"),
    new FlashCard("Mixolydian #11", "1 2 3 #4 5 6 b7"),
    new FlashCard("Mixolydian b6", "1 2 3 4 5 b6 b7"),
    new FlashCard("Locrian Nat. 9", "1 2 b3 4 b5 b6 b7"),
    new FlashCard("Altered Dominant", "1 b2 b3 b4 b5 b6 b7"),
    new FlashCard("Locrian Nat. 6", "1 b2 b3 4 b5 6 b7"),
    new FlashCard("Ionian Aug.", "1 2 3 4 #5 6 7"),
    new FlashCard("Dorian #11", "1 2 b3 #4 5 6 b7"),
    new FlashCard("Phrygian Major", "1 b2 3 4 5 b6 b7"),
    new FlashCard("Lydian #9", "1 #2 3 #4 5 6 7"),
    new FlashCard("Altered Dominant bb7", "1 b2 b3 b4 b5 b6 bb7"),
  ];
}