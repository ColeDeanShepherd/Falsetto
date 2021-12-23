import { numMatchingCharsAtStart } from "../Core/StringUtils";
import { parseEnglishSignedAccidental, PitchClass } from "./PitchClass";
import { parsePitchLetter, PitchLetter, pitchLetterToPitchClass } from "./PitchLetter";
 
export interface PitchClassName {
  letter: PitchLetter;
  signedAccidental: number;
}

export function pitchClassNameToPitchClass(pitchClassName: PitchClassName): PitchClass {
  const letterPitchClass = pitchLetterToPitchClass(pitchClassName.letter);
  return letterPitchClass + pitchClassName.signedAccidental;
}

export function parseSignedAccidental(str: string): number | undefined {
  if (str.length === 0) { return 0; }

  const firstChar = str[0];

  switch (firstChar) {
    case '#':
    case '♯':
      return numMatchingCharsAtStart(str, firstChar);
    case 'b':
    case '♭':
      return -numMatchingCharsAtStart(str, firstChar);
    default:
      return undefined;
  }
}

export function parsePitchClassNameFromUriComponent(uriComponent: string): PitchClassName | undefined {
  const pitchLetter = parsePitchLetter(uriComponent);
  if (pitchLetter === undefined) { return undefined; }

  const signedAccidentalStr = uriComponent.substring(1);
  const signedAccidental = parseEnglishSignedAccidental(signedAccidentalStr);
  if (signedAccidental === undefined) { return undefined; }

  return {
    letter: pitchLetter,
    signedAccidental
  };
}

export function parsePitchClassName(str: string): PitchClassName | undefined {
  const pitchLetter = parsePitchLetter(str);
  if (pitchLetter === undefined) { return undefined; }

  const signedAccidentalStr = str.substring(1, 2);
  const signedAccidental = parseSignedAccidental(signedAccidentalStr);
  if (signedAccidental === undefined) { return undefined; }

  return {
    letter: pitchLetter,
    signedAccidental
  };
}