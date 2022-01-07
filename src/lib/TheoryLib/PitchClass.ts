import { createBiDirectionalDictionary, get, getReverse } from "../Core/BiDirectionalDictionary";
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

export const pitchClassMidiNumberOffsetMapping = createBiDirectionalDictionary<PitchClass, number>({
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
});

export const pitchClassStringMapping = createBiDirectionalDictionary<PitchClass, string>({
  [PitchClass.C]: 'C',
  [PitchClass.CSharpDFlat]: 'C#/Db',
  [PitchClass.D]: 'D',
  [PitchClass.DSharpEFlat]: 'D#/Eb',
  [PitchClass.E]: 'E',
  [PitchClass.F]: 'F',
  [PitchClass.FSharpGFlat]: 'F#/Gb',
  [PitchClass.G]: 'G',
  [PitchClass.GSharpAFlat]: 'G#/Ab',
  [PitchClass.A]: 'A',
  [PitchClass.ASharpBFlat]: "A#/Bb",
  [PitchClass.B]: 'B'
});

export const pitchClassStringMappingWithSymbols = createBiDirectionalDictionary<PitchClass, string>({
  [PitchClass.C]: 'C',
  [PitchClass.CSharpDFlat]: 'C♯/D♭',
  [PitchClass.D]: 'D',
  [PitchClass.DSharpEFlat]: 'D♯/E♭',
  [PitchClass.E]: 'E',
  [PitchClass.F]: 'F',
  [PitchClass.FSharpGFlat]: 'F♯/G♭',
  [PitchClass.G]: 'G',
  [PitchClass.GSharpAFlat]: 'G♯/A♭',
  [PitchClass.A]: 'A',
  [PitchClass.ASharpBFlat]: "A♯/B♭",
  [PitchClass.B]: 'B'
});

export function pitchClassToMidiNumberOffset(pitchClass: PitchClass): number {
  return get(pitchClassMidiNumberOffsetMapping, pitchClass);
}

export function midiNumberOffsetToPitchClass(midiNumberOffset: number): PitchClass {
  return getReverse(pitchClassMidiNumberOffsetMapping, midiNumberOffset);
}

export function toString(pitchClass: PitchClass, useSymbols: boolean = false): string {
  return get(
    useSymbols
      ? pitchClassStringMappingWithSymbols
      : pitchClassStringMapping,
    pitchClass
  );
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