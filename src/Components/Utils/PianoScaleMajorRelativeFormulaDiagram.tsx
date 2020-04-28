import * as React from "react";

import { arrayContains } from "../../lib/Core/ArrayUtils";
import { Rect2D } from "../../lib/Core/Rect2D";
import { Vector2D } from "../../lib/Core/Vector2D";
import { Size2D } from "../../lib/Core/Size2D";
import { Margin } from "../../lib/Core/Margin";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";

import { Scale } from "../../lib/TheoryLib/Scale";
import { doesKeyUseSharps } from "../../lib/TheoryLib/Key";

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics, renderPianoKeyboardKeyLabels } from "./PianoKeyboard";

import * as PianoScaleDronePlayer from './PianoScaleDronePlayer';
import { getPianoKeyboardAspectRatio } from './PianoUtils';

export interface IPianoScaleMajorRelativeFormulaDiagramProps {
  scale: Scale;
  octaveCount: number;
  maxWidth: number;
}
export class PianoScaleMajorRelativeFormulaDiagram extends React.Component<IPianoScaleMajorRelativeFormulaDiagramProps, {}> {
  public render(): JSX.Element {
    const { scale, octaveCount, maxWidth } = this.props;

    const pianoLowestPitch = new Pitch(PitchLetter.C, 0, scale.rootPitch.octaveNumber);
    const pianoHighestPitch = new Pitch(PitchLetter.B, 0, scale.rootPitch.octaveNumber + (octaveCount - 1));
    const aspectRatio = getPianoKeyboardAspectRatio(octaveCount);
    const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };
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
      <PianoKeyboard
        rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
        lowestPitch={pianoLowestPitch}
        highestPitch={pianoHighestPitch}
        pressedPitches={[]}
        onKeyPress={p => this.onKeyPress(p)}
        renderExtrasFn={renderExtrasFn}
        style={style} />
    );
  }

  private audioCancellationFn: (() => void) | undefined = undefined;

  private onKeyPress(pitch: Pitch) {
    const { scale } = this.props;

    if (this.audioCancellationFn) {
      this.audioCancellationFn();
    }

    this.audioCancellationFn = PianoScaleDronePlayer.onKeyPress(scale, pitch);
  }
}