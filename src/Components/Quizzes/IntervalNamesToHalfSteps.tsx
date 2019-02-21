import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Interval Semitones", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/chords-intervals/";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Unison", "0"),
    FlashCard.fromRenderFns("m2", "1"),
    FlashCard.fromRenderFns("M2", "2"),
    FlashCard.fromRenderFns("m3", "3"),
    FlashCard.fromRenderFns("M3", "4"),
    FlashCard.fromRenderFns("P4", "5"),
    FlashCard.fromRenderFns("A4/d5", "6"),
    FlashCard.fromRenderFns("P5", "7"),
    FlashCard.fromRenderFns("m6", "8"),
    FlashCard.fromRenderFns("M6", "9"),
    FlashCard.fromRenderFns("m7", "10"),
    FlashCard.fromRenderFns("M7", "11"),
    FlashCard.fromRenderFns("P8", "12"),
  ];
}