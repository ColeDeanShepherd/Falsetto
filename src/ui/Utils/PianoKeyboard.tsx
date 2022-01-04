import * as React from "react";
import wu from "wu";

import { getRectRoundedBottomPathDefString } from "../../lib/Core/SvgUtils";
import { Pitch, getPitchesInRange } from '../../lib/TheoryLib/Pitch';
import { Rect2D } from '../../lib/Core/Rect2D';
import { Margin } from '../../lib/Core/Margin';
import { Size2D } from '../../lib/Core/Size2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { invariant, precondition } from '../../lib/Core/Dbc';
import { growRectAroundCenter, maxScaleFactorToFit } from '../../lib/Core/MathUtils';
import { isBitSet } from '../../lib/Core/Utils';
import { blackKeyWidthOverWhiteKeyWidth, blackKeyHeightOverWhiteKeyHeight, pianoWhiteKeyAspectRatio } from './PianoUtils';

export class PianoKeyboardMetrics {
  public constructor(
    public maxWidth: number | undefined,
    public maxHeight: number | undefined,
    public lowestPitch: Pitch,
    public highestPitch: Pitch
  ) {
    if (maxWidth !== undefined) {
      precondition(maxWidth >= 0);
    }
    
    if (maxHeight !== undefined) {
      precondition(maxHeight >= 0);
    }
    
    invariant(this.lowestPitch.midiNumber <= this.highestPitch.midiNumber);

    // Calculate key counts.
    const areKeysWhite = wu(getPitchesInRange(lowestPitch, highestPitch))
      .map(p => p.isWhiteKey)
      .toArray();

    this.whiteKeyCount = 0;
    this.blackKeyCount = 0;
    
    for (let i = 0; i < areKeysWhite.length; i++) {
      if (areKeysWhite[i]) {
        this.whiteKeyCount++;
      } else {
        this.blackKeyCount++;
      }
    }

    // Layout the keyboard with a "normalized" size.
    let normalizedSize: Size2D;

    {
      const keyCount = areKeysWhite.length;
      const lastKeyIndex = keyCount - 1;
      
      this.whiteKeySize = new Size2D(pianoWhiteKeyAspectRatio, 1);
      this.blackKeySize = new Size2D(
        this.whiteKeySize.width * blackKeyWidthOverWhiteKeyWidth,
        this.whiteKeySize.height * blackKeyHeightOverWhiteKeyHeight
      );

      this.keyLeftXs = new Array<number>(keyCount);

      let currentX = 0;

      for (let i = 0; i < keyCount; i++) {
        this.keyLeftXs[i] = currentX;
        
        // Advance currentX
        const isLastKey = i === lastKeyIndex;
        const isWhiteKey = areKeysWhite[i];

        if (!isLastKey) {
          const isNextKeyWhite = areKeysWhite[i + 1];

          // If the next key is black, we know the current key is white.
          if (!isNextKeyWhite) {
            currentX += this.whiteKeySize.width - (this.blackKeySize.width / 2);
          }

          // If the next key is white and the current key is black:
          else if (!isWhiteKey) {
            currentX += this.blackKeySize.width / 2;
          }

          // If the next key is white and the current key is white:
          else {
            currentX += this.whiteKeySize.width;
          }
        } else {
          currentX += isWhiteKey ? this.whiteKeySize.width : this.blackKeySize.width;
        }
      }

      normalizedSize = new Size2D(currentX, 1);
    }

    // Scale the "normalized" keyboard layout up to fix maxWidth & maxHeight.
    {
      let scaleFactor = maxScaleFactorToFit(maxWidth, maxHeight, normalizedSize);
      if (scaleFactor === Infinity) { scaleFactor = 100; }
      
      this.svgSize = normalizedSize.times(scaleFactor);

      this.whiteKeySize = this.whiteKeySize.times(scaleFactor);
      this.blackKeySize = this.blackKeySize.times(scaleFactor);

      for (let i = 0; i < this.keyLeftXs.length; i++) {
        this.keyLeftXs[i] *= scaleFactor;
      }
    }
  }
  
  public svgSize: Size2D;

  public whiteKeyCount: number;
  public blackKeyCount: number;

  public whiteKeySize: Size2D;
  public blackKeySize: Size2D;

  public keyLeftXs: Array<number>;

  public get keyCount(): number {
    return this.whiteKeyCount + this.blackKeyCount;
  }

  public getKeyRect(pitch: Pitch): Rect2D {
    precondition(pitch.midiNumber >= this.lowestPitch.midiNumber);
    precondition(pitch.midiNumber <= this.highestPitch.midiNumber);

    const keyIndex = pitch.midiNumber - this.lowestPitch.midiNumber;
    return new Rect2D(
      pitch.isWhiteKey ? this.whiteKeySize : this.blackKeySize,
      new Vector2D(
        this.keyLeftXs[keyIndex],
        0
      )
    );
  }

  public getPitches(): Array<Pitch> {
    const pitches = new Array<Pitch>();

    for (let midiNumber = this.lowestPitch.midiNumber; midiNumber <= this.highestPitch.midiNumber; midiNumber++) {
      pitches.push(createPitchFromMidiNumber(midiNumber));
    }

    return pitches;
  }
}

export function renderPianoKeyboardKeyLabels(metrics: PianoKeyboardMetrics, useSharps?: boolean, getLabels?: (pitch: Pitch) => Array<string> | null): JSX.Element {
  let texts = new Array<JSX.Element>(metrics.keyCount);

  for (let keyIndex = 0; keyIndex < metrics.keyCount; keyIndex++) {
    const midiNumber = metrics.lowestPitch.midiNumber + keyIndex;
    const pitch = createPitchFromMidiNumber(midiNumber, (useSharps !== undefined) ? useSharps : true);
    
    const labels = getLabels ? getLabels(pitch) : null;
    if (!labels || (labels.length === 0)) {
      continue;
    }

    const fontSize = 0.6 * metrics.blackKeySize.width;
    const textStyle: any = {
      fontSize: `${fontSize}px`,
      fill: pitch.isWhiteKey ? "black" : "white",
      fontWeight: "bold",
      textAnchor: "middle",
      pointerEvents: "none"
    };
    const textYOffset = 0.3 * fontSize;

    const highlightedNoteX = pitch.isWhiteKey
      ? metrics.keyLeftXs[keyIndex] + (metrics.whiteKeySize.width / 2)
      : metrics.keyLeftXs[keyIndex] + (metrics.blackKeySize.width / 2);
    const highlightedNoteY = pitch.isWhiteKey
      ? (0.82 * metrics.whiteKeySize.height)
      : (metrics.blackKeySize.height / 2);

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

export function renderPianoKeyHighlights(metrics: PianoKeyboardMetrics, pressedPitches: Array<Pitch>, fill?: string): JSX.Element {
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
            fill={fill ? fill : 'gray'} strokeWidth={0}
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
  maxWidth?: number;
  maxHeight?: number;
  position?: Vector2D;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  lowestEnabledPitch?: Pitch;
  highestEnabledPitch?: Pitch;
  allowDragPresses?: boolean;
  pressedPitches?: Array<Pitch>;
  onKeyPress?: (keyPitch: Pitch) => void;
  onKeyRelease?: (keyPitch: Pitch) => void;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element; // TODO: remove
  renderLayeredExtrasFn?: (metrics: PianoKeyboardMetrics) => { whiteKeyLayerExtras: JSX.Element, blackKeyLayerExtras: JSX.Element };
  margin?: Margin;
  style?: any;
}

export class PianoKeyboard extends React.Component<IPianoKeyboardProps, {}> {
  public render(): JSX.Element {
    const position = (this.props.position !== undefined)
      ? this.props.position
      : new Vector2D(0, 0);

    const allowDragPresses = (this.props.allowDragPresses !== undefined) ? this.props.allowDragPresses : true;

    const margin = this.getMargin();
    const metrics = this.getMetrics();
    const svgSize = new Size2D(margin.horizontal + metrics.svgSize.width, margin.vertical + metrics.svgSize.height);

    const whiteKeys = new Array<JSX.Element>();
    const blackKeys = new Array<JSX.Element>();

    const whiteKeyRadius = metrics.whiteKeySize.width / 8;
    const blackKeyRadius = metrics.blackKeySize.width / 8;

    const whiteKeyStrokeWidth = metrics.whiteKeySize.width / 15;

    const style = this.getStyle(metrics);

    for (let i = 0; i < metrics.keyCount; i++) {
      const midiNumber = metrics.lowestPitch.midiNumber + i;
      const pitch = createPitchFromMidiNumber(midiNumber);
      
      const isKeyEnabled = this.isKeyEnabled(pitch);

      const onPointerDown = isKeyEnabled
        ? (
          (event: React.PointerEvent<SVGPathElement>): void => {
            if (this.props.onKeyPress) {
              this.props.onKeyPress(pitch);
              event.preventDefault();
            }
          }
        )
        : undefined;
      
      const onPointerUp = isKeyEnabled
        ? (
          (event: React.PointerEvent<SVGPathElement>): void => {
            if (this.props.onKeyRelease) {
              this.props.onKeyRelease(pitch);
              event.preventDefault();
            }
          }
        )
        : undefined;

      const onPointerOver = (isKeyEnabled && allowDragPresses)
        ? (
          (event: React.PointerEvent<SVGPathElement>) => {
            if (isBitSet(event.buttons, 0)) {
              if (this.props.onKeyPress) {
                this.props.onKeyPress(pitch);
                event.preventDefault();
              }
            }
          }
        )
        : undefined;
      
      const onPointerOut = isKeyEnabled
        ? (
          (event: React.PointerEvent<SVGPathElement>) => {
            if (this.props.onKeyRelease) {
              this.props.onKeyRelease(pitch);
              event.preventDefault();
            }
          }
        )
        : undefined;

      const className = isKeyEnabled ? "cursor-pointer" : "";

      if (pitch.isWhiteKey) {
        const position = new Vector2D(metrics.keyLeftXs[i], 0);
        const size = new Size2D(metrics.whiteKeySize.width, metrics.whiteKeySize.height);
        const fill = isKeyEnabled ? "white" : "gray";

        whiteKeys.push(
          <path
            key={i}
            d={getRectRoundedBottomPathDefString(position, size, whiteKeyRadius)}
            fill={fill}
            stroke="black" strokeWidth={whiteKeyStrokeWidth}
            className={className}
            touch-action="none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
          />
        );
      } else {
        const position = new Vector2D(metrics.keyLeftXs[i], 0);
        const size = new Size2D(metrics.blackKeySize.width, metrics.blackKeySize.height);
        blackKeys.push(
          <path
            key={i}
            d={getRectRoundedBottomPathDefString(position, size, blackKeyRadius)}
            fill="black" strokeWidth="0" className={className}
            touch-action="none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
          />
        );
      }
    }

    const whiteNoteHighlights = this.props.pressedPitches
      ? renderPianoKeyHighlights(metrics, this.props.pressedPitches.filter(p => p.isWhiteKey))
      : null;
    const blackNoteHighlights = this.props.pressedPitches
      ? renderPianoKeyHighlights(metrics, this.props.pressedPitches.filter(p => p.isBlackKey))
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
        x={position.x} y={position.y}
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={style}>
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

  private getStyle(metrics: PianoKeyboardMetrics): any {
    if ((metrics.maxWidth === undefined) && (metrics.maxHeight === undefined)) {
      return { ...this.props.style, width: "100%", height: "auto" };
    } else if ((metrics.maxWidth !== undefined) && (metrics.maxHeight !== undefined)) {
      return { ...this.props.style, width: `${metrics.maxWidth}px`, height: `${metrics.maxHeight}px` };
    } else if (metrics.maxWidth !== undefined) {
      return { ...this.props.style, width: "100%", maxWidth: `${metrics.maxWidth}px`, height: "auto" };
    } else {
      return { ...this.props.style, width: "auto", height: "100%", maxHeight: `${metrics.maxHeight}` };
    }
  }

  private getMargin(): Margin {
    return this.props.margin
      ? this.props.margin
      : new Margin(0, 0, 0, 0)
  }

  private getMetrics(): PianoKeyboardMetrics {
    const { maxWidth, maxHeight, lowestPitch, highestPitch } = this.props;

    return new PianoKeyboardMetrics(
      maxWidth, maxHeight,
      lowestPitch, highestPitch
    );
  }

  private isKeyEnabled(pitch: Pitch): boolean {
    const { lowestEnabledPitch, highestEnabledPitch } = this.props;

    return Pitch.isInRange(pitch, lowestEnabledPitch, highestEnabledPitch);
  }
}