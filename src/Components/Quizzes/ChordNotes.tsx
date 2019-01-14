import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Chord Notes", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("major", "1 3 5"),
    new FlashCard("minor", "1 b3 5"),
    new FlashCard("diminished", "1 b3 b5"),
    new FlashCard("augmented", "1 3 #5"),
    new FlashCard("sus2", "1 2 5"),
    new FlashCard("sus4", "1 4 5"),
    new FlashCard("lydian", "1 #4 5"),
    new FlashCard("sus4b5", "1 4 5b"),
    new FlashCard("phryg", "1 b2 5"),
    new FlashCard("maj7", "1 3 5 7"),
    new FlashCard("7", "1 3 5 b7"),
    new FlashCard("-7", "1 b3 5 b7"),
    new FlashCard("-7b5", "1 b3 b5 b7"),
    new FlashCard("dim7", "1 b3 b5 bb7"),
    new FlashCard("+Ma7", "1 3 #5 7"),
    new FlashCard("-Ma7", "1 b3 5 7"),
    new FlashCard("+7", "1 3 #5 b7"),
    new FlashCard("dimMa7", "1 b3 b5 7"),
    new FlashCard("-7#5", "1 b3 #5 b7"),
    new FlashCard("quartal", "1 4 b7"),
    new FlashCard("quartal aug.", "1 4 7"),
    new FlashCard("G+4Q", "1 #4 7")
  ];
}