import { numSubstringOccurrences } from "../Core/StringUtils";

export enum PitchClass {
  C,
  CSharpDFlat,
  D,
  DSharpEFlat,
  E,
  F,
  FSharpGFlat,
  G,
  GSharpAFlat,
  A,
  ASharpBFlat,
  B
};

export const pitchClasses = [
  PitchClass.C,
  PitchClass.CSharpDFlat,
  PitchClass.D,
  PitchClass.DSharpEFlat,
  PitchClass.E,
  PitchClass.F,
  PitchClass.FSharpGFlat,
  PitchClass.G,
  PitchClass.GSharpAFlat,
  PitchClass.A,
  PitchClass.ASharpBFlat,
  PitchClass.B
];

export const midiNumberOffsetsByPitchClass: { [key in PitchClass]: number } = {
  [PitchClass.C]: 0,
  [PitchClass.CSharpDFlat]: 1,
  [PitchClass.D]: 2,
  [PitchClass.DSharpEFlat]: 3,
  [PitchClass.E]: 4,
  [PitchClass.F]: 5,
  [PitchClass.FSharpGFlat]: 6,
  [PitchClass.G]: 7,
  [PitchClass.GSharpAFlat]: 8,
  [PitchClass.A]: 9,
  [PitchClass.ASharpBFlat]: 10,
  [PitchClass.B]: 11
};

export function pitchClassToMidiNumberOffset(pitchClass: PitchClass): number {
  return midiNumberOffsetsByPitchClass[pitchClass];
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

export function getPitchClassUriComponent(pitchClass: PitchClass): string {
  return pitchClass.toString();
}