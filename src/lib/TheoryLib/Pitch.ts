import { mod } from "../Core/MathUtils";
import { PitchLetter, pitchLetterToMidiNumberOffset } from "./PitchLetter";
import { arePitchOffsetsFromCWhiteKeys } from "./PitchName";

// Pitches are simply MIDI note numbers.
export type Pitch = number;

export function createPitch(letter: PitchLetter, signedAccidental: number, octaveNumber: number): Pitch {
  const octaveMidiNumberOffset = (12 * (octaveNumber + 1));
  const pitchLetterMidiNoteNumberOffset = pitchLetterToMidiNumberOffset(letter);
  return octaveMidiNumberOffset + pitchLetterMidiNoteNumberOffset + signedAccidental;
}

export function createPitchFromMidiNumber(midiNumber: number): Pitch {
  return midiNumber;
}

export function getMidiNumber(pitch: Pitch): number {
  return pitch;
}

export function* getPitchesInRange(minPitch: Pitch, maxPitch: Pitch) {
  for (let pitch = minPitch; pitch <= maxPitch; pitch++) {
    yield pitch;
  }
}

export function expandPitchRangeToIncludePitch(pitchRange: [Pitch, Pitch], pitch: Pitch): [Pitch, Pitch] {
  // If the pitch is lower than the range's min pitch, lower the range's min pitch to the lower pitch.
  if (pitch < pitchRange[0]) {
    return [pitch, pitchRange[1]];
  }
  // If the pitch is higher than the range's max pitch, raise the range's max pitch to the higher pitch.
  else if (pitch > pitchRange[1]) {
    return [pitchRange[0], pitch];
  }
  // If the pitch is already in the range, we don't need to expand the range.
  else {
    return pitchRange;
  }
}

export function getNumPitchesInRange(pitchRange: [Pitch, Pitch]): number {
  return pitchRange[1] - pitchRange[0] + 1;
}

export function getIsWhiteKey(pitch: Pitch): boolean {
  const positivePitchOffsetFromC = mod(getMidiNumber(pitch), 12);
  return arePitchOffsetsFromCWhiteKeys[positivePitchOffsetFromC];
}

export function getIsBlackKey(pitch: Pitch): boolean {
  return !getIsWhiteKey(pitch);
}