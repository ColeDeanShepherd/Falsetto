import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Scale Notes", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/modes";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Ionian (Major)", "1 2 3 4 5 6 7"),
    FlashCard.fromRenderFns("Dorian", "1 2 b3 4 5 6 b7"),
    FlashCard.fromRenderFns("Phrygian", "1 b2 b3 4 5 b6 b7"),
    FlashCard.fromRenderFns("Lydian", "1 2 3 #4 5 6 7"),
    FlashCard.fromRenderFns("Mixolydian", "1 2 3 4 5 6 b7"),
    FlashCard.fromRenderFns("Aeolian (Natural Minor)", "1 2 b3 4 5 b6 b7"),
    FlashCard.fromRenderFns("Locrian", "1 b2 b3 4 b5 b6 b7"),
    FlashCard.fromRenderFns("Melodic Minor", "1 2 b3 4 5 6 7"),
    FlashCard.fromRenderFns("Harmonic Minor", "1 2 b3 4 5 b6 7"),

    FlashCard.fromRenderFns("Tonic Diminished (W H)", "1 2 b3 4 b5 b6 bb7 7"),
    FlashCard.fromRenderFns("Dominant Diminished (H W)", "1 b2 b3 b4 b5 5 6 b7"),
    FlashCard.fromRenderFns("Whole Tone", "1 2 3 #4 #5 b7"),
    FlashCard.fromRenderFns("Augmented", "1 #2 3 5 #5 7"),
    FlashCard.fromRenderFns("Major Pentatonic", "1 2 3 5 6"),
    FlashCard.fromRenderFns("Minor Pentatonic", "1 b3 4 5 b7"),
    FlashCard.fromRenderFns("Major Blues", "1 2 b3 3 5 6"),
    FlashCard.fromRenderFns("Minor Blues", "1 b3 4 b5 5 b7"),

    FlashCard.fromRenderFns("Dorian b2", "1 b2 b3 4 5 6 b7"),
    FlashCard.fromRenderFns("Lydian Aug.", "1 2 3 #4 #5 6 7"),
    FlashCard.fromRenderFns("Mixolydian #11", "1 2 3 #4 5 6 b7"),
    FlashCard.fromRenderFns("Mixolydian b6", "1 2 3 4 5 b6 b7"),
    FlashCard.fromRenderFns("Locrian Nat. 9", "1 2 b3 4 b5 b6 b7"),
    FlashCard.fromRenderFns("Altered Dominant", "1 b2 b3 b4 b5 b6 b7"),
    FlashCard.fromRenderFns("Locrian Nat. 6", "1 b2 b3 4 b5 6 b7"),
    FlashCard.fromRenderFns("Ionian Aug.", "1 2 3 4 #5 6 7"),
    FlashCard.fromRenderFns("Dorian #11", "1 2 b3 #4 5 6 b7"),
    FlashCard.fromRenderFns("Phrygian Major", "1 b2 3 4 5 b6 b7"),
    FlashCard.fromRenderFns("Lydian #9", "1 #2 3 #4 5 6 7"),
    FlashCard.fromRenderFns("Altered Dominant bb7", "1 b2 b3 b4 b5 b6 bb7"),
  ];
}