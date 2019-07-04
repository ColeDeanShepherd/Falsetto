import * as Utils from "./Utils";
import { PitchLetter } from './PitchLetter';
import { Pitch } from './Pitch';

export const validSharpKeyPitches = [
  null,
  null,
  new Pitch(PitchLetter.C, 1, 4),
  null,
  null,
  new Pitch(PitchLetter.F, 1, 4),
  null
];
export const validNaturalKeyPitches = [
  new Pitch(PitchLetter.A, 0, 4),
  new Pitch(PitchLetter.B, 0, 4),
  new Pitch(PitchLetter.C, 0, 4),
  new Pitch(PitchLetter.D, 0, 4),
  new Pitch(PitchLetter.E, 0, 4),
  new Pitch(PitchLetter.F, 0, 4),
  new Pitch(PitchLetter.G, 0, 4)
];
export const validFlatKeyPitches = [
  new Pitch(PitchLetter.A, -1, 4),
  new Pitch(PitchLetter.B, -1, 4),
  new Pitch(PitchLetter.C, -1, 5),
  new Pitch(PitchLetter.D, -1, 4),
  new Pitch(PitchLetter.E, -1, 4),
  null,
  new Pitch(PitchLetter.G, -1, 4)
];

export function doesKeyUseSharps(pitchLetter: PitchLetter, signedAccidental: number): boolean {
  Utils.precondition(Math.abs(signedAccidental) <= 1);

  if (signedAccidental === 1) {
    return true;
  } else if (signedAccidental === -1) {
    return false;
  }

  switch (pitchLetter) {
    case PitchLetter.C:
      return false;
    case PitchLetter.D:
      return true;
    case PitchLetter.E:
      return true;
    case PitchLetter.F:
      return false;
    case PitchLetter.G:
      return true;
    case PitchLetter.A:
      return true;
    case PitchLetter.B:
      return true;
  }
}