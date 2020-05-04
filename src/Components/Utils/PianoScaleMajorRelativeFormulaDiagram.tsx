import * as React from "react";

import { Scale } from "../../lib/TheoryLib/Scale";
import { doesKeyUseSharps } from "../../lib/TheoryLib/Key";

import { PianoKeyboardMetrics, renderPianoKeyboardKeyLabels } from "./PianoKeyboard";

import { PianoScaleDronePlayer } from './PianoScaleDronePlayer';

export interface IPianoScaleMajorRelativeFormulaDiagramProps {
  scale: Scale;
  octaveCount: number;
  maxWidth: number;
}
export class PianoScaleMajorRelativeFormulaDiagram extends React.Component<IPianoScaleMajorRelativeFormulaDiagramProps, {}> {
  public render(): JSX.Element {
    const { scale, octaveCount, maxWidth } = this.props;

    const useSharps = doesKeyUseSharps(scale.rootPitch.letter, scale.rootPitch.signedAccidental);
    const useSymbols = true;
    const pitchMidiNumberNoOctaves = scale.getPitches()
      .map(p => p.midiNumberNoOctave);
    
    function renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
      return renderPianoKeyboardKeyLabels(metrics, useSharps, pitch => {
        const pitchMidiNumberNoOctave = pitch.midiNumberNoOctave;
        const pitchIndex = pitchMidiNumberNoOctaves.indexOf(pitchMidiNumberNoOctave);
        if (pitchIndex < 0) { return []; }

        return [
          scale.type.formula.parts[pitchIndex].toString(useSymbols),
          pitch.toString(/*includeOctaveNumber*/ false, useSymbols)
        ];
      });
    }

    return (
      <PianoScaleDronePlayer
        scale={scale}
        octaveCount={octaveCount}
        maxWidth={maxWidth}
        renderDefaultExtras={false}
        renderExtrasFn={renderExtrasFn} />
    );
  }
}