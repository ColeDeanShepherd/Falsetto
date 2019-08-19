import * as Utils from "./Utils";
import { PitchLetter } from './PitchLetter';
import { Pitch } from './Pitch';

export function getValidKeyPitches(preferredOctaveNumber: number): Array<Pitch> {
  return [
    new Pitch(PitchLetter.C, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.C, 1, preferredOctaveNumber),
    new Pitch(PitchLetter.D, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.D, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.E, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.E, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.F, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.F, 1, preferredOctaveNumber),
    new Pitch(PitchLetter.G, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.G, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.A, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.A, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.B, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.B, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.C, -1, preferredOctaveNumber + 1)
  ];
}

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
export function doesKeyUseFlats(pitchLetter: PitchLetter, signedAccidental: number) {
  return !doesKeyUseSharps(pitchLetter, signedAccidental);
}