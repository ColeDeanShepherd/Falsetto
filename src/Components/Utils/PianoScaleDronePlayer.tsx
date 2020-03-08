import * as React from "react";

import * as Utils from "../../lib/Core/Utils";
import { Scale } from '../../lib/TheoryLib/Scale';
import { Pitch } from '../../lib/TheoryLib/Pitch';
import { playPitches } from '../../Piano';
import { Rect2D } from '../../lib/Core/Rect2D';
import { Size2D } from '../../lib/Core/Size2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { renderPianoKeyboardNoteNames, PianoKeyboard, PianoKeyboardMetrics } from './PianoKeyboard';
import { doesKeyUseSharps } from '../../lib/TheoryLib/Key';
import { arrayContains } from '../../lib/Core/ArrayUtils';

export function onKeyPress(scale: Scale, keyPitch: Pitch) {
  const pitches = scale.getPitches();
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

  if (arrayContains(pitchMidiNumberNoOctaves, keyPitch.midiNumberNoOctave)) {
    if (keyPitch.midiNumber === scale.rootPitch.midiNumber) {
      playPitches([scale.rootPitch]);
    } else {
      playPitches([scale.rootPitch, keyPitch]);
    }
  }
}
export function renderExtrasFn(metrics: PianoKeyboardMetrics, pitches: Array<Pitch>, rootPitch: Pitch): JSX.Element {
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

  return renderPianoKeyboardNoteNames(metrics, doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental), p => arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave));
}

export const PianoScaleDronePlayer: React.FunctionComponent<{ scale: Scale, style?: any }> = props => {
  const pitches = props.scale.getPitches();

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(300, 150), new Vector2D(0, 0))}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.C, 0, 5)}
      pressedPitches={[]}
      renderExtrasFn={metrics => renderExtrasFn(metrics, pitches, props.scale.rootPitch)}
      onKeyPress={pitch => onKeyPress(props.scale, pitch)}
      style={props.style} />
  );
};