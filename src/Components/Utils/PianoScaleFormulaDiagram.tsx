import * as React from "react";

import { arrayContains } from "../../lib/Core/ArrayUtils";
import { Rect2D } from "../../lib/Core/Rect2D";
import { Vector2D } from "../../lib/Core/Vector2D";
import { Size2D } from "../../lib/Core/Size2D";
import { Margin } from "../../lib/Core/Margin";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";

import { ScaleType, Scale } from "../../lib/TheoryLib/Scale";
import { doesKeyUseSharps } from "../../lib/TheoryLib/Key";

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "../Utils/PianoKeyboard";

import { playPitches } from "../../Audio/PianoAudio";
import * as PianoScaleDronePlayer from './PianoScaleDronePlayer';
import { getPianoKeyboardAspectRatio } from './PianoUtils';

export interface IPianoScaleFormulaDiagramProps {
  scaleType: ScaleType
}
export class PianoScaleFormulaDiagram extends React.Component<IPianoScaleFormulaDiagramProps, {}> {
  public render(): JSX.Element {
    const { rootPitch } = this;
    const { scaleType } = this.props;

    const maxWidth = 300;
    const aspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 1);
    const margin = new Margin(0, 50, 0, 0);
    const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };
    const pitches = scaleType.getPitches(rootPitch);
    const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);
    
    function renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
      return (
        <g>
          {renderScaleStepLabels(metrics)}
          {renderPianoKeyboardNoteNames(
            metrics,
            doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental),
            p => arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave))}
        </g>
      );
    }

    function renderScaleStepLabels(metrics: PianoKeyboardMetrics): JSX.Element {
      return <g>{pitches.map((_, i) => renderScaleStepLabel(metrics, i))}</g>;
    }

    function renderScaleStepLabel(metrics: PianoKeyboardMetrics, scaleStepIndex: number): JSX.Element {
      const leftPitch = pitches[(scaleStepIndex === 0) ? 0 : scaleStepIndex - 1];
      const rightPitch = pitches[(scaleStepIndex === 0) ? 0 : scaleStepIndex];

      const leftKeyRect = metrics.getKeyRect(leftPitch);
      const rightKeyRect = metrics.getKeyRect(rightPitch);

      const textPos = new Vector2D(
        (scaleStepIndex === 0) ? leftKeyRect.position.x + (leftKeyRect.size.width / 2) : leftKeyRect.right,
        -(maxWidth / 20)
      );
      const textStyle: any = {
        fontSize: `${9}px`,
        textAnchor: "middle"
      };
      const halfStepConnectionPos = new Vector2D(textPos.x, textPos.y + 5);
      const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, 20);
      const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, 20);

      const halfSteps = rightPitch.midiNumber - leftPitch.midiNumber;
      const formulaPart = (scaleStepIndex === 0) ? 'R' : ((halfSteps === 1) ? 'H' : 'W');

      const strokeWidth = maxWidth / 200;

      return (
        <g>
          <text x={textPos.x} y={textPos.y} style={textStyle}>
            {formulaPart}
          </text>
          <line
            x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
            x2={leftKeyLinePos.x} y2={leftKeyLinePos.y}
            stroke="red" strokeWidth={strokeWidth} />
          {(scaleStepIndex > 0) ? (
            <line
              x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
              x2={rightKeyLinePos.x} y2={rightKeyLinePos.y}
              stroke="red" strokeWidth={strokeWidth} />
          ) : null}
        </g>
      );
    }

    return (
      <PianoKeyboard
        rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
        margin={margin}
        lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
        highestPitch={new Pitch(PitchLetter.B, 0, 4)}
        pressedPitches={[]}
        onKeyPress={p => this.onKeyPress(p)}
        renderExtrasFn={renderExtrasFn}
        style={style} />
    );
  }
  
  private rootPitch = new Pitch(PitchLetter.C, 0, 4);

  private audioCancellationFn: (() => void) | undefined = undefined;

  private onKeyPress(pitch: Pitch) {
    const { scaleType } = this.props;

    if (this.audioCancellationFn) {
      this.audioCancellationFn();
    }

    this.audioCancellationFn = PianoScaleDronePlayer.onKeyPress(new Scale(scaleType, this.rootPitch), pitch);
  }
}