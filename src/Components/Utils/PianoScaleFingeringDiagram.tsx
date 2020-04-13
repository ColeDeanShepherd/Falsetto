import * as React from "react";

import { Scale } from '../../lib/TheoryLib/Scale';
import { Pitch } from '../../lib/TheoryLib/Pitch';
import { Rect2D } from '../../lib/Core/Rect2D';
import { Size2D } from '../../lib/Core/Size2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { renderPianoKeyboardNoteNames, PianoKeyboard, PianoKeyboardMetrics } from './PianoKeyboard';
import { doesKeyUseSharps } from '../../lib/TheoryLib/Key';
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { getPianoKeyboardAspectRatio } from './PianoUtils';

export function renderExtrasFn(metrics: PianoKeyboardMetrics, pitches: Array<Pitch>, rootPitch: Pitch): JSX.Element {
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

  return renderPianoKeyboardNoteNames(metrics, doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental), p => arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave));
}

export interface IPianoScaleFingeringDiagramProps {
  scale: Scale;
}

export class PianoScaleFingeringDiagram extends React.Component<IPianoScaleFingeringDiagramProps, {}> {
  public render(): JSX.Element {
    const { scale } = this.props;
    
    const pitches = scale.getPitches();

    const width = 300;
    const height = 150;

    const octaveCount = 2;
    const aspectRatio = getPianoKeyboardAspectRatio(octaveCount);
    const rect = new Rect2D(new Size2D(aspectRatio * height, height), new Vector2D(0, 0));

    const style = { width: "100%", maxWidth: `${width}px`, height: "auto" };
  
    return (
      <PianoKeyboard
        rect={rect}
        lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
        highestPitch={new Pitch(PitchLetter.C, 0, 6)}
        pressedPitches={[]}
        renderExtrasFn={metrics => renderExtrasFn(metrics, pitches, scale.rootPitch)}
        style={style} />
    );
  }
}