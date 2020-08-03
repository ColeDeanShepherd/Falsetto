import * as Utils from "../Core/Utils";
import { Pitch } from "./Pitch";
import { Interval, intervalFromHalfSteps } from './Interval';
import { Chord } from './Chord';
import { ChordType, copy as copyChordType } from "./ChordType";
import { ScaleType, getAllModePitchIntegers } from './Scale';
import { areArraysEqual, uniqWithSet, sortNumbersAscendingInPlace } from '../Core/ArrayUtils';
import { intervalsEqual } from './Interval';
import {
  CanonicalChordType, CanonicalChord, toBitMask, containsAugmentedFifth, containsPerfectFifth, perfectFifthPitchInteger,
  augmentedFifthPitchInteger, containsNinth, ninthPitchInteger, sharpNinthPitchInteger, diminishedFifthPitchInteger,
  containsMinorThird, containsMajorSecond, majorThirdPitchInteger, majorSecondPitchInteger, minorThirdPitchInteger,
  perfectFourthPitchInteger, containsPitchInteger, flatNinthPitchInteger, eleventhPitchInteger, sharpEleventhPitchInteger,
  thirteenthPitchInteger, copy as copyCanonicalChordType
} from './CanonicalChord';
import { mod } from "../Core/MathUtils";
import { PitchClass, pitchFromClass } from './Pitch';
import { NumberDictionary } from '../Core/NumberDictionary';
import { setWithout, setWith, setWithoutMany } from '../Core/SetUtils';
import { isBitSet, generateValueCombinationBitMasks } from '../Core/Utils';
import { containsPart, removePart, addPart, removePartWithPitchInteger, ChordScaleFormulaPart } from './ChordScaleFormula';

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

export enum ChordAlteration {
  // Sharpen/Flatten
  Sharp5,
  Sharp9,
  Flat5,
  Flat9,

  // Suspensions
  Sus2,
  Sus4,

  // Additions
  AddSharp5,
  AddFlat9,
  Add9,
  AddSharp9,
  Add11,
  AddSharp11,
  Add13,

  // Removals
  No5,
  No9,
  No11
}

export function alterCanonicalChordType(canonicalChordType: CanonicalChordType, chordAlteration: ChordAlteration): CanonicalChordType {
  switch (chordAlteration) {
    case ChordAlteration.Sharp5:
      if (containsPerfectFifth(canonicalChordType)) {
        // remove perfect fifth
        canonicalChordType.delete(perfectFifthPitchInteger);

        // add sharp fifth
        canonicalChordType.add(augmentedFifthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Sharp9:
      if (containsNinth(canonicalChordType)) {
        // remove ninth
        canonicalChordType.delete(ninthPitchInteger);

        // add sharp ninth
        canonicalChordType.add(sharpNinthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Flat5:
      if (containsPerfectFifth(canonicalChordType)) {
        // remove perfect fifth
        canonicalChordType.delete(perfectFifthPitchInteger);

        // add flat fifth
        canonicalChordType.add(diminishedFifthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Flat9:
      if (containsNinth(canonicalChordType)) {
        // remove ninth
        canonicalChordType.delete(ninthPitchInteger);

        // add flat ninth
        canonicalChordType.add(sharpNinthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Sus2:
      if (containsMinorThird(canonicalChordType)) {
        // remove major third
        canonicalChordType.delete(majorThirdPitchInteger);

        // add second
        canonicalChordType.add(majorSecondPitchInteger);
      } else if (containsMinorThird(canonicalChordType)) {
        // remove minor third
        canonicalChordType.delete(minorThirdPitchInteger);

        // add second
        canonicalChordType.add(majorSecondPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Sus4:
      if (containsMinorThird(canonicalChordType)) {
        // remove major third
        canonicalChordType.delete(majorThirdPitchInteger);

        // add fourth
        canonicalChordType.add(perfectFourthPitchInteger);
      } else if (containsMinorThird(canonicalChordType)) {
        // remove minor third
        canonicalChordType.delete(minorThirdPitchInteger);

        // add fourth
        canonicalChordType.add(perfectFourthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.AddSharp5:
      if (!containsAugmentedFifth(canonicalChordType)) {
        // add sharp fifth
        canonicalChordType.add(augmentedFifthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.AddFlat9:
      if (!containsPitchInteger(canonicalChordType, flatNinthPitchInteger)) {
        // add flat ninth
        canonicalChordType.add(flatNinthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Add9:
      if (!containsPitchInteger(canonicalChordType, ninthPitchInteger)) {
        // add ninth
        canonicalChordType.add(ninthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.AddSharp9:
      if (!containsPitchInteger(canonicalChordType, sharpNinthPitchInteger)) {
        // add sharp ninth
        canonicalChordType.add(sharpNinthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Add11:
      if (!containsPitchInteger(canonicalChordType, eleventhPitchInteger)) {
        // add eleventh
        canonicalChordType.add(eleventhPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.AddSharp11:
      if (!containsPitchInteger(canonicalChordType, sharpEleventhPitchInteger)) {
        // add sharp eleventh
        canonicalChordType.add(sharpEleventhPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    case ChordAlteration.Add13:
      if (!containsPitchInteger(canonicalChordType, thirteenthPitchInteger)) {
        // add thirteenth
        canonicalChordType.add(thirteenthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;
      
    case ChordAlteration.No5:
      if (containsPitchInteger(canonicalChordType, perfectFifthPitchInteger)) {
        // remove note
        canonicalChordType.delete(perfectFifthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;
      
    case ChordAlteration.No9:
      if (containsPitchInteger(canonicalChordType, ninthPitchInteger)) {
        // remove note
        canonicalChordType.delete(ninthPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;
      
    case ChordAlteration.No11:
      if (containsPitchInteger(canonicalChordType, eleventhPitchInteger)) {
        // remove note
        canonicalChordType.delete(eleventhPitchInteger);
      }
      
      // return altered canonical chord type
      return canonicalChordType;

    default:
      throw new Error(`Unknown ChordAlteration: ${chordAlteration}`);
  }
}

export function canonicalChordTypeWithAlteration(canonicalChordType: CanonicalChordType, chordAlteration: ChordAlteration): CanonicalChordType {
  // copy canonical chord type
  canonicalChordType = copyCanonicalChordType(canonicalChordType);

  // alter the copied canonical chord type
  alterCanonicalChordType(canonicalChordType, chordAlteration);

  // return the altered canonical chord type
  return canonicalChordType;
}

export function alterChordType(chordType: ChordType, chordAlteration: ChordAlteration): [ChordType, boolean] {
  let wasAlterationApplied = false;

  switch (chordAlteration) {
    case ChordAlteration.Sharp5:
      // alter formula
      if (removePartWithPitchInteger(chordType.formula, perfectFifthPitchInteger)) {
        // alter ID
        chordType.id += "#5";
  
        // alter name
        chordType.name += " ♯5";

        // add sharp fifth
        addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 5, /*signedAccidental*/ 1, /*isOptional*/ false));

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "♯5";
        }

        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Sharp9:
      // alter formula
      if (removePartWithPitchInteger(chordType.formula, ninthPitchInteger)) {
        // alter ID
        chordType.id += "#9";
  
        // alter name
        chordType.name += " ♯9";

        // add sharp ninth
        addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 9, /*signedAccidental*/ 1, /*isOptional*/ false));

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "♯9";
        }

        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Flat5:
      // alter formula
      if (removePartWithPitchInteger(chordType.formula, perfectFifthPitchInteger)) {
        // alter ID
        chordType.id += "b5";
  
        // alter name
        chordType.name += " ♭5";

        // add flat fifth
        addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 5, /*signedAccidental*/ -1, /*isOptional*/ false));

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "♭5";
        }

        wasAlterationApplied = true;
      }

      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Flat9:
      // alter formula
      if (removePartWithPitchInteger(chordType.formula, ninthPitchInteger)) {
        // alter ID
        chordType.id += "b9";
  
        // alter name
        chordType.name += " ♭9";

        // add flat ninth
        addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 9, /*signedAccidental*/ -1, /*isOptional*/ false));
        
        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "♭9";
        }

        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Sus2:
      {
        if (removePartWithPitchInteger(chordType.formula, majorThirdPitchInteger)) {
          // add second
          addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 2, /*signedAccidental*/ 0, /*isOptional*/ false));
          wasAlterationApplied = true;
        } else if (removePartWithPitchInteger(chordType.formula, minorThirdPitchInteger)) {
          // add second
          addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 2, /*signedAccidental*/ 0, /*isOptional*/ false));
          wasAlterationApplied = true;
        }

        if (wasAlterationApplied) {
          // alter ID
          chordType.id += "sus2";
    
          // alter name
          chordType.name += " sus2";
    
          // add symbols
          for (let i = 0; i < chordType.symbols.length; i++) {
            chordType.symbols[i] += "sus2";
          }
        }
        
        // return altered chord type
        return [chordType, wasAlterationApplied];
      }

    case ChordAlteration.Sus4:
      {
        // alter formula
        if (removePartWithPitchInteger(chordType.formula, majorThirdPitchInteger)) {
          // add fourth
          addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 4, /*signedAccidental*/ 0, /*isOptional*/ false));
          wasAlterationApplied = true;
        } else if (removePartWithPitchInteger(chordType.formula, minorThirdPitchInteger)) {
          // add fourth
          addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 4, /*signedAccidental*/ 0, /*isOptional*/ false));
          wasAlterationApplied = true;
        }

        if (wasAlterationApplied) {
          // alter ID
          chordType.id += "sus4";
    
          // alter name
          chordType.name += " sus4";
    
          // add symbols
          for (let i = 0; i < chordType.symbols.length; i++) {
            chordType.symbols[i] += "sus4";
          }
        }
        
        // return altered chord type
        return [chordType, wasAlterationApplied];
      }

    case ChordAlteration.AddSharp5:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 5, /*signedAccidental*/ 1, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "add#5";
  
        // alter name
        chordType.name += " add♯5";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add♯5";
        }

        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.AddFlat9:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 9, /*signedAccidental*/ -1, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "addb9";
  
        // alter name
        chordType.name += " add♭9";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add♭9";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Add9:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 9, /*signedAccidental*/ 0, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "add9";
  
        // alter name
        chordType.name += " add9";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add9";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.AddSharp9:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 9, /*signedAccidental*/ 1, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "add#9";
  
        // alter name
        chordType.name += " add♯9";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add♯9";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Add11:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 11, /*signedAccidental*/ 0, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "add11";
  
        // alter name
        chordType.name += " add11";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add11";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.AddSharp11:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 11, /*signedAccidental*/ 1, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "add#11";
  
        // alter name
        chordType.name += " add♯11";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add♯11";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    case ChordAlteration.Add13:
      // alter formula
      if (addPart(chordType.formula, new ChordScaleFormulaPart(/*chordNoteNumber*/ 13, /*signedAccidental*/ 0, /*isOptional*/ false))) {
        // alter ID
        chordType.id += "add13";
  
        // alter name
        chordType.name += " add13";

        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "add13";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];
      
    case ChordAlteration.No5:
      if (removePart(chordType.formula, /*chordNoteNumber*/ 5, /*signedAccidental*/ 0)) {
        // alter ID
        chordType.id += "no5";
  
        // alter name
        chordType.name += " no5";
        
        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "no5";
        }
        
        wasAlterationApplied = true;
      }

      // return altered chord type
      return [chordType, wasAlterationApplied];
      
    case ChordAlteration.No9:
      if (removePart(chordType.formula, /*chordNoteNumber*/ 9, /*signedAccidental*/ 0)) {
        // alter ID
        chordType.id += "no9";
  
        // alter name
        chordType.name += " no9";
  
        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "no9";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];
      
    case ChordAlteration.No11:
      if (removePart(chordType.formula, /*chordNoteNumber*/ 11, /*signedAccidental*/ 0)) {
        // alter ID
        chordType.id += "no11";
  
        // alter name
        chordType.name += " no11";
  
        // add symbols
        for (let i = 0; i < chordType.symbols.length; i++) {
          chordType.symbols[i] += "no11";
        }
        
        wasAlterationApplied = true;
      }
      
      // return altered chord type
      return [chordType, wasAlterationApplied];

    default:
      throw new Error(`Unknown ChordAlteration: ${chordAlteration}`);
  }
}

export function chordTypeWithAlteration(chordType: ChordType, chordAlteration: ChordAlteration): [ChordType, boolean] {
  // copy canonical chord type
  chordType = copyChordType(chordType);

  // alter the copied canonical chord type
  let wasAlterationApplied: boolean;
  [chordType, wasAlterationApplied] = alterChordType(chordType, chordAlteration);

  // return the altered canonical chord type
  return [chordType, wasAlterationApplied];
}

function* generateAlteredChords(canonicalChordType: CanonicalChordType, chordType: ChordType, alterations: Array<ChordAlteration>) {
  const alterationCombinationBitMaskGenerator = generateValueCombinationBitMasks(alterations);
  let iterationResult = alterationCombinationBitMaskGenerator.next();

  while (!iterationResult.done) {
    const alterationCombinationBitMask = iterationResult.value;
    let alteredCanonicalChordType = canonicalChordType;
    let alteredChordType = chordType;
    let wasChordAltered = false;

    for (let bitIndex = 0; bitIndex < alterations.length; bitIndex++) {
      if (isBitSet(alterationCombinationBitMask, bitIndex)) {
        const alteration = alterations[bitIndex];
        alteredCanonicalChordType = canonicalChordTypeWithAlteration(alteredCanonicalChordType, alteration);

        let wasAlterationApplied: boolean;
        [alteredChordType, wasAlterationApplied] = chordTypeWithAlteration(alteredChordType, alteration);

        wasChordAltered = wasChordAltered || wasAlterationApplied;
      }
    }

    if (wasChordAltered) {
      let result: [CanonicalChordType, ChordType] = [alteredCanonicalChordType, alteredChordType];
      yield result;
    }

    iterationResult = alterationCombinationBitMaskGenerator.next();
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
  function addTriadChordTypes(canonicalChordType: CanonicalChordType, chordType: ChordType) {
    const validAlterations = [
      ChordAlteration.AddSharp5,
      ChordAlteration.AddFlat9,
      ChordAlteration.Add9,
      ChordAlteration.AddSharp9,
      ChordAlteration.Add11,
      ChordAlteration.AddSharp11
    ];

    const chordTypeGenerator = generateAlteredChords(canonicalChordType, chordType, validAlterations);
    let chordTypeGeneratorResult = chordTypeGenerator.next();

    while(!chordTypeGeneratorResult.done) {
      let [alteredCanonicalChordType, alteredChordType] = chordTypeGeneratorResult.value;
      chordTypeByCanonicalChordTypeBitMask[toBitMask(alteredCanonicalChordType)] = alteredChordType;
      chordTypeGeneratorResult = chordTypeGenerator.next();
    }
  }

  addTriadChordTypes(new Set<number>([R, M3, P5]), ChordType.Major);
  addTriadChordTypes(new Set<number>([R, m3, P5]), ChordType.Minor);
  addTriadChordTypes(new Set<number>([R, M3, A5]), ChordType.Augmented);
  addTriadChordTypes(new Set<number>([R, m3, d5]), ChordType.Diminished);
  addTriadChordTypes(new Set<number>([R, _2, P5]), ChordType.Sus2);
  addTriadChordTypes(new Set<number>([R, _4, P5]), ChordType.Sus4);

  // sixth chords
  function addSixthChordType(canonicalChordType: CanonicalChordType, chordType: ChordType) {
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
    seventhCanonicalChordType: CanonicalChordType,
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

    // https://evangelisticpiano.com/files/everychord.pdf
    // https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
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