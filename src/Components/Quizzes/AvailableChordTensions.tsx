import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from '../../FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Available Chord Tensions", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Maj7", "9, #11, 13"),
    FlashCard.fromRenderFns("m7", "9, 11, 13"),
    FlashCard.fromRenderFns("ø7", "9, 11, b13"),
    FlashCard.fromRenderFns("mMaj7", "9, 11, 13"),
    FlashCard.fromRenderFns("Maj+7", "9, #11"),
    FlashCard.fromRenderFns("o", "9, 11, b13, 7"),
    FlashCard.fromRenderFns("7", "b9, 9, #9, #11, b13, 13"),
    FlashCard.fromRenderFns("7sus", "b9, 9, #9, b11, b13, 13"),
    FlashCard.fromRenderFns("+7", "b9, 9, #9, #11, 13"),
  ];
}