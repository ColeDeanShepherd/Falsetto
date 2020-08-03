import { PitchClass, pitchFromClass, Pitch } from './Pitch';
import { mod } from "../Core/MathUtils";
import { withBitSet, isBitSet } from '../Core/Utils';

/**
 * The canonical type of a chord, represented with a set of pitch integers,
 * where 0 = the root note, 1 = one semitone up from the root note, etc.
 */
export type CanonicalChordType = Set<number>;

export const rootPitchInteger = 0;
export const majorSecondPitchInteger = 2;
export const minorThirdPitchInteger = 3;
export const majorThirdPitchInteger = 4;
export const perfectFourthPitchInteger = 5;
export const diminishedFifthPitchInteger = 6;
export const perfectFifthPitchInteger = 7;
export const augmentedFifthPitchInteger = 8;

export const minorSeventhPitchInteger = 10;
export const majorSeventhPitchInteger = 11;

export const flatNinthPitchInteger = 1;
export const ninthPitchInteger = 2;
export const sharpNinthPitchInteger = 3;

export const eleventhPitchInteger = 5;
export const sharpEleventhPitchInteger = 6;

export const thirteenthPitchInteger = 9;

export function copy(canonicalChordType: CanonicalChordType): CanonicalChordType {
  return new Set<number>(canonicalChordType);
}

export function numNotes(chordType: CanonicalChordType): number {
  return chordType.size;
}

export function containsPitchInteger(chordType: CanonicalChordType, pitchInteger: number): boolean {
  return chordType.has(pitchInteger);
}

export function containsMajorSecond(chordType: CanonicalChordType): boolean {
  return chordType.has(majorSecondPitchInteger);
}

export function containsMinorThird(chordType: CanonicalChordType): boolean {
  return chordType.has(minorThirdPitchInteger);
}

export function containsMajorThird(chordType: CanonicalChordType): boolean {
  return chordType.has(majorThirdPitchInteger);
}

export function containsThird(chordType: CanonicalChordType): boolean {
  return containsMinorThird(chordType) || containsMajorThird(chordType);
}

export function containsPerfectFifth(chordType: CanonicalChordType): boolean {
  return chordType.has(perfectFifthPitchInteger);
}

export function containsAugmentedFifth(chordType: CanonicalChordType): boolean {
  return chordType.has(minorSeventhPitchInteger);
}

export function containsDiminishedFifth(chordType: CanonicalChordType): boolean {
  return chordType.has(diminishedFifthPitchInteger);
}

export function containsNinth(chordType: CanonicalChordType): boolean {
  return chordType.has(ninthPitchInteger);
}

export function containsSharpNinth(chordType: CanonicalChordType): boolean {
  return chordType.has(sharpNinthPitchInteger);
}

export function toBitMask(chordType: CanonicalChordType): number {
  let bitMask = 0;

  for (const pitchInteger of chordType) {
    bitMask = withBitSet(bitMask, pitchInteger);
  }

  return bitMask;
}

export function fromBitMask(bitMask: number): CanonicalChordType {
  const canonicalChordType = new Set<number>();

  for (let bitIndex = 0; bitIndex <= 11; bitIndex++) {
    if (isBitSet(bitMask, bitIndex)) {
      canonicalChordType.add(bitIndex);
    }
  }

  return canonicalChordType;
}

export function getPitchIntegers(canonicalChordType: CanonicalChordType): Set<number> {
  return canonicalChordType;
}

function getOrderedPitchIntegers(canonicalChordType: CanonicalChordType): Array<number> {
  return [ ...(getPitchIntegers(canonicalChordType).values()) ].sort((a, b) => a - b);
}

export function canonicalChordTypeToString(canonicalChordType: CanonicalChordType): string {
  return getOrderedPitchIntegers(canonicalChordType).join(',');
}

export interface CanonicalChord {
  type: CanonicalChordType;
  rootPitchClass: PitchClass;
}

export function getPitchClasses(canonicalChord: CanonicalChord): Array<number> {
  return getOrderedPitchIntegers(canonicalChord.type)
    .map(pitchInteger => mod(canonicalChord.rootPitchClass + pitchInteger, 12));
}

// TODO: support octave number overflow
export function getPitches(canonicalChord: CanonicalChord, rootPitchOctaveNumber: number): Array<Pitch> {
  const orderedPitchIntegers = getOrderedPitchIntegers(canonicalChord.type);
  return orderedPitchIntegers
    .map(pi => pitchFromClass(pi, rootPitchOctaveNumber));
}

export function* generateAllCanonicalChordBitMasks() {
  // All canonical chords contain the root, and an arbitrary combination of the other 11 notes.
  // We can iterate through all combinations by using an integer as a list of bits, where each bit
  // represents whether a note is on of off.
  // If there are 11 possible notes, we need to iterate through 2^11 (2048) integers.

  for (let bitMask = 0; bitMask < 2048; bitMask++) {
    yield bitMask;
  }
}

export function* generateAllCanonicalChords() {
  const bitMaskGenerator = generateAllCanonicalChordBitMasks();

  let generatorResult = bitMaskGenerator.next();
  
  while (!generatorResult.done) {
    const bitMask = generatorResult.value;
    const canonicalChord = fromBitMask(bitMask);
    yield canonicalChord;
    generatorResult = bitMaskGenerator.next()
  }
}