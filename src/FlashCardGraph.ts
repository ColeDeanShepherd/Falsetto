import * as IntervalNamesToHalfSteps from "./ui/Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "./ui/Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as GenericIntervalsToIntervalQualities from "./ui/Quizzes/Intervals/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./ui/Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as ScaleDegreeModes from "./ui/Quizzes/Scales/ScaleDegreeModes";
import * as ChordNotes from "./ui/Quizzes/Chords/ChordNotes";
import * as ScaleNotes from "./ui/Quizzes/Scales/ScaleFormulas";
import * as ScaleChords from "./ui/Quizzes/Chords/ScaleChords";
import * as ScaleDegreeNames from "./ui/Quizzes/Scales/ScaleDegreeNames";
import * as ChordFamilies from "./ui/Quizzes/Chords/ChordFamilies";
import * as AvailableChordTensions from "./ui/Quizzes/Chords/AvailableChordTensions";
import * as DiatonicTriads from "./ui/Quizzes/Chords/DiatonicTriads";
import * as DiatonicSeventhChords from "./ui/Quizzes/Chords/DiatonicSeventhChords";
import * as RandomChordGenerator from "./ui/Tools/RandomChordGenerator";
import * as GuitarNotes from "./ui/Quizzes/Notes/GuitarNotes";
import * as GuitarPerfectPitchTrainer from "./ui/Quizzes/Notes/GuitarPerfectPitchTrainer";
import * as PianoNotes from "./ui/Quizzes/Notes/PianoNotes";
import * as ViolinNotes from "./ui/Quizzes/Notes/ViolinNotes";
import * as PianoScales from "./ui/Quizzes/Scales/PianoScales";
import * as PianoChords from "./ui/Quizzes/Chords/PianoChords";
import * as GuitarScales from "./ui/Quizzes/Scales/GuitarScales";
import * as GuitarChords from "./ui/Quizzes/Chords/GuitarChords";
import * as SheetMusicNotes from "./ui/Quizzes/Sheet Music/SheetMusicNotes";
import * as NoteDurations from "./ui/Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as KeyAccidentalCounts from "./ui/Quizzes/Keys/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./ui/Quizzes/Keys/KeyAccidentalNotes";
import * as KeySignatureIdentification from "./ui/Quizzes/Keys/KeySignatureIdentification";
import * as Interval2ndNotes from "./ui/Quizzes/Intervals/Interval2ndNotes";
import * as IntervalNotes from "./ui/Quizzes/Intervals/IntervalNotes";
import * as IntervalEarTraining from "./ui/Quizzes/Intervals/IntervalEarTraining";
import * as Interval2ndNoteEarTraining from "./ui/Quizzes/Intervals/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "./ui/Quizzes/Intervals/Interval2ndNoteEarTrainingPiano";
import * as IntervalSinging from "./ui/Quizzes/Intervals/IntervalSinging";
import * as SheetMusicIntervalRecognition from "./ui/Quizzes/Sheet Music/SheetMusicIntervalRecognition";
import * as PianoIntervals from "./ui/Quizzes/Intervals/PianoIntervals";
import * as GuitarIntervals from "./ui/Quizzes/Intervals/GuitarIntervals";
import * as SheetMusicChordRecognition from "./ui/Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "./ui/Quizzes/Chords/ChordEarTraining";
import * as ScaleEarTraining from "./ui/Quizzes/Scales/ScaleEarTraining";

import * as IntroQuiz from "./ui/PianoTheory/IntroQuiz";
import * as ScalesQuiz from "./ui/PianoTheory/ScalesQuiz";

import * as PianoScaleDegrees from "./ui/Quizzes/Scales/PianoScaleDegrees";
import * as PianoDiatonicChords from "./ui/Quizzes/Chords/PianoDiatonicChords";

import { FlashCardSet } from "./FlashCardSet";
import { StringDictionary } from './lib/Core/StringDictionary';
import { flattenArrays } from './lib/Core/ArrayUtils';
import { Scale } from './lib/TheoryLib/Scale';
import { range } from "./lib/Core/MathUtils";

export const groupedFlashCardSets = [
  {
    title: "Notes",
    flashCardSets: [
      PianoNotes.flashCardSet,
      GuitarNotes.flashCardSet,
      ViolinNotes.flashCardSet,
      SheetMusicNotes.flashCardSet,
      NoteDurations.flashCardSet,
      GuitarPerfectPitchTrainer.flashCardSet
    ]
  },
  {
    title: "Intervals",
    flashCardSets: [
      IntervalQualitySymbolsToQualities.flashCardSet,
      GenericIntervalsToIntervalQualities.flashCardSet,
      IntervalNamesToHalfSteps.flashCardSet,
      IntervalsToConsonanceDissonance.flashCardSet,
      Interval2ndNotes.flashCardSet,
      IntervalNotes.flashCardSet,
      SheetMusicIntervalRecognition.flashCardSet,
      PianoIntervals.flashCardSet,
      GuitarIntervals.flashCardSet,
      IntervalEarTraining.flashCardSet,
      Interval2ndNoteEarTraining.flashCardSet,
      Interval2ndNoteEarTrainingPiano.flashCardSet,
      IntervalSinging.flashCardSet
    ]
  },
  {
    title: "Scales",
    flashCardSets: [
      ScaleDegreeNames.flashCardSet,
      ScaleNotes.flashCardSet,
      PianoScales.flashCardSet,
      GuitarScales.flashCardSet,
      ScaleDegreeModes.flashCardSet,
      ScaleChords.flashCardSet,
      //ScaleFamilies.flashCardSet,
      //ScaleCharacteristics.flashCardSet,
      ScaleEarTraining.flashCardSet,
      ScalesQuiz.flashCardSet
    ]
  },
  {
    title: "Keys",
    flashCardSets: [
      KeyAccidentalCounts.flashCardSet,
      KeyAccidentalNotes.flashCardSet,
      KeySignatureIdentification.flashCardSet
    ]
  },
  {
    title: "Chords",
    flashCardSets: [
      //ChordFamilyDefinitions.flashCardSet,
      ChordFamilies.flashCardSet,
      ChordNotes.flashCardSet,
      AvailableChordTensions.flashCardSet,
      DiatonicTriads.flashCardSet,
      DiatonicSeventhChords.flashCardSet,
      SheetMusicChordRecognition.flashCardSet,
      PianoChords.flashCardSet,
      GuitarChords.flashCardSet,
      ChordEarTraining.flashCardSet,
      RandomChordGenerator.flashCardSet
    ]
  },
  {
    title: "Other",
    flashCardSets: [
      IntroQuiz.flashCardSet
    ]
  }
];

export const flashCardSets = flattenArrays<FlashCardSet>(
  groupedFlashCardSets.map(g => g.flashCardSets)
);

export function relateSets(...params: Array<FlashCardSet>) {
  for (let i = 0; i < (params.length - 1); i++) {
    for (let j = i + 1; j < params.length; j++) {
      if (i === j) { continue; }

      params[i].addRelatedSet(params[j]);
    }
  }
}

function initFlashCardSetGraph() {
  for (const group of groupedFlashCardSets) {
    relateSets(...group.flashCardSets);
  }
}
initFlashCardSetGraph();

function forEachFlashCardSet(callback: (fcs: FlashCardSet) => void) {
  for (const set of flashCardSets) {
    callback(set);
  }

  Scale.forAll(scale => callback(PianoScaleDegrees.createFlashCardSet(scale)));
  Scale.forAll(scale =>
    range(3, scale.type.numPitches)
      .forEach(numChordPitches => callback(PianoDiatonicChords.createFlashCardSet(scale, numChordPitches))));
}

export function checkFlashCardSetIds() {
  const flashCardSetIds: StringDictionary<boolean> = {};

  forEachFlashCardSet(set => {
    if (flashCardSetIds[set.id] === undefined) {
      flashCardSetIds[set.id] = true;
    } else {
      throw new Error(`Duplicate flash card set ID: ${set.id}`);
    }
  });
}

export function checkFlashCardIds() {
  const flashCardIds: StringDictionary<boolean> = {};

  forEachFlashCardSet(set => {
    const flashCards = set.createFlashCards();

    for (const flashCard of flashCards) {
      if (flashCardIds[flashCard.id] === undefined) {
        flashCardIds[flashCard.id] = true;
      } else {
        throw new Error(`Duplicate flash card ID: ${flashCard.id}`);
      }
    }
  });
}