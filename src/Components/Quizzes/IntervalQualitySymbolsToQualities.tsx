import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Interval Quality Symbols", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://method-behind-the-music.com/theory/intervals/";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("m", "minor"),
    new FlashCard("M", "major"),
    new FlashCard("A", "augmented"),
    new FlashCard("d", "diminished"),
    new FlashCard("P", "perfect"),
  ];
}