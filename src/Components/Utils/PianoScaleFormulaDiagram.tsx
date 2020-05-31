import * as React from "react";

import { arrayContains } from "../../lib/Core/ArrayUtils";
import { Vector2D } from "../../lib/Core/Vector2D";
import { Margin } from "../../lib/Core/Margin";

import { Scale } from "../../lib/TheoryLib/Scale";
import { doesKeyUseSharps } from "../../lib/TheoryLib/Key";

import { renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "../Utils/PianoKeyboard";

import { PianoScaleDronePlayer } from './PianoScaleDronePlayer';

export interface IPianoScaleFormulaDiagramProps {
  scale: Scale;
  octaveCount: number;
  maxWidth: number;
}
export class PianoScaleFormulaDiagram extends React.Component<IPianoScaleFormulaDiagramProps, {}> {
  public render(): JSX.Element {
    const { scale, octaveCount, maxWidth } = this.props;

    const margin = new Margin(0, maxWidth / 10, 0, 0);
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

    function renderScaleStepLabel(metrics: PianoKeyboardMetrics, scaleStepIndex: number): JSX.Element | null {
      if (scaleStepIndex === 0) { return null; }

      const leftPitch = pitches[(scaleStepIndex === 0) ? 0 : scaleStepIndex - 1];
      const rightPitch = pitches[(scaleStepIndex === 0) ? 0 : scaleStepIndex];

      const leftKeyRect = metrics.getKeyRect(leftPitch);
      const rightKeyRect = metrics.getKeyRect(rightPitch);

      const textPos = new Vector2D(
        (scaleStepIndex === 0)
          ? (leftKeyRect.position.x + (leftKeyRect.size.width / 2))
          : ((leftKeyRect.position.x + rightKeyRect.right) / 2),
        -(1.5 * metrics.blackKeySize.width)
      );
      const textStyle: any = {
        fontSize: `${maxWidth / 25}px`,
        textAnchor: "middle"
      };
      const halfStepConnectionPos = new Vector2D(textPos.x, textPos.y + 5);
      const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, 10);
      const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, 10);

      const halfSteps = rightPitch.midiNumber - leftPitch.midiNumber;
      const formulaPart = (halfSteps === 1) ? 'H' : 'W';

      const strokeWidth = metrics.blackKeySize.width / 7;

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
      <PianoScaleDronePlayer
        scale={scale}
        octaveCount={octaveCount}
        maxWidth={maxWidth}
        margin={margin}
        renderExtrasFn={renderExtrasFn} />
    );
  }
}