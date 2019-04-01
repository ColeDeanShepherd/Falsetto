import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Interval Quality Symbols", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://method-behind-the-music.com/theory/intervals/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("m", "minor"),
    FlashCard.fromRenderFns("M", "major"),
    FlashCard.fromRenderFns("A", "augmented"),
    FlashCard.fromRenderFns("d", "diminished"),
    FlashCard.fromRenderFns("P", "perfect"),
  ];
}