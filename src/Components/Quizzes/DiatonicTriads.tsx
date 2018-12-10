import { createFlashCards as createMajorDiatonicTriadsFlashCards } from "./MajorDiatonicTriads";
import { createFlashCards as createNaturalMinorDiatonicTriadsFlashCards } from "./NaturalMinorDiatonicTriads";
import { createFlashCards as createMelodicMinorDiatonicTriadsFlashCards } from "./MelodicMinorDiatonicTriads";
import { createFlashCards as createHarmonicMinorDiatonicTriadsFlashCards } from "./HarmonicMinorDiatonicTriads";
import { createFlashCards as createHarmonicMajorDiatonicTriadsFlashCards } from "./HarmonicMajorDiatonicTriads";
import { createFlashCards as createDoubleHarmonicMajorDiatonicTriadsFlashCards } from "./DoubleHarmonicMajorDiatonicTriads";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return new Array<FlashCard>()
    .concat(createMajorDiatonicTriadsFlashCards())
    .concat(createNaturalMinorDiatonicTriadsFlashCards())
    .concat(createMelodicMinorDiatonicTriadsFlashCards())
    .concat(createHarmonicMinorDiatonicTriadsFlashCards())
    .concat(createHarmonicMajorDiatonicTriadsFlashCards())
    .concat(createDoubleHarmonicMajorDiatonicTriadsFlashCards());
}