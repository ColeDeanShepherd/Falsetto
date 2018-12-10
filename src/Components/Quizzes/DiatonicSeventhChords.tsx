
import { createFlashCards as createMajorDiatonicSeventhChordsFlashCards } from "./MajorDiatonicSeventhChords";
import { createFlashCards as createNaturalMinorDiatonicSeventhChordsFlashCards } from "./NaturalMinorDiatonicSeventhChords";
import { createFlashCards as createMelodicMinorDiatonicSeventhChordsFlashCards } from "./MelodicMinorDiatonicSeventhChords";
import { createFlashCards as createHarmonicMinorDiatonicSeventhChordsFlashCards } from "./HarmonicMinorDiatonicSeventhChords";
import { createFlashCards as createHarmonicMajorDiatonicSeventhChordsFlashCards } from "./HarmonicMajorDiatonicSeventhChords";
import { createFlashCards as createDoubleHarmonicMajorDiatonicSeventhChordsFlashCards } from "./DoubleHarmonicMajorDiatonicSeventhChords";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return new Array<FlashCard>()
    .concat(createMajorDiatonicSeventhChordsFlashCards())
    .concat(createNaturalMinorDiatonicSeventhChordsFlashCards())
    .concat(createMelodicMinorDiatonicSeventhChordsFlashCards())
    .concat(createHarmonicMinorDiatonicSeventhChordsFlashCards())
    .concat(createHarmonicMajorDiatonicSeventhChordsFlashCards())
    .concat(createDoubleHarmonicMajorDiatonicSeventhChordsFlashCards());
}