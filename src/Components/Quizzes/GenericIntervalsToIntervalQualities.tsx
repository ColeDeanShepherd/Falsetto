import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from '../../FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Generic Intervals To Interval Qualities", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("1st", "perfect"),
    FlashCard.fromRenderFns("2nd", "imperfect"),
    FlashCard.fromRenderFns("3rd", "imperfect"),
    FlashCard.fromRenderFns("4th", "perfect"),
    FlashCard.fromRenderFns("5th", "perfect"),
    FlashCard.fromRenderFns("6th", "imperfect"),
    FlashCard.fromRenderFns("7th", "imperfect"),
    FlashCard.fromRenderFns("8th", "perfect"),
  ];
}