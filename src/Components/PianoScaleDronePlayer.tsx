import * as React from "react";

import * as Utils from "../Utils";
import { ScaleType } from '../Scale';
import { Pitch } from '../Pitch';
import { playPitches } from '../Piano';
import { Rect2D } from '../Rect2D';
import { Size2D } from '../Size2D';
import { Vector2D } from '../Vector2D';
import { PitchLetter } from '../PitchLetter';
import { renderPianoKeyboardNoteNames, PianoKeyboard, PianoKeyboardMetrics } from './PianoKeyboard';
import { doesKeyUseSharps } from '../Key';

export function onKeyPress(scaleType: ScaleType, rootPitch: Pitch, keyPitch: Pitch) {
  const pitches = scaleType.getPitches(rootPitch);
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

  if (Utils.arrayContains(pitchMidiNumberNoOctaves, keyPitch.midiNumberNoOctave)) {
    if (keyPitch.midiNumber === rootPitch.midiNumber) {
      playPitches([rootPitch]);
    } else {
      playPitches([rootPitch, keyPitch]);
    }
  }
}
export function renderExtrasFn(metrics: PianoKeyboardMetrics, pitches: Array<Pitch>, rootPitch: Pitch): JSX.Element {
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

  return renderPianoKeyboardNoteNames(metrics, doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental), p => Utils.arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave));
}

export const PianoScaleDronePlayer: React.FunctionComponent<{ scaleType: ScaleType, rootPitch: Pitch, style?: any }> = props => {
  const pitches = props.scaleType.getPitches(props.rootPitch);

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(300, 150), new Vector2D(0, 0))}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.C, 0, 5)}
      pressedPitches={[]}
      renderExtrasFn={metrics => renderExtrasFn(metrics, pitches, props.rootPitch)}
      onKeyPress={pitch => onKeyPress(props.scaleType, props.rootPitch, pitch)}
      style={props.style} />
  );
};