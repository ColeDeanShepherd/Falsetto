import * as Utils from "../../lib/Core/Utils";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Interval, intervalFromHalfSteps } from '../../lib/TheoryLib/Interval';
import { Chord } from '../../lib/TheoryLib/Chord';
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { ScaleType, getAllModePitchIntegers } from '../../lib/TheoryLib/Scale';
import { generateChordNames } from '../../lib/TheoryLib/ChordName';
import { ChordScaleFormula } from '../../lib/TheoryLib/ChordScaleFormula';
import { areArraysEqual, uniqWithSet } from '../../lib/Core/ArrayUtils';
import { intervalsEqual } from './Interval';
import { sortNumbersAscendingInPlace } from '../Core/ArrayUtils';
import { CanonicalChordType, CanonicalChord, containsPerfectFifth, toBitMask, containsMajorThird, containsMinorThird, containsAugmentedFifth, containsDiminishedFifth } from './CanonicalChord';
import { mod } from "../Core/MathUtils";
import { PitchClass, pitchFromClass } from './Pitch';
import { NumberDictionary } from '../Core/NumberDictionary';

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

export const chordTypesByCanonicalChordTypeBitMask: NumberDictionary<Array<ChordType>> = {};

{
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
  const M6 = 9;
  const _13 = 9;
  const d7 = 9;
  const m7 = 10;
  const M7 = 11;

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, P5]))] = [ChordType.Power];

  // basic triads
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5]))] = [ChordType.Major];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, P5]))] = [ChordType.Minor];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, A5]))] = [ChordType.Augmented];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, d5]))] = [ChordType.Diminished];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _2, P5]))] = [ChordType.Sus2];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _4, P5]))] = [ChordType.Sus4];

  // d5 chords
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5, M6]))] = [ChordType.Maj6];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, P5, M6]))] = [ChordType.Min6];

  // d5/M6 chords
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, P5, M6]))] = [ChordType.Maj69];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, P5, M6]))] = [ChordType.Min69];

  // 7th chords
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5, m7]))] = [ChordType.Dom7];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, m7]))] = [ChordType.Dom7]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5, M7]))] = [ChordType.Maj7];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, M7]))] = [ChordType.Maj7]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, P5, m7]))] = [ChordType.Min7];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, m7]))] = [ChordType.Min7]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, d5, m7]))] = [ChordType.HalfDim7];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, d5, d7]))] = [ChordType.Dim7];

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, P5, M7]))] = [ChordType.MinMaj7];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, M7]))] = [ChordType.MinMaj7]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, A5, m7]))] = [ChordType.Aug7];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, A5, M7]))] = [ChordType.AugMaj7];

  // 9th chords
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, P5, m7]))] = [ChordType.Dom9];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, m7]))] = [ChordType.Dom9]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, P5, M7]))] = [ChordType.Maj9];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, M7]))] = [ChordType.Maj9]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, P5, m7]))] = [ChordType.Min9];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, m7]))] = [ChordType.Min9]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, d5, m7]))] = [ChordType.HalfDim9];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, d5, M6]))] = [ChordType.Dim9];

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, P5, M7]))] = [ChordType.MinMaj9];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, M7]))] = [ChordType.MinMaj9]; // drop 5

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, A5, m7]))] = [ChordType.Aug9];

  // 11th chords
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, P5, m7]))] = [ChordType.Dom11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, m7]))] = [ChordType.Dom11]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, P5, m7]))] = [ChordType.Dom11]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, m7]))] = [ChordType.Dom11]; // drop 5 & 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, P5, M7]))] = [ChordType.Maj11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, M7]))] = [ChordType.Maj11]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, P5, M7]))] = [ChordType.Maj11]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, M7]))] = [ChordType.Maj11]; // drop 5 & 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, P5, m7]))] = [ChordType.Min11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, m7]))] = [ChordType.Min11]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, P5, m7]))] = [ChordType.Min11]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, m7]))] = [ChordType.Min11]; // drop 5 & 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, d5, m7]))] = [ChordType.HalfDim11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, d5, m7]))] = [ChordType.HalfDim11]; // drop 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, d5, d7]))] = [ChordType.Dim11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, d5, d7]))] = [ChordType.Dim11]; // drop 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, P5, M7]))] = [ChordType.MinMaj11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, M7]))] = [ChordType.MinMaj11]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, P5, M7]))] = [ChordType.MinMaj11]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, M7]))] = [ChordType.MinMaj11]; // drop 5 & 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, A5, m7]))] = [ChordType.Aug11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, A5, m7]))] = [ChordType.Aug11]; // drop 9

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, A5, M7]))] = [ChordType.AugMaj11];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, A5, M7]))] = [ChordType.AugMaj11]; // drop 9

  // 13th chords
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, P5, _13, m7]))] = [ChordType.Dom13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, _13, m7]))] = [ChordType.Dom13]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, P5, _13, m7]))] = [ChordType.Dom13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, P5, _13, m7]))] = [ChordType.Dom13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, _13, m7]))] = [ChordType.Dom13]; // drop 5 & 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _13, m7]))] = [ChordType.Dom13]; // drop 5 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5, _13, m7]))] = [ChordType.Dom13]; // drop 9 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _13, m7]))] = [ChordType.Dom13]; // drop 5 & 9 & 11

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, P5, _13, M7]))] = [ChordType.Maj13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, _13, M7]))] = [ChordType.Maj13]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, P5, _13, M7]))] = [ChordType.Maj13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, P5, _13, M7]))] = [ChordType.Maj13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, _13, M7]))] = [ChordType.Maj13]; // drop 5 & 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _13, M7]))] = [ChordType.Maj13]; // drop 5 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, P5, _13, M7]))] = [ChordType.Maj13]; // drop 9 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _13, M7]))] = [ChordType.Maj13]; // drop 5 & 9 & 11

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, P5, _13, m7]))] = [ChordType.Min13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, _13, m7]))] = [ChordType.Min13]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, P5, _13, m7]))] = [ChordType.Min13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, P5, _13, m7]))] = [ChordType.Min13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, _13, m7]))] = [ChordType.Min13]; // drop 5 & 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _13, m7]))] = [ChordType.Min13]; // drop 5 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _13, P5, m7]))] = [ChordType.Min13]; // drop 9 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _13, m7]))] = [ChordType.Min13]; // drop 5 & 9 & 11

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, d5, _13, m7]))] = [ChordType.HalfDim13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, d5, _13, m7]))] = [ChordType.HalfDim13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, d5, _13, m7]))] = [ChordType.HalfDim13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, d5, _13, m7]))] = [ChordType.HalfDim13]; // drop 9 & 11

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, P5, _13, M7]))] = [ChordType.MinMaj13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _11, _13, M7]))] = [ChordType.MinMaj13]; // drop 5
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, P5, _13, M7]))] = [ChordType.MinMaj13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, P5, _13, M7]))] = [ChordType.MinMaj13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _11, _13, M7]))] = [ChordType.MinMaj13]; // drop 5 & 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, m3, _13, M7]))] = [ChordType.MinMaj13]; // drop 5 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, P5, _13, M7]))] = [ChordType.MinMaj13]; // drop 9 & 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, m3, _13, M7]))] = [ChordType.MinMaj13]; // drop 5 & 9 & 11

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, A5, _13, m7]))] = [ChordType.Aug13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, A5, _13, m7]))] = [ChordType.Aug13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, A5, _13, m7]))] = [ChordType.Aug13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, A5, _13, m7]))] = [ChordType.Aug13]; // drop 9 & 11

  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, _11, A5, _13, M7]))] = [ChordType.AugMaj13];
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, _11, A5, _13, M7]))] = [ChordType.AugMaj13]; // drop 9
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, _9, M3, A5, _13, M7]))] = [ChordType.AugMaj13]; // drop 11
  chordTypesByCanonicalChordTypeBitMask[toBitMask(new Set<number>([R, M3, A5, _13, M7]))] = [ChordType.AugMaj13]; // drop 9 & 11
}

export function getChordTypes(chordType: CanonicalChordType): Array<ChordType> {
  const bitMask = toBitMask(chordType);
  const chordTypes = chordTypesByCanonicalChordTypeBitMask[bitMask];
  // TODO: additions
  // TODO: b5, #5
  // TODO: b9
  // TODO: b13
  // #11
  // #9
  return chordTypes ? chordTypes : [];
}

export function findChords(pitches: Array<Pitch>): Array<Chord> {
  const chords = new Array<Chord>();

  if (pitches.length === 0) { return chords; }
  
  for (const canonicalChord of getCanonicalChords(pitches)) {
    const chordTypes = getChordTypes(canonicalChord.type);

    for (const chordType of chordTypes) {
      chords.push(new Chord(chordType, pitchFromClass(canonicalChord.rootPitchClass, 0)));
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