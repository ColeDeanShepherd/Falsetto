import { PitchClass } from './Pitch';
import { mod } from "../Core/MathUtils";

/**
 * The canonical type of a chord, represented with a set of pitch integers,
 * where 0 = the root note, 1 = one semitone up from the root note, etc.
 */
export type CanonicalChordType = Set<number>;

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