import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Available Chord Tensions", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Maj7", "9, #11, 13"),
    new FlashCard("m7", "9, 11, 13"),
    new FlashCard("ø7", "9, 11, b13"),
    new FlashCard("mMaj7", "9, 11, 13"),
    new FlashCard("Maj+7", "9, #11"),
    new FlashCard("o", "9, 11, b13, 7"),
    new FlashCard("7", "b9, 9, #9, #11, b13, 13"),
    new FlashCard("7sus", "b9, 9, #9, b11, b13, 13"),
    new FlashCard("+7", "b9, 9, #9, #11, 13"),
  ];
}