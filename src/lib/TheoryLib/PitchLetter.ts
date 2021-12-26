import { BiDirectionalDictionary, createBiDirectionalDictionary, getBiDir, getReverse } from "../Core/BiDirectionalDictionary";
import { createDictionary, Dictionary, get } from "../Core/Dictionary";
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

export const pitchClassesByPitchLetter: Dictionary<PitchLetter, PitchClass> = createDictionary({
  [PitchLetter.A]: PitchClass.A,
  [PitchLetter.B]: PitchClass.B,
  [PitchLetter.C]: PitchClass.C,
  [PitchLetter.D]: PitchClass.D,
  [PitchLetter.E]: PitchClass.E,
  [PitchLetter.F]: PitchClass.F,
  [PitchLetter.G]: PitchClass.G
});

export function pitchLetterToPitchClass(pitchLetter: PitchLetter): PitchClass {
  return get(pitchClassesByPitchLetter, pitchLetter);
}

export const pitchLetterMidiNumberOffsetMapping: BiDirectionalDictionary<PitchLetter, number> = createBiDirectionalDictionary({
  [PitchLetter.A]: 9,
  [PitchLetter.B]: 11,
  [PitchLetter.C]: 0,
  [PitchLetter.D]: 2,
  [PitchLetter.E]: 4,
  [PitchLetter.F]: 5,
  [PitchLetter.G]: 7
});

export function pitchLetterToMidiNumberOffset(pitchLetter: PitchLetter): number {
  return getBiDir(pitchLetterMidiNumberOffsetMapping, pitchLetter);
}

export function midiNumberOffsetToPitchLetter(midiNumberOffset: number): PitchLetter {
  return getReverse(pitchLetterMidiNumberOffsetMapping, midiNumberOffset);
}

export const pitchLettersByUpperCaseString: Dictionary<string, PitchLetter> = createDictionary({
  ['A']: PitchLetter.A,
  ['B']: PitchLetter.B,
  ['C']: PitchLetter.C,
  ['D']: PitchLetter.D,
  ['E']: PitchLetter.E,
  ['F']: PitchLetter.F,
  ['G']: PitchLetter.G,
});

export function parsePitchLetter(str: string): PitchLetter | undefined {
  if (str.length === 0) { return undefined; }

  const pitchLetterStr = str[0].toUpperCase();
  return get(pitchLettersByUpperCaseString, pitchLetterStr);
}