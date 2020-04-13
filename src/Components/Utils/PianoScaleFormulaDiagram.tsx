import * as React from "react";

import { arrayContains } from "../../lib/Core/ArrayUtils";
import { Rect2D } from "../../lib/Core/Rect2D";
import { Vector2D } from "../../lib/Core/Vector2D";
import { Size2D } from "../../lib/Core/Size2D";
import { Margin } from "../../lib/Core/Margin";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";

import { ScaleType } from "../../lib/TheoryLib/Scale";
import { doesKeyUseSharps } from "../../lib/TheoryLib/Key";

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "../Utils/PianoKeyboard";

import { playPitches } from "../../Audio/PianoAudio";

export const PianoScaleFormulaDiagram: React.FunctionComponent<{ scale: ScaleType }> = props => {
  const width = 300;
  const height = 200;
  const margin = new Margin(0, 50, 0, 0);
  const style = { width: "100%", maxWidth: "300px", height: "auto" };
  const rootPitch = new Pitch(PitchLetter.C, 0, 4);
  const pitches = props.scale.getPitches(rootPitch);
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);
  
  function renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
    return (
      <g>
        {renderScaleStepLabels(metrics)}
        {renderPianoKeyboardNoteNames(metrics, doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental), p => arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave))}
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
      -35
    );
    const textStyle: any = {
      textAnchor: "middle"
    };
    const halfStepConnectionPos = new Vector2D(textPos.x, textPos.y + 5);
    const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, 20);
    const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, 20);

    const halfSteps = rightPitch.midiNumber - leftPitch.midiNumber;
    const formulaPart = (scaleStepIndex === 0) ? 'R' : ((halfSteps === 1) ? 'H' : 'W');

    return (
      <g>
        <text x={textPos.x} y={textPos.y} style={textStyle}>
          {formulaPart}
        </text>
        <line
          x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
          x2={leftKeyLinePos.x} y2={leftKeyLinePos.y}
          stroke="red" strokeWidth={4} />
        {(scaleStepIndex > 0) ? (
          <line
            x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
            x2={rightKeyLinePos.x} y2={rightKeyLinePos.y}
            stroke="red" strokeWidth={4} />
        ) : null}
      </g>
    );
  }

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(width, height), new Vector2D(0, 0))}
      margin={margin}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 4)}
      pressedPitches={[]}
      onKeyPress={p => {
        if (arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave)) {
          playPitches([p]);
        }
      }}
      renderExtrasFn={renderExtrasFn}
      style={style} />
  );
};