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

  public getPitches(): Array<Pitch> {
    const pitches = new Array<Pitch>();

    for (let midiNumber = this.lowestPitch.midiNumber; midiNumber <= this.highestPitch.midiNumber; midiNumber++) {
      pitches.push(Pitch.createFromMidiNumber(midiNumber));
    }

    return pitches;
  }
}

export function renderPianoKeyboardKeyLabels(metrics: PianoKeyboardMetrics, useSharps?: boolean, getLabels?: (pitch: Pitch) => Array<string> | null): JSX.Element {
  let texts = new Array<JSX.Element>(metrics.keyCount);

  for (let keyIndex = 0; keyIndex < metrics.keyCount; keyIndex++) {
    const midiNumber = metrics.lowestPitch.midiNumber + keyIndex;
    const pitch = Pitch.createFromMidiNumber(midiNumber, (useSharps !== undefined) ? useSharps : true);
    
    const labels = getLabels ? getLabels(pitch) : null;
    if (!labels || (labels.length === 0)) {
      continue;
    }

    const fontSize = 0.6 * metrics.blackKeyWidth;
    const textStyle: any = {
      fontSize: `${fontSize}px`,
      fill: pitch.isWhiteKey ? "black" : "white",
      fontWeight: "bold",
      textAnchor: "middle",
      pointerEvents: "none"
    };
    const textYOffset = 0.3 * fontSize;

    const highlightedNoteX = pitch.isWhiteKey
      ? metrics.keyLeftXs[keyIndex] + (metrics.whiteKeyWidth / 2)
      : metrics.keyLeftXs[keyIndex] + (metrics.blackKeyWidth / 2);
    const highlightedNoteY = pitch.isWhiteKey
      ? (0.75 * metrics.whiteKeyHeight)
      : (metrics.blackKeyHeight / 2);

    for (let i = 0; i < labels.length; i++) {
      texts.push(
        <text
          key={`${i}${pitch.midiNumber}`}
          x={highlightedNoteX}
          y={highlightedNoteY + textYOffset + (i * fontSize)}
          style={textStyle}>
          {labels[i]}
        </text>);
    }
  }
  
  return <g className="pass-through-click">{texts}</g>;
}
export function renderPressedPianoKeys(metrics: PianoKeyboardMetrics, pressedPitches: Array<Pitch>): JSX.Element {
  return (
    <g className="pass-through-click">
      {pressedPitches.map(p => {
        const keyRect = Utils.growRectAroundCenter(metrics.getKeyRect(p), -2);

        return (
          <rect
            key={`p${p.midiNumber}`}
            x={keyRect.position.x} y={keyRect.position.y}
            width={keyRect.size.width} height={keyRect.size.height}
            fill="gray"
          />
        );
      })}
    </g>
  );
}
export function renderPianoKeyboardNoteNames(metrics: PianoKeyboardMetrics, useSharps?: boolean, showLetterPredicate?: (pitch: Pitch) => boolean): JSX.Element {
  return renderPianoKeyboardKeyLabels(metrics, useSharps, pitch => {
    if (showLetterPredicate && !showLetterPredicate(pitch)) {
      return null;
    }

    const includeOctaveNumber = false;
    const useSymbols = true;
    const splitPitchString = (useSharps === undefined)
      ? pitch.toOneAccidentalAmbiguousString(includeOctaveNumber, useSymbols).split("/")
      : [pitch.toString(includeOctaveNumber, useSymbols)];
    return splitPitchString;
  });
}

export interface IPianoKeyboardProps {
  rect: Rect2D;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  pressedPitches?: Array<Pitch>;
  onKeyPress?: (keyPitch: Pitch) => void;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
  renderLayeredExtrasFn?: (metrics: PianoKeyboardMetrics) => { whiteKeyLayerExtras: JSX.Element, blackKeyLayerExtras: JSX.Element };
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
          fill="white" stroke="black" strokeWidth="2" className="cursor-pointer"
          onMouseDown={event => {
            if (this.props.onKeyPress) {
              this.props.onKeyPress(pitch);
              event.preventDefault();
            }
          }}
        />);
      } else {
        blackKeys.push(<rect
          key={i}
          x={metrics.keyLeftXs[i]} y={0}
          width={metrics.blackKeyWidth} height={metrics.blackKeyHeight}
          fill="black" strokeWidth="0" className="cursor-pointer"
          onMouseDown={event => {
            if (this.props.onKeyPress) {
              this.props.onKeyPress(pitch);
              event.preventDefault();
            }
          }}
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
              fill="red" strokeWidth="0" className="cursor-pointer"
              onMouseDown={event => this.props.onKeyPress ? this.props.onKeyPress(pressedPitch) : null}
            />;
          })
      : null;

    const extraElements = this.props.renderExtrasFn
      ? this.props.renderExtrasFn(metrics)
      : null;
    
    const layeredExtraElements = this.props.renderLayeredExtrasFn
      ? this.props.renderLayeredExtrasFn(metrics)
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
          {layeredExtraElements ? layeredExtraElements.whiteKeyLayerExtras : null}
          {blackKeys}
          {layeredExtraElements ? layeredExtraElements.blackKeyLayerExtras : null}
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