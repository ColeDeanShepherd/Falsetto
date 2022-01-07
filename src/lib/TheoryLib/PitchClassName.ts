import { mod } from "../Core/MathUtils";
import { numMatchingCharsAtStart } from "../Core/StringUtils";
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";
import { parseEnglishSignedAccidental, PitchClass } from "./PitchClass";
import { parsePitchLetter, PitchLetter, pitchLetters, pitchLetterToMidiNumberOffset, pitchLetterToPitchClass } from "./PitchLetter";
import { getAccidentalString } from "./PitchName";
import { MAX_MIDI_NUMBER_OFFSET } from "./Utils";
 
export interface PitchClassName {
  letter: PitchLetter;
  signedAccidental: number;
}

export function addInterval(
  pitchClassName: PitchClassName,
  direction: VerticalDirection,
  interval: Interval
): PitchClassName {
  let deltaLetter = ((direction === VerticalDirection.Up) ? 1 : -1) * (interval.type - 1);
  return {
    letter: mod((pitchClassName.letter as number) + deltaLetter, pitchLetters.length) as PitchLetter,
    signedAccidental: interval.halfSteps - Interval.getSimpleIntervalTypeHalfSteps(interval.simpleIntervalType)
  };
}

export function pitchClassNameToPitchClass(pitchClassName: PitchClassName): PitchClass {
  return mod(
    pitchLetterToMidiNumberOffset(pitchClassName.letter) + pitchClassName.signedAccidental,
    MAX_MIDI_NUMBER_OFFSET
  );
}

export function toString(pitchName: PitchClassName, useSymbols: boolean = false): string {
  return PitchLetter[pitchName.letter] + getAccidentalString(pitchName.signedAccidental, useSymbols);
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