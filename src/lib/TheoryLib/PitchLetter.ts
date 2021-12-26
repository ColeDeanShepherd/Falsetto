import { PitchClass, pitchClassToMidiNumberOffset } from "./PitchClass";

export enum PitchLetter {
  A,
  B,
  C,
  D,
  E,
  F,
  G
}

export const pitchLetters = [
  PitchLetter.A,
  PitchLetter.B,
  PitchLetter.C,
  PitchLetter.D,
  PitchLetter.E,
  PitchLetter.F,
  PitchLetter.G,
];

export const pitchClassesByPitchLetter: { [key in PitchLetter]: PitchClass } = {
  [PitchLetter.A]: PitchClass.A,
  [PitchLetter.B]: PitchClass.B,
  [PitchLetter.C]: PitchClass.C,
  [PitchLetter.D]: PitchClass.D,
  [PitchLetter.E]: PitchClass.E,
  [PitchLetter.F]: PitchClass.F,
  [PitchLetter.G]: PitchClass.G
};

export function pitchLetterToPitchClass(pitchLetter: PitchLetter): PitchClass {
  return pitchClassesByPitchLetter[pitchLetter];
}

// TODO: remove
export function getPitchLetterMidiNoteNumberOffset(pitchLetter: PitchLetter): number {
  return pitchClassToMidiNumberOffset(pitchLetterToPitchClass(pitchLetter));
}

export const pitchLettersByUpperCaseString: { [key in string]: PitchLetter } = {
  ['A']: PitchLetter.A,
  ['B']: PitchLetter.B,
  ['C']: PitchLetter.C,
  ['D']: PitchLetter.D,
  ['E']: PitchLetter.E,
  ['F']: PitchLetter.F,
  ['G']: PitchLetter.G,
};

export function parsePitchLetter(str: string): PitchLetter | undefined {
  if (str.length === 0) { return undefined; }

  const pitchLetterStr = str[0].toUpperCase();
  return pitchLettersByUpperCaseString[pitchLetterStr];
}