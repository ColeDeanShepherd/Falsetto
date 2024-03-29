import * as React from "react";

import { playPitchesSequentially } from "../../../Audio/PianoAudio";

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "../../Utils/PianoKeyboard";
import { Pitch } from '../../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../../lib/TheoryLib/PitchLetter';

import _32ndNote from "!file-loader!../../../img/sheet-music/32nd-note.svg";
import _32ndRest from "!file-loader!../../../img/sheet-music/32nd-rest.svg";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { range } from '../../../lib/Core/MathUtils';
import { Card } from "../../../ui/Card/Card";
export const defaultRootPitch = new Pitch(PitchLetter.C, 0, 4);

export const MainTitle: React.FunctionComponent<{}> = props => <h1>{props.children}</h1>;
export const SectionTitle: React.FunctionComponent<{}> = props => <h2>{props.children}</h2>;
export const SubSectionTitle: React.FunctionComponent<{}> = props => <h3>{props.children}</h3>;

export const OctavesPlayer: React.FunctionComponent<{}> = props => {
  return (
    <PianoKeyboard
      maxWidth={400}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 4)}
      pressedPitches={[]}
      onKeyPress={p => playPitchesSequentially(range(0, 3).map(i => new Pitch(p.letter, p.signedAccidental, p.octaveNumber - 2 + i)), 500, true)}
      renderExtrasFn={renderPianoKeyboardNoteNames} />
  );
};

export const Term: React.FunctionComponent<{}> = props => <span style={{ fontWeight: "bold" }}>{props.children}</span>;

export function renderPianoKeyLabel(
  metrics: PianoKeyboardMetrics,
  pitch: Pitch,
  label: string,
  isAboveKeyboard: boolean,
  textOffset: Vector2D = new Vector2D(0, 0)): JSX.Element {
  const keyRect = metrics.getKeyRect(pitch);

  const fontSizePx = metrics.svgSize.height / 8;
  const unsignedYOffset = metrics.svgSize.height / 4;
  const textPos = new Vector2D(
    textOffset.x + keyRect.center.x,
    textOffset.y + (isAboveKeyboard ? -unsignedYOffset : (metrics.svgSize.height + fontSizePx + unsignedYOffset)));
  const textStyle: any = {
    textAnchor: "middle",
    fontSize: `${fontSizePx}px`
  };
  const lineConnectionPos = new Vector2D(
    textPos.x,
    isAboveKeyboard ? (textPos.y + 5) : (textPos.y - fontSizePx)
  );

  const keyLineUnsignedYOffset = metrics.svgSize.height / 15;
  const keyLinePos = new Vector2D(
    keyRect.center.x,
    isAboveKeyboard ? keyLineUnsignedYOffset : (metrics.svgSize.height - keyLineUnsignedYOffset)
  );

  return (
    <g>
      <text x={textPos.x} y={textPos.y} style={textStyle}>
        {label}
      </text>
      <line
        x1={lineConnectionPos.x} y1={lineConnectionPos.y}
        x2={keyLinePos.x} y2={keyLinePos.y}
        stroke="red" strokeWidth={4} />
    </g>
  );
}
export function renderIntervalLabel(metrics: PianoKeyboardMetrics, leftPitch: Pitch, rightPitch: Pitch, label: string, isAboveKeyboard: boolean): JSX.Element {
  const leftKeyRect = metrics.getKeyRect(leftPitch);
  const rightKeyRect = metrics.getKeyRect(rightPitch);

  const fontSizePx = metrics.svgSize.height / 8;
  const unsignedYOffset = metrics.svgSize.height / 4;
  const textPos = new Vector2D(
    (leftKeyRect.center.x + rightKeyRect.center.x) / 2,
    isAboveKeyboard ? -unsignedYOffset : (metrics.svgSize.height + fontSizePx + unsignedYOffset));
  const textStyle: any = {
    textAnchor: "middle",
    fontSize: `${fontSizePx}px`
  };
  const lineConnectionPos = new Vector2D(
    textPos.x,
    isAboveKeyboard ? (textPos.y + 5) : (textPos.y - fontSizePx)
  );

  const keyLineUnsignedYOffset = metrics.svgSize.height / 15;
  const linePosY = isAboveKeyboard ? keyLineUnsignedYOffset : (metrics.svgSize.height - keyLineUnsignedYOffset);
  const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, linePosY);
  const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, linePosY);

  return (
    <g>
      <text x={textPos.x} y={textPos.y} style={textStyle}>
        {label}
      </text>
      <line
        x1={lineConnectionPos.x} y1={lineConnectionPos.y}
        x2={leftKeyLinePos.x} y2={leftKeyLinePos.y}
        stroke="red" strokeWidth={4} />
      <line
        x1={lineConnectionPos.x} y1={lineConnectionPos.y}
        x2={rightKeyLinePos.x} y2={rightKeyLinePos.y}
        stroke="red" strokeWidth={4} />
    </g>
  );
}

export interface SectionProps {
  hideMoreInfoUri: boolean;
}

export interface ISectionProps {
  section: React.FunctionComponent<SectionProps>;
}
export class SectionContainer extends React.Component<ISectionProps, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        {React.createElement(this.props.section, { hideMoreInfoUri: this.hideMoreInfoUri })}
      </Card>
    );
  }

  private hideMoreInfoUri: boolean = true;
}