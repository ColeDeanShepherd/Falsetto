import * as React from "react";

import * as Utils from "../Utils";
import { Pitch } from "../Pitch";
import { PitchLetter } from "../PitchLetter";

export const STRING_COUNT = 6;

export class GuitarTuning {
  public constructor(public openStringPitches: Array<Pitch>) {
    Utils.invariant(this.openStringPitches.length === STRING_COUNT);
  }
  public getNote(stringIndex: number, fretNumber: number): GuitarNote {
    Utils.precondition((stringIndex >= 0) && (stringIndex < STRING_COUNT));

    const pitch = Pitch.createFromMidiNumber(
      this.openStringPitches[stringIndex].midiNumber + fretNumber
    );
    return new GuitarNote(pitch, stringIndex);
  }
}
export const standardGuitarTuning = new GuitarTuning([
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);

export class GuitarNote {
  public static allNotesOfPitches(
    tuning: GuitarTuning,
    pitches: Array<Pitch>,
    maxFretNumber: number
  ): Array<GuitarNote> {
    Utils.precondition(maxFretNumber >= 0);

    const fretNumbers = Utils.range(0, maxFretNumber);
    return Utils.flattenArrays<GuitarNote>(
      tuning.openStringPitches
        .map((_, stringIndex) => fretNumbers
          .map(fretNumber => new GuitarNote(
            tuning.getNote(stringIndex, fretNumber).pitch,
            stringIndex
          ))
          .filter(note => pitches.some(p => p.midiNumberNoOctave === note.pitch.midiNumberNoOctave))
        )
    );
  }

  public constructor(
    public pitch: Pitch,
    public stringIndex: number
  ) {
    Utils.invariant((stringIndex >= 0) && (stringIndex < STRING_COUNT));
  }

  // TODO: add tests
  public getFretNumber(tuning: GuitarTuning): number {
    const openStringPitch = tuning.openStringPitches[this.stringIndex];
    return this.pitch.midiNumber - openStringPitch.midiNumber;
  }
}

export class GuitarFretboardMetrics {
  public constructor(
    public width: number,
    public height: number
  ) {
    this.stringSpacing = (this.height - this.stringWidth) / (this.stringCount - 1);
    this.fretSpacing = (this.width - this.nutWidth) / this.fretCount;
    
    this.nutX = this.nutWidth / 2;

    this.stringsLeft = this.nutWidth;

    this.fretDotRadius = this.fretSpacing / 4;
    this.fretDotY = this.height / 2;
  }

  public stringCount: number = 6;
  public fretCount: number = 11;
  public nutWidth: number = 8;
  public stringWidth: number = 4;
  public fretWidth: number = 4;

  public stringSpacing: number;
  public fretSpacing: number;

  public nutX: number;

  public stringsLeft: number;

  public fretDotRadius: number;
  public fretDotY: number;

  public getStringY(stringIndex: number): number {
    return this.height - (this.stringWidth / 2) - (stringIndex * this.stringSpacing);
  }
  public getFretSpaceCenterX(fretNumber: number): number {
    return this.stringsLeft + ((fretNumber - 1) * this.fretSpacing) + (this.fretSpacing / 2);
  }
  public getNoteX(fretNumber: number) {
    return Math.max(
      this.getFretSpaceCenterX(fretNumber),
      this.nutWidth / 2
    );
  }
}

export function renderGuitarFretboardScaleExtras(metrics: GuitarFretboardMetrics, pitches: Array<Pitch>): JSX.Element {
  const guitarNotes = GuitarNote.allNotesOfPitches(
    standardGuitarTuning,
    pitches,
    11
  );

  const rootPitchFretDots = guitarNotes
    .map((guitarNote, noteIndex) => {
      const scaleDegree = 1 + pitches.findIndex(p => p.midiNumberNoOctave === guitarNote.pitch.midiNumberNoOctave);

      const x = metrics.getNoteX(guitarNote.getFretNumber(standardGuitarTuning));
      const y = metrics.getStringY(guitarNote.stringIndex);
      const fill = (scaleDegree === 1) ? "green" : "red";

      const fontSize = 16;
      const textStyle = {
        fontSize: `${fontSize}px`
      };
      const textXOffset = -(0.3 * fontSize);
      const textYOffset = 0.3 * fontSize;

      return (
        <g>
          <circle key={noteIndex} cx={x} cy={y} r={metrics.fretDotRadius} fill={fill} strokeWidth="0" />
          <text x={x + textXOffset} y={y + textYOffset} style={textStyle}>{scaleDegree}</text>
        </g>
      );
    });
  
  return <g>{rootPitchFretDots}</g>;
}

export interface IGuitarFretboardProps {
  width: number;
  height: number;
  pressedNotes: Array<GuitarNote>;
  renderExtrasFn?: (metrics: GuitarFretboardMetrics) => JSX.Element;
}
export class GuitarFretboard extends React.Component<IGuitarFretboardProps, {}> {
  public render(): JSX.Element {
    const metrics = new GuitarFretboardMetrics(this.props.width, this.props.height);

    const nut = <line x1={metrics.nutX} x2={metrics.nutX} y1={0} y2={this.props.height} stroke="black" strokeWidth={metrics.nutWidth} />;
    const strings = Utils.range(0, metrics.stringCount - 1)
      .map(i => {
        const y = metrics.getStringY(i);
        return <line key={i} x1={metrics.stringsLeft} x2={this.props.width} y1={y} y2={y} stroke="black" strokeWidth={metrics.stringWidth} />;
      });
    const frets = Utils.range(1, metrics.fretCount)
      .map(i => {
        const x = metrics.stringsLeft + (i * metrics.fretSpacing);
        return <line key={i} x1={x} x2={x} y1={0} y2={this.props.height} stroke="black" strokeWidth={metrics.fretWidth} />;
      });
    const fretDots = this.dottedFretNumbers
      .map(fretNumber => {
        const x = metrics.getFretSpaceCenterX(fretNumber);
        return <circle key={fretNumber} cx={x} cy={metrics.fretDotY} r={metrics.fretDotRadius} fill="black" strokeWidth="0" />;
      });
    const noteHighlights = this.props.pressedNotes
      .map((note, i) => {
        const x = metrics.getNoteX(note.getFretNumber(standardGuitarTuning));
        const y = metrics.getStringY(note.stringIndex);
        return <circle key={i} cx={x} cy={y} r={metrics.fretDotRadius} fill="red" strokeWidth="0" />;
      });
    const extraElements = this.props.renderExtrasFn
      ? this.props.renderExtrasFn(metrics)
      : null;

    return (
      <svg width={this.props.width} height={this.props.height} version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g>
          {nut}
          {strings}
          {frets}
          {fretDots}
          {noteHighlights}
          {extraElements}
        </g>
      </svg>
    );
  }

  private dottedFretNumbers = [3, 5, 7, 9];
}