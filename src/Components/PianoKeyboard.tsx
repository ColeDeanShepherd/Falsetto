import * as React from "react";

import * as Utils from "../Utils";
import { Pitch } from "../Pitch";
import { Rect2D } from '../Rect2D';
import { Margin } from '../Margin';
import { Size2D } from '../Size2D';
import { Vector2D } from '../Vector2D';

export class PianoKeyboardMetrics {
  public constructor(
    public width: number,
    public height: number,
    public lowestPitch: Pitch,
    public highestPitch: Pitch
  ) {
    Utils.invariant(this.lowestPitch.midiNumber <= this.highestPitch.midiNumber);

    // Calculate key counts.
    this.whiteKeyCount = 0;
    this.blackKeyCount = 0;
    for (let i = lowestPitch.midiNumber; i <= highestPitch.midiNumber; i++) {
      if (Pitch.createFromMidiNumber(i).isWhiteKey) {
        this.whiteKeyCount++;
      } else {
        this.blackKeyCount++;
      }
    }

    // Calculate key widths.
    const blackKeyWhiteKeyWidthRatio = 0.66;

    if (this.whiteKeyCount > 0) {
      let widthAsMultipleOfWhiteKeyWidth = this.whiteKeyCount;
      if (this.lowestPitch.isBlackKey) {
        widthAsMultipleOfWhiteKeyWidth += (blackKeyWhiteKeyWidthRatio / 2);
      }
      if (this.highestPitch.isBlackKey) {
        widthAsMultipleOfWhiteKeyWidth += (blackKeyWhiteKeyWidthRatio / 2);
      }
  
      this.whiteKeyWidth = width / widthAsMultipleOfWhiteKeyWidth;
      this.blackKeyWidth = blackKeyWhiteKeyWidthRatio * this.whiteKeyWidth;
    } else {
      this.blackKeyWidth = width;
      this.whiteKeyWidth = this.blackKeyWidth / blackKeyWhiteKeyWidthRatio;
    }

    // Calculate key heights.
    const blackKeyWhiteKeyHeightRatio = 0.6;

    this.whiteKeyHeight = height;
    this.blackKeyHeight = blackKeyWhiteKeyHeightRatio * this.whiteKeyHeight;

    // Calculate key left x"s.
    this.keyLeftXs = new Array<number>(this.keyCount);
    let whiteKeyX = this.lowestPitch.isWhiteKey
      ? 0
      : (this.blackKeyWidth / 2);
    
    for (let i = 0; i < this.keyCount; i++) {
      const midiNumber = this.lowestPitch.midiNumber + i;
      const pitch = Pitch.createFromMidiNumber(midiNumber);

      if (pitch.isWhiteKey) {
        this.keyLeftXs[i] = whiteKeyX;
        whiteKeyX += this.whiteKeyWidth;
      } else {
        const blackKeyX = whiteKeyX - (this.blackKeyWidth / 2);
        this.keyLeftXs[i] = blackKeyX;
      }
    }
  }
  
  public whiteKeyCount: number;
  public blackKeyCount: number;

  public whiteKeyWidth: number;
  public whiteKeyHeight: number;

  public blackKeyWidth: number;
  public blackKeyHeight: number;

  public keyLeftXs: Array<number>;

  public get keyCount(): number {
    return this.whiteKeyCount + this.blackKeyCount;
  }

  public getKeyRect(pitch: Pitch): Rect2D {
    Utils.precondition(pitch.midiNumber >= this.lowestPitch.midiNumber);
    Utils.precondition(pitch.midiNumber <= this.highestPitch.midiNumber);

    const keyIndex = pitch.midiNumber - this.lowestPitch.midiNumber;
    return new Rect2D(
      new Size2D(
        pitch.isWhiteKey ? this.whiteKeyWidth : this.blackKeyWidth,
        pitch.isWhiteKey ? this.whiteKeyHeight : this.blackKeyHeight
      ),
      new Vector2D(
        this.keyLeftXs[keyIndex],
        0
      )
    );
  }
}

export function renderPianoKeyboardNoteNames(metrics: PianoKeyboardMetrics): JSX.Element {
  let texts = new Array<JSX.Element>(metrics.keyCount);

  for (let keyIndex = 0; keyIndex < metrics.keyCount; keyIndex++) {
    const midiNumber = metrics.lowestPitch.midiNumber + keyIndex;
    const pitch = Pitch.createFromMidiNumber(midiNumber);

    const fontSize = 0.6 * metrics.blackKeyWidth;
    const textStyle: any = {
      fontSize: `${fontSize}px`,
      fill: pitch.isWhiteKey ? "black" : "white",
      fontWeight: "bold",
      pointerEvents: "none"
    };
    const textXOffset = -(0.3 * fontSize);
    const textYOffset = 0.3 * fontSize;

    const highlightedNoteX = pitch.isWhiteKey
      ? metrics.keyLeftXs[keyIndex] + (metrics.whiteKeyWidth / 2)
      : metrics.keyLeftXs[keyIndex] + (0.3 * metrics.blackKeyWidth);
    const highlightedNoteY = pitch.isWhiteKey
      ? (0.75 * metrics.whiteKeyHeight)
      : (metrics.blackKeyHeight / 2);

    const includeOctaveNumber = false;
    const useFlatSymbol = true;
    const splitPitchString = pitch.toOneAccidentalAmbiguousString(includeOctaveNumber, useFlatSymbol).split("/");

    for (let i = 0; i < splitPitchString.length; i++) {
      texts.push(
        <text
          key={pitch.midiNumber}
          x={highlightedNoteX + textXOffset}
          y={highlightedNoteY + textYOffset + (i * fontSize)}
          style={textStyle}>
          {splitPitchString[i]}
        </text>);
    }
  }
  
  return <g>{texts}</g>;
}

export interface IPianoKeyboardProps {
  rect: Rect2D;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  pressedPitches?: Array<Pitch>;
  onKeyPress?: (keyPitch: Pitch) => void;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
  margin?: Margin;
  style?: any;
}
export class PianoKeyboard extends React.Component<IPianoKeyboardProps, {}> {
  public render(): JSX.Element {
    const margin = this.getMargin();
    const svgSize = new Size2D(margin.horizontal + this.props.rect.size.width, margin.vertical + this.props.rect.size.height);
    const metrics = this.getMetrics();

    const whiteKeys = new Array<JSX.Element>();
    const blackKeys = new Array<JSX.Element>();
    
    for (let i = 0; i < metrics.keyCount; i++) {
      const midiNumber = metrics.lowestPitch.midiNumber + i;
      const pitch = Pitch.createFromMidiNumber(midiNumber);

      if (pitch.isWhiteKey) {
        whiteKeys.push(<rect
          key={i}
          x={metrics.keyLeftXs[i]} y={0}
          width={metrics.whiteKeyWidth} height={metrics.whiteKeyHeight}
          fill="white" stroke="black" strokeWidth="2" className="cursor-pointer-on-hover"
          onMouseDown={event => this.props.onKeyPress ? this.props.onKeyPress(pitch) : null}
        />);
      } else {
        blackKeys.push(<rect
          key={i}
          x={metrics.keyLeftXs[i]} y={0}
          width={metrics.blackKeyWidth} height={metrics.blackKeyHeight}
          fill="black" strokeWidth="0" className="cursor-pointer-on-hover"
          onMouseDown={event => this.props.onKeyPress ? this.props.onKeyPress(pitch) : null}
        />);
      }
    }
    
    const noteDotRadius = metrics.blackKeyWidth / 3;

    const noteHighlights = this.props.pressedPitches
      ? this.props.pressedPitches
          .map(pressedPitch => {
            const noteIndex = pressedPitch.midiNumber - metrics.lowestPitch.midiNumber;
            if ((noteIndex < 0) || (noteIndex >= metrics.keyLeftXs.length)) {
              return;
            }

            const highlightedNoteX = pressedPitch.isWhiteKey
              ? metrics.keyLeftXs[noteIndex] + (metrics.whiteKeyWidth / 2)
              : metrics.keyLeftXs[noteIndex] + (metrics.blackKeyWidth / 2);
            const highlightedNoteY = pressedPitch.isWhiteKey
              ? (0.75 * metrics.whiteKeyHeight)
              : (metrics.blackKeyHeight / 2);
            return <circle
              key={pressedPitch.toString(true)}
              cx={highlightedNoteX} cy={highlightedNoteY}
              r={noteDotRadius}
              fill="red" strokeWidth="0" className="cursor-pointer-on-hover"
              onMouseDown={event => this.props.onKeyPress ? this.props.onKeyPress(pressedPitch) : null}
            />;
          })
      : null;

    const extraElements = this.props.renderExtrasFn
      ? this.props.renderExtrasFn(metrics)
      : null;

    return (
      <svg
        width={svgSize.width} height={svgSize.height}
        x={this.props.rect.position.x} y={this.props.rect.position.y}
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={this.props.style}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {whiteKeys}
          {blackKeys}
          {noteHighlights}
          {extraElements}
        </g>
      </svg>
    );
  }

  private getMargin(): Margin {
    return this.props.margin
      ? this.props.margin
      : new Margin(0, 0, 0, 0)
  }
  private getMetrics(): PianoKeyboardMetrics {
    return new PianoKeyboardMetrics(
      this.props.rect.size.width, this.props.rect.size.height,
      this.props.lowestPitch, this.props.highestPitch
    );
  }
}