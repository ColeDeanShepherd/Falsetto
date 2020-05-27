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