import * as Utils from "src/Utils";
import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Chord Notes", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(1, 16);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("power", "1 5"),

    new FlashCard("major", "1 3 5"),
    new FlashCard("minor", "1 b3 5"),
    new FlashCard("diminished", "1 b3 b5"),
    new FlashCard("augmented", "1 3 #5"),
    new FlashCard("sus2", "1 2 5"),
    new FlashCard("sus4", "1 4 5"),
    
    new FlashCard("6", "1 3 5 6"),
    new FlashCard("m6", "1 b3 5 6"),
    
    new FlashCard("Maj7", "1 3 5 7"),
    new FlashCard("7", "1 3 5 b7"),
    new FlashCard("m7", "1 b3 5 b7"),
    new FlashCard("mMaj7", "1 b3 5 7"),
    new FlashCard("dim7", "1 b3 b5 bb7"),
    new FlashCard("m7b5", "1 b3 b5 b7"),
    new FlashCard("aug7", "1 3 #5 b7"),
    new FlashCard("Maj7#5", "1 3 #5 7"),

    new FlashCard("lydian", "1 #4 5"),
    new FlashCard("sus4b5", "1 4 5b"),
    new FlashCard("phrygian", "1 b2 5"),
    new FlashCard("quartal", "1 4 b7")
  ];
}