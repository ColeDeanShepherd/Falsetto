import * as IntervalNamesToHalfSteps from "./Components/Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "./Components/Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as GenericIntervalsToIntervalQualities from "./Components/Quizzes/Intervals/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./Components/Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as ScaleDegreeModes from "./Components/Quizzes/Scales/ScaleDegreeModes";
import * as ChordNotes from "./Components/Quizzes/Chords/ChordNotes";
import * as ScaleNotes from "./Components/Quizzes/Scales/ScaleFormulas";
import * as ScaleChords from "./Components/Quizzes/Chords/ScaleChords";
import * as ScaleDegreeNames from "./Components/Quizzes/Scales/ScaleDegreeNames";
import * as ChordFamilies from "./Components/Quizzes/Chords/ChordFamilies";
import * as AvailableChordTensions from "./Components/Quizzes/Chords/AvailableChordTensions";
import * as DiatonicTriads from "./Components/Quizzes/Chords/DiatonicTriads";
import * as DiatonicSeventhChords from "./Components/Quizzes/Chords/DiatonicSeventhChords";
import * as RandomChordGenerator from "./Components/Tools/RandomChordGenerator";
import * as GuitarNotes from "./Components/Quizzes/Notes/GuitarNotes";
import * as GuitarPerfectPitchTrainer from "./Components/Quizzes/Notes/GuitarPerfectPitchTrainer";
import * as PianoNotes from "./Components/Quizzes/Notes/PianoNotes";
import * as ViolinNotes from "./Components/Quizzes/Notes/ViolinNotes";
import * as PianoScales from "./Components/Quizzes/Scales/PianoScales";
import * as PianoChords from "./Components/Quizzes/Chords/PianoChords";
import * as GuitarScales from "./Components/Quizzes/Scales/GuitarScales";
import * as GuitarChords from "./Components/Quizzes/Chords/GuitarChords";
import * as SheetMusicNotes from "./Components/Quizzes/Sheet Music/SheetMusicNotes";
import * as NoteDurations from "./Components/Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as KeyAccidentalCounts from "./Components/Quizzes/Keys/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Components/Quizzes/Keys/KeyAccidentalNotes";
import * as KeySignatureIdentification from "./Components/Quizzes/Keys/KeySignatureIdentification";
import * as Interval2ndNotes from "./Components/Quizzes/Intervals/Interval2ndNotes";
import * as IntervalNotes from "./Components/Quizzes/Intervals/IntervalNotes";
import * as IntervalEarTraining from "./Components/Quizzes/Intervals/IntervalEarTraining";
import * as Interval2ndNoteEarTraining from "./Components/Quizzes/Intervals/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "./Components/Quizzes/Intervals/Interval2ndNoteEarTrainingPiano";
import * as IntervalSinging from "./Components/Quizzes/Intervals/IntervalSinging";
import * as SheetMusicIntervalRecognition from "./Components/Quizzes/Sheet Music/SheetMusicIntervalRecognition";
import * as PianoIntervals from "./Components/Quizzes/Intervals/PianoIntervals";
import * as GuitarIntervals from "./Components/Quizzes/Intervals/GuitarIntervals";
import * as SheetMusicChordRecognition from "./Components/Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "./Components/Quizzes/Chords/ChordEarTraining";
import * as ScaleEarTraining from "./Components/Quizzes/Scales/ScaleEarTraining";

import * as IntroQuiz from "./PianoTheory/IntroQuiz";
import * as ScalesQuiz from "./PianoTheory/ScalesQuiz";

import * as PianoScaleDegrees from "./Components/Quizzes/Scales/PianoScaleDegrees";
import * as PianoDiatonicChords from "./Components/Quizzes/Chords/PianoDiatonicChords";

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