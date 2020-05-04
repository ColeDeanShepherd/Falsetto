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

export function getPitchLetterMidiNoteNumberOffset(pitchLetter: PitchLetter): number {
  switch (pitchLetter) {
    case PitchLetter.A:
      return 9;
    case PitchLetter.B:
      return 11;
    case PitchLetter.C:
      return 0;
    case PitchLetter.D:
      return 2;
    case PitchLetter.E:
      return 4;
    case PitchLetter.F:
      return 5;
    case PitchLetter.G:
      return 7;
    default:
      const exhaustiveCheck: never = pitchLetter;
      return -1;
  }
}

export function parsePitchLetter(str: string): PitchLetter | undefined {
  if (str.length === 0) { return undefined; }

  const pitchLetterStr = str[0].toUpperCase();

  switch (pitchLetterStr) {
    case 'A':
      return PitchLetter.A;
    case 'B':
      return PitchLetter.B;
    case 'C':
      return PitchLetter.C;
    case 'D':
      return PitchLetter.D;
    case 'E':
      return PitchLetter.E;
    case 'F':
      return PitchLetter.F;
    case 'G':
      return PitchLetter.G;
    default:
      return undefined;
  }
}