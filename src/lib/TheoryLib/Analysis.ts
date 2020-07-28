import * as Utils from "../../lib/Core/Utils";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Interval, intervalFromHalfSteps } from '../../lib/TheoryLib/Interval';
import { Chord } from '../../lib/TheoryLib/Chord';
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { ScaleType, getAllModePitchIntegers } from '../../lib/TheoryLib/Scale';
import { areArraysEqual, uniqWithSet } from '../../lib/Core/ArrayUtils';
import { intervalsEqual } from './Interval';
import { sortNumbersAscendingInPlace } from '../Core/ArrayUtils';
import { CanonicalChordType, CanonicalChord, toBitMask } from './CanonicalChord';
import { mod } from "../Core/MathUtils";
import { PitchClass, pitchFromClass } from './Pitch';
import { NumberDictionary } from '../Core/NumberDictionary';
import { setWithout, setWith, setWithoutMany } from '../Core/SetUtils';

// TODO: refactor Chord, Scale
// TODO: add support for multiple chord names
export function findIntervalsChordsScales(pitches: Array<Pitch>): {
  intervals: Array<Interval>,
  chords: Array<Chord>,
  scales: Array<[ScaleType, Pitch]>
} {
  return {
    intervals: findIntervals(pitches),
    chords: findChords(pitches),
    scales: findScales(pitches)
  };
}

export function findIntervals(pitches: Array<Pitch>): Array<Interval> {
  if (pitches.length !== 2) { return new Array<Interval>(); }

  const maxMidiNumber = Math.max(pitches[0].midiNumber, pitches[1].midiNumber);
  const minMidiNumber = Math.min(pitches[0].midiNumber, pitches[1].midiNumber);

  // add non-inverted inverval
  const halfSteps = maxMidiNumber - minMidiNumber;
  const nonInvertedInterval = intervalFromHalfSteps(halfSteps);
  let intervals = [nonInvertedInterval];

  // add inverted interval if unique
  const invertedInterval = nonInvertedInterval.invertedSimple;
  if (!intervalsEqual(invertedInterval, nonInvertedInterval)) {
    intervals.push(invertedInterval);
  }

  return intervals;
}

export function* getCanonicalChords(pitches: Array<Pitch>) {
  // Get distinct pitch classes in ascending order.
  const orderedPitchClasses = sortNumbersAscendingInPlace([ ...uniqWithSet(pitches.map(p => p.class)) ]);

  // Go through all pitches, treating each as a root note, and yielding the resulting chords.
  for (let rootPitchIndex = 0; rootPitchIndex < orderedPitchClasses.length; rootPitchIndex++) {
    const rootPitchClass = orderedPitchClasses[rootPitchIndex];

    // Get chord pitch integers.
    const chordPitchIntegers = new Array<number>(orderedPitchClasses.length);
    for (let i = 0; i < orderedPitchClasses.length; i++) {
      const pitchIndex = (rootPitchIndex + i) % orderedPitchClasses.length;
      const pitchClass = orderedPitchClasses[pitchIndex];
      const pitchInteger = mod(pitchClass - rootPitchClass, 12);
      chordPitchIntegers[i] = pitchInteger;
    }

    // Yield canonical chord.
    const canonicalChord: CanonicalChord = {
      type: new Set<PitchClass>(chordPitchIntegers),
      rootPitchClass: rootPitchClass,
    };
    yield canonicalChord;
  }
}

function createChordTypeByCanonicalChordTypeBitMask(): NumberDictionary<ChordType> {
  const chordTypeByCanonicalChordTypeBitMask: NumberDictionary<ChordType> = {};

  const R = 0;
  const _2 = 2;
  const _9 = 2;
  const m3 = 3;
  const M3 = 4;
  const _4 = 5;
  const _11 = 5;
  const d5 = 6;
  const P5 = 7;
  const A5 = 8;
  const _6 = 9;
  const _13 = 9;
  const d7 = 9;
  const m7 = 10;
  const M7 = 11;

  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, P5]))] = ChordType.Power;

  // basic triads
  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5]))] = ChordType.Major;
  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, P5]))] = ChordType.Minor;
  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, A5]))] = ChordType.Augmented;
  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, d5]))] = ChordType.Diminished;
  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _2, P5]))] = ChordType.Sus2;
  chordTypeByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _4, P5]))] = ChordType.Sus4;

  // sixth chords
  function addSixthChordType(canonicalChordType: Set<number>, chordType: ChordType) {
    chordTypeByCanonicalChordTypeBitMask[toBitMask(canonicalChordType)] = chordType;
    
    // drop 5
    const alternateCanonicalChord = setWithout(canonicalChordType, P5);
    chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = chordType;
  }

  addSixthChordType(new Set<number>([R, M3, P5, _6]), ChordType.Maj6);
  addSixthChordType(new Set<number>([R, m3, P5, _6]), ChordType.Min6);

  // 6/9 chords
  addSixthChordType(new Set<number>([R, M3, P5, _6, _9]), ChordType.Maj69);
  addSixthChordType(new Set<number>([R, m3, P5, _6, _9]), ChordType.Min69);

  // seventh chords
  function addExtendedChordTypes(
    seventhCanonicalChordType: Set<number>,
    is5Optional: boolean,
    seventhChordType: ChordType,
    ninthChordType: ChordType,
    eleventhChordType: ChordType,
    thirteenthChordType?: ChordType) {
    // 7 chords
    {
      chordTypeByCanonicalChordTypeBitMask[toBitMask(seventhCanonicalChordType)] = seventhChordType;
      
      // drop 5
      if (is5Optional) {
        const alternateCanonicalChord = setWithout(seventhCanonicalChordType, P5);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = seventhChordType;
      }
    }

    // 9 chords
    const ninthCanonicalChordType = setWith(seventhCanonicalChordType, _9);

    {
      chordTypeByCanonicalChordTypeBitMask[toBitMask(ninthCanonicalChordType)] = ninthChordType;
      
      // drop 5
      if (is5Optional) {
        const alternateCanonicalChord = setWithout(ninthCanonicalChordType, P5);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = ninthChordType;
      }
    }

    // 11 chords
    const eleventhCanonicalChordType = setWith(ninthCanonicalChordType, _11);

    {
      chordTypeByCanonicalChordTypeBitMask[toBitMask(eleventhCanonicalChordType)] = eleventhChordType;
      
      // drop 5
      if (is5Optional) {
        const alternateCanonicalChord = setWithout(eleventhCanonicalChordType, P5);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = eleventhChordType;
      }
      
      // drop 9
      {
        const alternateCanonicalChord = setWithout(eleventhCanonicalChordType, _9);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = eleventhChordType;
      }

      // drop 5 & 9
      if (is5Optional) {
        const alternateCanonicalChord = setWithoutMany(eleventhCanonicalChordType, P5, _9);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = eleventhChordType;
      }
    }

    // 13 chords
    const thirteenthCanonicalChordType = setWith(eleventhCanonicalChordType, _13);

    if (thirteenthChordType !== undefined) {
      chordTypeByCanonicalChordTypeBitMask[toBitMask(thirteenthCanonicalChordType)] = thirteenthChordType;
      
      // drop 5
      if (is5Optional) {
        const alternateCanonicalChord = setWithout(thirteenthCanonicalChordType, P5);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }
      
      // drop 9
      {
        const alternateCanonicalChord = setWithout(thirteenthCanonicalChordType, _9);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }
      
      // drop 11
      {
        const alternateCanonicalChord = setWithout(thirteenthCanonicalChordType, _11);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }
      
      // drop 5 & 9
      if (is5Optional)
      {
        const alternateCanonicalChord = setWithoutMany(thirteenthCanonicalChordType, P5, _9);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }

      // drop 5 & 11
      if (is5Optional)
      {
        const alternateCanonicalChord = setWithoutMany(thirteenthCanonicalChordType, P5, _11);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }

      // drop 9 & 11
      {
        const alternateCanonicalChord = setWithoutMany(thirteenthCanonicalChordType, _9, _11);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }

      // drop 5 & 9 & 11
      if (is5Optional)
      {
        const alternateCanonicalChord = setWithoutMany(thirteenthCanonicalChordType, P5, _9, _11);
        chordTypeByCanonicalChordTypeBitMask[toBitMask(alternateCanonicalChord)] = thirteenthChordType;
      }
    }
  }

  addExtendedChordTypes(new Set<number>([R, M3, P5, M7]), /*is5Optional*/ true, ChordType.Maj7, ChordType.Maj9, ChordType.Maj11, ChordType.Maj13);
  addExtendedChordTypes(new Set<number>([R, M3, P5, m7]), /*is5Optional*/ true, ChordType.Dom7, ChordType.Dom9, ChordType.Dom11, ChordType.Dom13);
  addExtendedChordTypes(new Set<number>([R, m3, P5, M7]), /*is5Optional*/ true, ChordType.MinMaj7, ChordType.MinMaj9, ChordType.MinMaj11, ChordType.MinMaj13);
  addExtendedChordTypes(new Set<number>([R, m3, P5, m7]), /*is5Optional*/ true, ChordType.Min7, ChordType.Min9, ChordType.Min11, ChordType.Min13);
  addExtendedChordTypes(new Set<number>([R, m3, d5, M7]), /*is5Optional*/ false, ChordType.DimMaj7, ChordType.DimMaj9, ChordType.DimMaj11, ChordType.DimMaj13);
  addExtendedChordTypes(new Set<number>([R, m3, d5, m7]), /*is5Optional*/ false, ChordType.HalfDim7, ChordType.HalfDim9, ChordType.HalfDim11, ChordType.HalfDim13);
  addExtendedChordTypes(new Set<number>([R, m3, d5, d7]), /*is5Optional*/ false, ChordType.Dim7, ChordType.Dim9, ChordType.Dim11, undefined);
  addExtendedChordTypes(new Set<number>([R, M3, A5, M7]), /*is5Optional*/ false, ChordType.AugMaj7, ChordType.AugMaj9, ChordType.AugMaj11, ChordType.AugMaj13);
  addExtendedChordTypes(new Set<number>([R, M3, A5, m7]), /*is5Optional*/ false, ChordType.Aug7, ChordType.Aug9, ChordType.Aug11, ChordType.Aug13);

  return chordTypeByCanonicalChordTypeBitMask;
}

export const chordTypeByCanonicalChordTypeBitMask = createChordTypeByCanonicalChordTypeBitMask();

export function getChordType(canonicalChordType: CanonicalChordType): ChordType | undefined {
  const bitMask = toBitMask(canonicalChordType);
  const chordType = chordTypeByCanonicalChordTypeBitMask[bitMask];
  // TODO: additions
  // TODO: b5, #5
  // TODO: b9
  // TODO: b13
  // #11
  // #9
  return chordType;
}

export function findChords(pitches: Array<Pitch>): Array<Chord> {
  const chords = new Array<Chord>();

  if (pitches.length === 0) { return chords; }
  
  for (const canonicalChord of getCanonicalChords(pitches)) {
    const chordType = getChordType(canonicalChord.type);
    
    if (chordType !== undefined) {
      chords.push(new Chord(chordType, pitchFromClass(canonicalChord.rootPitchClass, /*octaveNumber*/ 0)));
    }
  }

  return chords;
}

export function findScales(pitches: Array<Pitch>): Array<[ScaleType, Pitch]> {
  if (pitches.length === 0) { return new Array<[ScaleType, Pitch]>(); }

  const sortedPitches = pitches
    .slice()
    .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
  const basePitchIntegers = sortedPitches
    .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
  const allPitchIntegers = getAllModePitchIntegers(basePitchIntegers);
  const scaleTypes = allPitchIntegers
    .map((pis, i): [ScaleType | undefined, Pitch] => [
      ScaleType.All.find(ct => areArraysEqual(ct.pitchIntegers, pis)),
      pitches[i]
    ])
    .filter(t => t[0])
    .map((t): [ScaleType, Pitch] => [Utils.unwrapValueOrUndefined(t[0]), t[1]]);

  return scaleTypes
    ? scaleTypes
    : new Array<[ScaleType, Pitch]>();
}