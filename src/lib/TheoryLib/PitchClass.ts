import { numSubstringOccurrences } from "../Core/StringUtils";

/**
 * A "pitch class" represented by a number from 0 to 11, where:
 * 0 = C
 * 1 = C#/Db
 * 2 = D
 * 3 = D#/Eb
 * 4 = E
 * 5 = F
 * 6 = F#/Gb
 * 7 = G
 * 8 = G#/Ab
 * 9 = A
 * 10 = A#/Bb
 * 11 = B
 */
export type PitchClass = number;

export const pitchClasses = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
 
export function getPitchClassUriComponent(pitchClass: PitchClass): string {
  return pitchClass.toString();
}

export function parseEnglishSignedAccidental(str: string): number | undefined {
  if (str.length === 0) { return 0; }

  const firstChar = str[0];

  switch (firstChar) {
    case 's':
      return numSubstringOccurrences(str, "sharp", /*allowOverlapping*/ false);
    case 'f':
      return -numSubstringOccurrences(str, "flat", /*allowOverlapping*/ false);
    default:
      return undefined;
  }
}