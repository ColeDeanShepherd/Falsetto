import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";

import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Chord Family Definitions", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Tonic", "doesn't contain the 4th scale degree"),
    FlashCard.fromRenderFns("Pre-Dominant", "contains only 4th scale degree"),
    FlashCard.fromRenderFns("Dominant", "contains the 4th and 7th scale degrees"),
  ];
}