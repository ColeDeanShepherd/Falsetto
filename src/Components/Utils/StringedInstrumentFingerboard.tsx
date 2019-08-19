import * as React from "react";

import * as Utils from "../../Utils";
import { Vector2D } from '../../Vector2D';
import { StringedInstrumentNote } from '../../StringedInstrumentNote';
import { StringedInstrumentTuning } from './StringedInstrumentTuning';
import { Interval } from '../../Interval';
import { VerticalDirection } from '../../VerticalDirection';
import { Pitch } from '../../Pitch';

export function getIntervalDeltaFretNumber(
  interval: Interval, direction: VerticalDirection, stringIndex: number,
  deltaStringIndex: number, tuning: StringedInstrumentTuning
): number {
  Utils.precondition(stringIndex >= 0);
  Utils.precondition(stringIndex < tuning.stringCount);
  Utils.precondition((stringIndex + deltaStringIndex) >= 0);
  Utils.precondition((stringIndex + deltaStringIndex) < tuning.stringCount);

  const signedHalfSteps = (direction === VerticalDirection.Up)
    ? interval.halfSteps
    : -interval.halfSteps;

  if (deltaStringIndex === 0) {
    return signedHalfSteps;
  }

  const halfStepsBetweenStrings =
    tuning.openStringPitches[stringIndex + deltaStringIndex].midiNumber -
    tuning.openStringPitches[stringIndex].midiNumber;
  const deltaFretNumber = signedHalfSteps - halfStepsBetweenStrings;
  return deltaFretNumber;
}

export function get1stStringedInstrumentNoteOnString(pitch: Pitch, stringIndex: number, tuning: StringedInstrumentTuning): StringedInstrumentNote {
  Utils.precondition(stringIndex >= 0);
  Utils.precondition(stringIndex < tuning.stringCount);

  const openStringPitch = tuning.openStringPitches[stringIndex];

  let notePitch = new Pitch(pitch.letter, pitch.signedAccidental, openStringPitch.octaveNumber);
  if (notePitch.midiNumber < openStringPitch.midiNumber) {
    notePitch.octaveNumber++;
  }

  return new StringedInstrumentNote(notePitch, stringIndex);
}

export class StringedInstrumentMetrics {
  public constructor(
    public width: number,
    public height: number,
    public hasFrets: boolean,
    public minFretNumber: number = 0,
    public fretCount: number = StringedInstrumentFingerboard.DEFAULT_FRET_COUNT,
    public stringCount: number = 6
  ) {
    Utils.precondition((fretCount >= 1) && (fretCount <= 24))
    
    this.nutWidth = (minFretNumber === 0) ? 8 :  4;

    this.stringSpacing = (this.height - (2 * this.topBottomStringMargin)) / (this.stringCount - 1);
    this.fretSpacing = (this.width - this.nutWidth) / this.fretCount;
    
    this.nutX = this.nutWidth / 2;

    this.stringsLeft = this.nutWidth;

    this.fretDotRadius = this.fretSpacing / 4;
    this.fretDotY = this.height / 2;
  }

  public nutWidth: number;
  public fretWidth: number = 4;

  public topBottomStringMargin = 5;
  public stringSpacing: number;
  public fretSpacing: number;

  public nutX: number;

  public stringsLeft: number;

  public fretDotRadius: number;
  public fretDotY: number;
  
  public lowestStringWidth: number = 3;

  public getStringY(stringIndex: number): number {
    return this.height - this.topBottomStringMargin - (stringIndex * this.stringSpacing);
  }
  public getStringWidth(stringIndex: number): number {
    return this.lowestStringWidth / (1 + (stringIndex / 4));
  }
  public getFretX(fretNumber: number): number {
    return this.stringsLeft + ((fretNumber - this.minFretNumber) * this.fretSpacing);
  }
  public getFretSpaceCenterX(fretNumber: number): number {
    return this.stringsLeft + ((fretNumber - 1 - this.minFretNumber) * this.fretSpacing) + (this.fretSpacing / 2);
  }
  public getNoteX(fretNumber: number) {
    return this.hasFrets
      ? Math.max(
        this.getFretSpaceCenterX(fretNumber),
        this.nutWidth / 2
      ) : this.getFretX(fretNumber);
  }
  public getTextXOffset(fontSize: number): number {
    return -(0.3 * fontSize);
  }
  public getTextYOffset(fontSize: number): number {
    return 0.3 * fontSize;
  }
}

export interface IStringedInstrumentFingerboardProps {
  width: number;
  height: number;
  tuning: StringedInstrumentTuning;
  hasFrets: boolean;
  dottedFretNumbers?: Array<number>;
  positionLineFretNumbers?: Array<number>;
  minFretNumber?: number;
  fretCount?: number;
  pressedNotes?: Array<StringedInstrumentNote>;
  renderExtrasFn?: (metrics: StringedInstrumentMetrics) => JSX.Element;
  style?: any;
}
export class StringedInstrumentFingerboard extends React.Component<IStringedInstrumentFingerboardProps, {}> {
  public static readonly DEFAULT_FRET_COUNT = 11;

  public render(): JSX.Element {
    const margin = 20;

    const metrics = new StringedInstrumentMetrics(
      this.props.width - (2 * margin),
      this.props.height - (2 * margin),
      this.props.hasFrets,
      (this.props.minFretNumber !== undefined) ? this.props.minFretNumber : 0,
      (this.props.fretCount !== undefined) ? this.props.fretCount : StringedInstrumentFingerboard.DEFAULT_FRET_COUNT,
      this.props.tuning.stringCount
    );
    
    const tuning = this.props.tuning;

    const neckRect = (
      <rect
        x={0} y={0}
        width={metrics.width} height={metrics.height}
        strokeWidth="0"
        fill="#844e30"
        opacity="1"
      />
    );

    const nutColor = "#a29f98";
    const nut = <line
      x1={metrics.nutX} y1={0}
      x2={metrics.nutX} y2={metrics.height}
      stroke={nutColor} strokeWidth={metrics.nutWidth}
    />;

    const stringColor = "#dad2cb";
    const strings = Utils.range(0, metrics.stringCount - 1)
      .map(i => {
        const y = metrics.getStringY(i);
        return <line
          key={i}
          x1={metrics.stringsLeft} y1={y}
          x2={metrics.width} y2={y}
          stroke={stringColor} strokeWidth={metrics.getStringWidth(i)}
        />;
      });

    const fretColor = "#bebeba";
    const frets = this.props.hasFrets ? (
      Utils.range(1, metrics.fretCount)
        .map(i => {
          const x = metrics.stringsLeft + (i * metrics.fretSpacing);
          return <line
            key={i}
            x1={x} y1={0}
            x2={x} y2={metrics.height}
            stroke={fretColor} strokeWidth={metrics.fretWidth}
          />;
        })
      ) : null;
    
    const positionFontSize = 12;
    const positionTextStyle: any = {
      fontSize: `${positionFontSize}px`,
      fontWeight: "bold",
      textAnchor: "middle"
    };
    const positionLineColor = "white";
    const positionLineFretNumbers = (this.props.positionLineFretNumbers !== undefined) ? this.props.positionLineFretNumbers : [];
    const positionLines = (
      positionLineFretNumbers
        .map((fretNumber, positionIndex) => {
          const x = metrics.getNoteX(fretNumber);;
          return (
            <g>
              <line
                key={fretNumber}
                x1={x} y1={0}
                x2={x} y2={metrics.height}
                stroke={positionLineColor} strokeWidth="1"
              />
              <text
                x={x} y={metrics.height + (1.6 * positionFontSize)}
                style={positionTextStyle}>{1 + positionIndex}</text>
            </g>
          );
        })
    );

    const dottedFretNumbers = (this.props.dottedFretNumbers !== undefined) ? this.props.dottedFretNumbers : [];
    const fretDotColor = "#fdfcf8";
    const fretDots = this.props.hasFrets ? (
      dottedFretNumbers
        .filter(fretNumber => (fretNumber > metrics.minFretNumber) && ((fretNumber - metrics.minFretNumber) <= metrics.fretCount))
        .map(fretNumber => {
          const x = metrics.getFretSpaceCenterX(fretNumber);

          if ((fretNumber % 12) != 0) {
            return <circle key={fretNumber} cx={x} cy={metrics.fretDotY} r={metrics.fretDotRadius} fill={fretDotColor} strokeWidth="0" />;
          } else {
            const fretDotYOffset = metrics.stringSpacing;
            return (
              <g>
                <circle
                  key={fretNumber}
                  cx={x} cy={metrics.fretDotY - fretDotYOffset} r={metrics.fretDotRadius}
                  fill={fretDotColor} strokeWidth="0"
                />
                <circle
                  key={`${fretNumber}_2`}
                  cx={x} cy={metrics.fretDotY + fretDotYOffset} r={metrics.fretDotRadius}
                  fill={fretDotColor} strokeWidth="0"
                />
              </g>
            );
          }
        })
    ) : null;

    const noteCircleLineColor = "gray";
    const noteCircles = !this.props.hasFrets ? (
      Utils.range(0, 3)
        .map(stringIndex => Utils.range(0, metrics.fretCount)
          .map(fretNumber => {
            const position = new Vector2D(
              metrics.getNoteX(fretNumber),
              metrics.getStringY(stringIndex)
            );

            return <circle
              key={fretNumber}
              cx={position.x} cy={position.y} r={metrics.fretDotRadius}
              fill="none" stroke={noteCircleLineColor}
              strokeWidth="2"
            />;
          }))
    ) : null;

    const noteHighlightColor = "lightblue";
    const noteHighlights = this.props.pressedNotes ? (
        this.props.pressedNotes
        .map((note, i) => {
          const x = metrics.getNoteX(note.getFretNumber(tuning));
          const y = metrics.getStringY(note.stringIndex);
          return <circle
            key={i}
            cx={x} cy={y} r={metrics.fretDotRadius}
            fill={noteHighlightColor} strokeWidth="0"
          />;
        })
      ) : null;
    const extraElements = this.props.renderExtrasFn
      ? this.props.renderExtrasFn(metrics)
      : null;

    return (
      <svg
        width={this.props.width} height={this.props.height}
        viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={this.props.style}>
        <g transform={`translate(${margin},${margin})`}>
          {neckRect}
          {nut}
          {frets}
          {fretDots}
          {strings}
          {positionLines}
          {noteCircles}
          {noteHighlights}
          {extraElements}
        </g>
      </svg>
    );
  }
}