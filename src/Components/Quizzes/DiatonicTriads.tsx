import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { createFlashCards as createMajorDiatonicTriadsFlashCards } from "./MajorDiatonicTriads";
import { createFlashCards as createNaturalMinorDiatonicTriadsFlashCards } from "./NaturalMinorDiatonicTriads";
import { createFlashCards as createMelodicMinorDiatonicTriadsFlashCards } from "./MelodicMinorDiatonicTriads";
import { createFlashCards as createHarmonicMinorDiatonicTriadsFlashCards } from "./HarmonicMinorDiatonicTriads";
import { createFlashCards as createHarmonicMajorDiatonicTriadsFlashCards } from "./HarmonicMajorDiatonicTriads";
import { createFlashCards as createDoubleHarmonicMajorDiatonicTriadsFlashCards } from "./DoubleHarmonicMajorDiatonicTriads";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from '../../FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Diatonic Triads", flashCards);
  flashCardGroup.enableInvertFlashCards = false;
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 13);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/keys/";

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