import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Degree Modes", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 6);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/modes";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Major Degree 1 Mode", "Ionian"),
    FlashCard.fromRenderFns("Major Degree 2 Mode", "Dorian"),
    FlashCard.fromRenderFns("Major Degree 3 Mode", "Phrygian"),
    FlashCard.fromRenderFns("Major Degree 4 Mode", "Lydian"),
    FlashCard.fromRenderFns("Major Degree 5 Mode", "Mixolydian"),
    FlashCard.fromRenderFns("Major Degree 6 Mode", "Aeolian"),
    FlashCard.fromRenderFns("Major Degree 7 Mode", "Locrian"),
    FlashCard.fromRenderFns("Melodic Minor Degree 1 Mode", "Melodic Minor"),
    FlashCard.fromRenderFns("Melodic Minor Degree 2 Mode", "Phrygian ♯6 or Dorian ♭2"),
    FlashCard.fromRenderFns("Melodic Minor Degree 3 Mode", "Lydian Augmented"),
    FlashCard.fromRenderFns("Melodic Minor Degree 4 Mode", "Lydian Dominant"),
    FlashCard.fromRenderFns("Melodic Minor Degree 5 Mode", "Mixolydian ♭6"),
    FlashCard.fromRenderFns("Melodic Minor Degree 6 Mode", "Half-Diminished"),
    FlashCard.fromRenderFns("Melodic Minor Degree 7 Mode", "Altered dominant"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 1 Mode", "Harmonic Minor"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 2 Mode", "Locrian ♯6"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 3 Mode", "Ionian ♯5"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 4 Mode", "Ukrainian Dorian"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 5 Mode", "Phrygian Dominant"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 6 Mode", "Lydian ♯2"),
    FlashCard.fromRenderFns("Harmonic Minor Degree 7 Mode", "Altered Diminished"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 1 Mode", "Double Harmonic Major"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 2 Mode", "Lydian ♯2 ♯6"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 3 Mode", "Phrygian ♭♭7 ♭4"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 4 Mode", "Hungarian Minor"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 5 Mode", "Locrian ♮6 ♮3 or Mixolydian ♭5 ♭2"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 6 Mode", "Ionian ♯5 ♯2"),
    FlashCard.fromRenderFns("Double Harmonic Major Degree 7 Mode", "Locrian ♭♭3 ♭♭7 "),
  ];
}