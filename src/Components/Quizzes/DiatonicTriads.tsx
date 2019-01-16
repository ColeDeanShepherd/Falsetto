import * as Utils from "src/Utils";
import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { createFlashCards as createMajorDiatonicTriadsFlashCards } from "./MajorDiatonicTriads";
import { createFlashCards as createNaturalMinorDiatonicTriadsFlashCards } from "./NaturalMinorDiatonicTriads";
import { createFlashCards as createMelodicMinorDiatonicTriadsFlashCards } from "./MelodicMinorDiatonicTriads";
import { createFlashCards as createHarmonicMinorDiatonicTriadsFlashCards } from "./HarmonicMinorDiatonicTriads";
import { createFlashCards as createHarmonicMajorDiatonicTriadsFlashCards } from "./HarmonicMajorDiatonicTriads";
import { createFlashCards as createDoubleHarmonicMajorDiatonicTriadsFlashCards } from "./DoubleHarmonicMajorDiatonicTriads";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Diatonic Triads", flashCards);
  flashCardGroup.enableInvertFlashCards = false;
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 13);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return new Array<FlashCard>()
    .concat(createMajorDiatonicTriadsFlashCards())
    .concat(createNaturalMinorDiatonicTriadsFlashCards())
    .concat(createMelodicMinorDiatonicTriadsFlashCards())
    .concat(createHarmonicMinorDiatonicTriadsFlashCards())
    .concat(createHarmonicMajorDiatonicTriadsFlashCards())
    .concat(createDoubleHarmonicMajorDiatonicTriadsFlashCards());
}