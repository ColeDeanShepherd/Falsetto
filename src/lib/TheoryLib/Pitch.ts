import { precondition } from "../Core/Dbc";
import { mod } from "../Core/MathUtils";
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";
import { PitchClass } from "./PitchClass";
import { PitchLetter, pitchLetterToMidiNumberOffset } from "./PitchLetter";

// Pitches are simply MIDI note numbers.
export type Pitch = number;

export const arePitchOffsetsFromCWhiteKeys = [
  true, // C
  false, // C#/Db
  true, // D
  false, // D#/Eb
  true, // E
  true, // F
  false, // F#/Gb
  true, // G
  false, // G#/Ab
  true, // A
  false, // A#/Bb
  true, // B
];

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

export function addOctaves(
  pitch: Pitch, octaves: number
): Pitch {
  return pitch + (12 * octaves);
}

export function tryWrapPitchOctave(
  pitch: Pitch,
  lowestPitch: Pitch,
  highestPitch: Pitch
): Pitch | undefined {
  const lowestPitchMidiNumber = getMidiNumber(lowestPitch);
  const highestPitchMidiNumber = getMidiNumber(highestPitch);
  
  const pitchCountInRange = (highestPitchMidiNumber - lowestPitchMidiNumber) + 1;
  const pitchOctaveSpan = Math.ceil(pitchCountInRange / 12);
  
  // If the pitch is below the pitch range, shift it up by octaves until it isn't.
  if (getMidiNumber(pitch) < lowestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitch = addOctaves(pitch, pitchOctaveSpan);
    } while (getMidiNumber(pitch) < lowestPitchMidiNumber);
  }
  // Otherwise, if the pitch is above the pitch range, shift it down by octaves until it isn't.
  else if (getMidiNumber(pitch) > highestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitch = addOctaves(pitch, -pitchOctaveSpan);
    } while (getMidiNumber(pitch) > highestPitchMidiNumber);
  }

  // If the pitch is in range now, return it. Otherwise, return undefined.
  const pitchMidiNumber = getMidiNumber(pitch);

  return ((pitchMidiNumber >= lowestPitchMidiNumber) && (pitchMidiNumber <= highestPitchMidiNumber))
    ? pitch
    : undefined;
}

export function isInRange(pitchName: Pitch, minPitch?: Pitch, maxPitch?: Pitch): boolean {
  precondition(
    (minPitch === undefined) ||
    (maxPitch === undefined) ||
    (minPitch <= maxPitch)
  );

  const pitchMidiNumber = getMidiNumber(pitchName);

  if (minPitch && (pitchMidiNumber < minPitch)) {
    return false;
  }

  if (maxPitch && (pitchMidiNumber > maxPitch)) {
    return false;
  }

  return true;
}

export function equals(a: Pitch, b: Pitch): boolean {
  return a === b;
}

export function min(a: Pitch, b: Pitch): Pitch {
  return (a <= b) ? a : b;
}

export function max(a: Pitch, b: Pitch): Pitch {
  return (a >= b) ? a : b;
}

export function getClass(pitch: Pitch): PitchClass {
  return mod(getMidiNumber(pitch), 12);
}

export function addInterval(pitch: Pitch, direction: VerticalDirection, interval: Interval): Pitch {
  return (direction === VerticalDirection.Up)
    ? pitch + interval.halfSteps
    : pitch - interval.halfSteps;
}