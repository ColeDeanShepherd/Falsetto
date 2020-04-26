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

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "../Utils/PianoKeyboard";

import * as PianoScaleDronePlayer from './PianoScaleDronePlayer';
import { getPianoKeyboardAspectRatio } from './PianoUtils';

export interface IPianoScaleFormulaDiagramProps {
  scale: Scale;
  octaveCount: number;
  maxWidth: number;
}
export class PianoScaleFormulaDiagram extends React.Component<IPianoScaleFormulaDiagramProps, {}> {
  public render(): JSX.Element {
    const { scale, octaveCount, maxWidth } = this.props;

    const pianoLowestPitch = new Pitch(PitchLetter.C, 0, scale.rootPitch.octaveNumber);
    const pianoHighestPitch = new Pitch(PitchLetter.B, 0, scale.rootPitch.octaveNumber + (octaveCount - 1));
    const aspectRatio = getPianoKeyboardAspectRatio(octaveCount);
    const margin = new Margin(0, 30, 0, 0);
    const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };
    const pitches = scale.getPitches();
    const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);
    
    function renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
      return (
        <g>
          {renderScaleStepLabels(metrics)}
          {renderPianoKeyboardNoteNames(
            metrics,
            doesKeyUseSharps(scale.rootPitch.letter, scale.rootPitch.signedAccidental),
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
        (scaleStepIndex === 0)
          ? (leftKeyRect.position.x + (leftKeyRect.size.width / 2))
          : ((leftKeyRect.position.x + rightKeyRect.right) / 2),
        -(1.5 * metrics.blackKeyWidth)
      );
      const textStyle: any = {
        fontSize: `${9}px`,
        textAnchor: "middle"
      };
      const halfStepConnectionPos = new Vector2D(textPos.x, textPos.y + 5);
      const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, 10);
      const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, 10);

      const halfSteps = rightPitch.midiNumber - leftPitch.midiNumber;
      const formulaPart = (scaleStepIndex === 0) ? 'R' : ((halfSteps === 1) ? 'H' : 'W');

      const strokeWidth = metrics.blackKeyWidth / 5;

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