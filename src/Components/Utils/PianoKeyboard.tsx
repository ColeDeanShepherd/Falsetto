import * as React from "react";

import { getRectRoundedBottomPathDefString } from "../../lib/Core/SvgUtils";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Rect2D } from '../../lib/Core/Rect2D';
import { Margin } from '../../lib/Core/Margin';
import { Size2D } from '../../lib/Core/Size2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { invariant, precondition } from '../../lib/Core/Dbc';
import { growRectAroundCenter } from '../../lib/Core/MathUtils';
import { isBitSet } from '../../lib/Core/Utils';
import { blackKeyWidthOverWhiteKeyWidth, blackKeyHeightOverWhiteKeyHeight } from './PianoUtils';

export class PianoKeyboardMetrics {
  public constructor(
    public width: number,
    public height: number,
    public lowestPitch: Pitch,
    public highestPitch: Pitch
  ) {
    invariant(this.lowestPitch.midiNumber <= this.highestPitch.midiNumber);

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
    if (this.whiteKeyCount > 0) {
      let widthAsMultipleOfWhiteKeyWidth = this.whiteKeyCount;
      if (this.lowestPitch.isBlackKey) {
        widthAsMultipleOfWhiteKeyWidth += (blackKeyWidthOverWhiteKeyWidth / 2);
      }
      if (this.highestPitch.isBlackKey) {
        widthAsMultipleOfWhiteKeyWidth += (blackKeyWidthOverWhiteKeyWidth / 2);
      }
  
      this.whiteKeyWidth = width / widthAsMultipleOfWhiteKeyWidth;
      this.blackKeyWidth = blackKeyWidthOverWhiteKeyWidth * this.whiteKeyWidth;
    } else {
      this.blackKeyWidth = width;
      this.whiteKeyWidth = this.blackKeyWidth / blackKeyWidthOverWhiteKeyWidth;
    }

    // Calculate key heights.
    this.whiteKeyHeight = height;
    this.blackKeyHeight = blackKeyHeightOverWhiteKeyHeight * this.whiteKeyHeight;

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
    precondition(pitch.midiNumber >= this.lowestPitch.midiNumber);
    precondition(pitch.midiNumber <= this.highestPitch.midiNumber);

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
      ? (0.82 * metrics.whiteKeyHeight)
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
        const keyRect = metrics.getKeyRect(p);
        const highlightRect = growRectAroundCenter(keyRect, -(keyRect.size.width / 6));
        const highlightRadius = highlightRect.size.width / 8;

        return (
          <path
            key={`p${p.midiNumber}`}
            d={getRectRoundedBottomPathDefString(highlightRect.position, highlightRect.size, highlightRadius)}
            fill="gray" strokeWidth={0}
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
  allowDragPresses?: boolean;
  pressedPitches?: Array<Pitch>;
  onKeyPress?: (keyPitch: Pitch) => void;
  onKeyRelease?: (keyPitch: Pitch) => void;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
  renderLayeredExtrasFn?: (metrics: PianoKeyboardMetrics) => { whiteKeyLayerExtras: JSX.Element, blackKeyLayerExtras: JSX.Element };
  margin?: Margin;
  style?: any;
}
export class PianoKeyboard extends React.Component<IPianoKeyboardProps, {}> {
  public render(): JSX.Element {
    const allowDragPresses = (this.props.allowDragPresses !== undefined) ? this.props.allowDragPresses : true;

    const margin = this.getMargin();
    const svgSize = new Size2D(margin.horizontal + this.props.rect.size.width, margin.vertical + this.props.rect.size.height);
    const metrics = this.getMetrics();

    const whiteKeys = new Array<JSX.Element>();
    const blackKeys = new Array<JSX.Element>();

    const whiteKeyRadius = metrics.whiteKeyWidth / 8;
    const blackKeyRadius = metrics.blackKeyWidth / 8;

    const whiteKeyStrokeWidth = metrics.whiteKeyWidth / 15;

    for (let i = 0; i < metrics.keyCount; i++) {
      const midiNumber = metrics.lowestPitch.midiNumber + i;
      const pitch = Pitch.createFromMidiNumber(midiNumber);
      
      const onPointerOver = (event: React.PointerEvent<SVGPathElement>) => {
        if (isBitSet(event.buttons, 0)) {
          if (this.props.onKeyPress) {
            this.props.onKeyPress(pitch);
            event.preventDefault();
          }
        }
      };
      
      const onPointerOut = (event: React.PointerEvent<SVGPathElement>) => {
        if (this.props.onKeyRelease) {
          this.props.onKeyRelease(pitch);
          event.preventDefault();
        }
      };

      if (pitch.isWhiteKey) {
        const position = new Vector2D(metrics.keyLeftXs[i], 0);
        const size = new Size2D(metrics.whiteKeyWidth, metrics.whiteKeyHeight);
        whiteKeys.push(
          <path
            key={i}
            d={getRectRoundedBottomPathDefString(position, size, whiteKeyRadius)}
            fill="white" stroke="black" strokeWidth={whiteKeyStrokeWidth} className="cursor-pointer"
            touch-action="none"
            onPointerDown={event => {
              if (this.props.onKeyPress) {
                this.props.onKeyPress(pitch);
                event.preventDefault();
              }
            }}
            onPointerUp={event => {
              if (this.props.onKeyRelease) {
                this.props.onKeyRelease(pitch);
                event.preventDefault();
              }
            }}
            onPointerOver={allowDragPresses ? onPointerOver : undefined}
            onPointerOut={allowDragPresses ? onPointerOut : undefined}
          />
        );
      } else {
        const position = new Vector2D(metrics.keyLeftXs[i], 0);
        const size = new Size2D(metrics.blackKeyWidth, metrics.blackKeyHeight);
        blackKeys.push(
          <path
            key={i}
            d={getRectRoundedBottomPathDefString(position, size, blackKeyRadius)}
            fill="black" strokeWidth="0" className="cursor-pointer"
            touch-action="none"
            onPointerDown={event => {
              if (this.props.onKeyPress) {
                this.props.onKeyPress(pitch);
                event.preventDefault();
              }
            }}
            onPointerUp={event => {
              if (this.props.onKeyRelease) {
                this.props.onKeyRelease(pitch);
                event.preventDefault();
              }
            }}
            onPointerOver={allowDragPresses ? onPointerOver : undefined}
            onPointerOut={allowDragPresses ? onPointerOut : undefined}
          />
        );
      }
    }

    const whiteNoteHighlights = this.props.pressedPitches
      ? renderPressedPianoKeys(metrics, this.props.pressedPitches.filter(p => p.isWhiteKey))
      : null;
    const blackNoteHighlights = this.props.pressedPitches
      ? renderPressedPianoKeys(metrics, this.props.pressedPitches.filter(p => p.isBlackKey))
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
          {whiteNoteHighlights}
          {layeredExtraElements ? layeredExtraElements.whiteKeyLayerExtras : null}
          {blackKeys}
          {blackNoteHighlights}
          {layeredExtraElements ? layeredExtraElements.blackKeyLayerExtras : null}
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