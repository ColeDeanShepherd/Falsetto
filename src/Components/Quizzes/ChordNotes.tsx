import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Chord Notes", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(1, 16);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("power", "1 5"),

    FlashCard.fromRenderFns("major", "1 3 5"),
    FlashCard.fromRenderFns("minor", "1 b3 5"),
    FlashCard.fromRenderFns("diminished", "1 b3 b5"),
    FlashCard.fromRenderFns("augmented", "1 3 #5"),
    FlashCard.fromRenderFns("sus2", "1 2 5"),
    FlashCard.fromRenderFns("sus4", "1 4 5"),
    
    FlashCard.fromRenderFns("6", "1 3 5 6"),
    FlashCard.fromRenderFns("m6", "1 b3 5 6"),
    
    FlashCard.fromRenderFns("Maj7", "1 3 5 7"),
    FlashCard.fromRenderFns("7", "1 3 5 b7"),
    FlashCard.fromRenderFns("m7", "1 b3 5 b7"),
    FlashCard.fromRenderFns("mMaj7", "1 b3 5 7"),
    FlashCard.fromRenderFns("dim7", "1 b3 b5 bb7"),
    FlashCard.fromRenderFns("m7b5", "1 b3 b5 b7"),
    FlashCard.fromRenderFns("aug7", "1 3 #5 b7"),
    FlashCard.fromRenderFns("Maj7#5", "1 3 #5 7"),

    FlashCard.fromRenderFns("quartal", "1 4 b7")
  ];
}