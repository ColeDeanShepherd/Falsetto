import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Degree Names", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://musictheoryblog.blogspot.com/2007/01/scale-degrees.html";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("1", "Tonic"),
    FlashCard.fromRenderFns("2", "Supertonic"),
    FlashCard.fromRenderFns("3", "Mediant"),
    FlashCard.fromRenderFns("4", "Subdominant"),
    FlashCard.fromRenderFns("5", "Dominant"),
    FlashCard.fromRenderFns("6", "Submediant"),
    FlashCard.fromRenderFns("7 (in major)", "Leading Tone"),
    FlashCard.fromRenderFns("7 (in minor)", "Subtonic"),
  ];
}