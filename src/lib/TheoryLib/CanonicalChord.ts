import { PitchClass } from './Pitch';
import { mod } from "../Core/MathUtils";
import { withBitSet } from '../Core/Utils';

/**
 * The canonical type of a chord, represented with a set of pitch integers,
 * where 0 = the root note, 1 = one semitone up from the root note, etc.
 */
export type CanonicalChordType = Set<number>;

export const rootPitchInteger = 0;
export const minorThirdPitchInteger = 3;
export const majorThirdPitchInteger = 4;
export const diminishedFifthPitchInteger = 6;
export const perfectFifthPitchInteger = 7;
export const augmentedFifthPitchInteger = 8;
export const minorSeventhPitchInteger = 10;
export const majorSeventhPitchInteger = 11;

export function containsMinorThird(chordType: CanonicalChordType): boolean {
  return chordType.has(minorThirdPitchInteger);
}

export function containsMajorThird(chordType: CanonicalChordType): boolean {
  return chordType.has(majorThirdPitchInteger);
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

export function toBitMask(chordType: CanonicalChordType): number {
  let bitMask = 0;

  for (const pitchInteger of chordType) {
    bitMask = withBitSet(bitMask, pitchInteger);
  }

  return bitMask;
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