import { Pitch } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';

export const fullPianoLowestPitch = new Pitch(PitchLetter.A, 0, 0);
export const fullPianoHighestPitch = new Pitch(PitchLetter.C, 0, 8);

export function getPianoKeyboardAspectRatio(octaveCount: number): number {
  return octaveCount * 2;
}