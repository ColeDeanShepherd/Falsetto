// Pitches are simply MIDI note numbers.
export type Pitch = number;

export function* getPitchesInRange(minPitch: Pitch, maxPitch: Pitch) {
  for (let pitch = minPitch; pitch <= maxPitch; pitch++) {
    yield pitch;
  }
}

export function expandPitchRangeToIncludePitch(pitchRange: [Pitch, Pitch], pitchName: Pitch): [Pitch, Pitch] {
  // If the pitch is lower than the range's min pitch, lower the range's min pitch to the lower pitch.
  if (pitchName < pitchRange[0]) {
    return [pitchName, pitchRange[1]];
  }
  // If the pitch is higher than the range's max pitch, raise the range's max pitch to the higher pitch.
  else if (pitchName > pitchRange[1]) {
    return [pitchRange[0], pitchName];
  }
  // If the pitch is already in the range, we don't need to expand the range.
  else {
    return pitchRange;
  }
}

export function getNumPitchesInRange(pitchRange: [Pitch, Pitch]): number {
  return pitchRange[1] - pitchRange[0] + 1;
}