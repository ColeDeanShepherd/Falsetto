import { Pitch, getPitchRange } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { precondition } from "../../lib/Core/Dbc";
import { Size2D } from '../../lib/Core/Size2D';

export const fullPianoNumKeys = 88;
export const fullPianoNumWhiteKeys = 52;
export const fullPianoNumBlackKeys = 36;

export const fullPianoLowestPitch = new Pitch(PitchLetter.A, 0, 0);
export const fullPianoHighestPitch = new Pitch(PitchLetter.C, 0, 8);

export const fullPianoAspectRatio = 8.1;

export const pianoWhiteKeyAspectRatio = fullPianoAspectRatio / fullPianoNumWhiteKeys;

export const fullPianoNumOctaves = fullPianoNumKeys / 12;
export const pianoAspectRatioPerOctave = fullPianoAspectRatio / fullPianoNumOctaves;

export const blackKeyWidthOverWhiteKeyWidth = 7 / 12;
export const blackKeyHeightOverWhiteKeyHeight = 53 / 80;

export function getPianoKeyboardAspectRatio(octaveCount: number): number {
  return octaveCount * pianoAspectRatioPerOctave;
}

export function getPianoKeyboardAspectRatioFromPitches(lowestPitch: Pitch, highestPitch: Pitch): number {
  const areKeysWhite = getPitchRange(lowestPitch, highestPitch)
    .map(p => p.isWhiteKey);

  const whiteKeyWidth = pianoWhiteKeyAspectRatio;
  const whiteKeyHeight = 1;

  const blackKeyWidth = blackKeyWidthOverWhiteKeyWidth;
  const blackKeyHeight = blackKeyHeightOverWhiteKeyHeight;

  const size = new Size2D(0, 0);
  
  for (let i = 0; i < areKeysWhite.length; i++) {
    const isWhite = areKeysWhite[i];
    const isFirstKey = i === 0;

    if (isWhite) {
      size.width += (isFirstKey || areKeysWhite[i - 1])
        ? whiteKeyWidth
        : whiteKeyWidth - (blackKeyWidth / 2);
      
      // White keys are the tallest, so if there are any white keys we know the keyboard is as tall as the white keys.
      size.height = whiteKeyHeight;
    } else {
      size.width += isFirstKey
        ? blackKeyWidth
        : (blackKeyWidth / 2);
      size.height = Math.max(blackKeyHeight, size.height);
    }
  }

  const aspectRatio = size.width / size.height;
  return aspectRatio;
}