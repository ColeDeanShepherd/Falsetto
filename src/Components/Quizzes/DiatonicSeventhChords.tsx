import * as Utils from "src/Utils";
import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { createFlashCards as createMajorDiatonicSeventhChordsFlashCards } from "./MajorDiatonicSeventhChords";
import { createFlashCards as createNaturalMinorDiatonicSeventhChordsFlashCards } from "./NaturalMinorDiatonicSeventhChords";
import { createFlashCards as createMelodicMinorDiatonicSeventhChordsFlashCards } from "./MelodicMinorDiatonicSeventhChords";
import { createFlashCards as createHarmonicMinorDiatonicSeventhChordsFlashCards } from "./HarmonicMinorDiatonicSeventhChords";
import { createFlashCards as createHarmonicMajorDiatonicSeventhChordsFlashCards } from "./HarmonicMajorDiatonicSeventhChords";
import { createFlashCards as createDoubleHarmonicMajorDiatonicSeventhChordsFlashCards } from "./DoubleHarmonicMajorDiatonicSeventhChords";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Diatonic Seventh Chords", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 13);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return new Array<FlashCard>()
    .concat(createMajorDiatonicSeventhChordsFlashCards())
    .concat(createNaturalMinorDiatonicSeventhChordsFlashCards())
    .concat(createMelodicMinorDiatonicSeventhChordsFlashCards())
    .concat(createHarmonicMinorDiatonicSeventhChordsFlashCards())
    .concat(createHarmonicMajorDiatonicSeventhChordsFlashCards())
    .concat(createDoubleHarmonicMajorDiatonicSeventhChordsFlashCards());
}