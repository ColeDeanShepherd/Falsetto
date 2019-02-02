import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Intervals Consonance/Dissonance", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://sites.google.com/site/nebironamsmusictheory/chords/1-01intervals";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("m2", "sharp dissonance"),
    FlashCard.fromRenderFns("M2", "mild dissonance"),
    FlashCard.fromRenderFns("m3", "soft consonance"),
    FlashCard.fromRenderFns("M3", "soft consonance"),
    FlashCard.fromRenderFns("P4", "consonance or dissonance"),
    FlashCard.fromRenderFns("A4/d5", "neutral or restless"),
    FlashCard.fromRenderFns("P5", "open consonance"),
    FlashCard.fromRenderFns("m6", "soft consonance"),
    FlashCard.fromRenderFns("M6", "soft consonance"),
    FlashCard.fromRenderFns("m7", "mild dissonance"),
    FlashCard.fromRenderFns("M7", "sharp dissonance"),
    FlashCard.fromRenderFns("P8", "open consonance"),
  ];
}