import * as Utils from "./Utils";
import { PitchLetter } from './PitchLetter';

export function doesKeyUseSharps(pitchLetter: PitchLetter, signedAccidental: number): boolean {
  Utils.precondition(Math.abs(signedAccidental) <= 1);

  if (signedAccidental === 1) {
    return true;
  } else if (signedAccidental === -1) {
    return false;
  }

  switch (pitchLetter) {
    case PitchLetter.C:
      return true;
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