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