import * as React from "react";

import { Scale } from '../../lib/TheoryLib/Scale';
import { Pitch } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { renderPianoKeyboardNoteNames, PianoKeyboard, PianoKeyboardMetrics } from './PianoKeyboard';
import { doesKeyUseSharps } from '../../lib/TheoryLib/Key';
import { arrayContains } from '../../lib/Core/ArrayUtils';

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
  
    return (
      <PianoKeyboard
        maxWidth={300}
        lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
        highestPitch={new Pitch(PitchLetter.C, 0, 6)}
        pressedPitches={[]}
        renderExtrasFn={metrics => renderExtrasFn(metrics, pitches, scale.rootPitch)} />
    );
  }
}