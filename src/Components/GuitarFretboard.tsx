import * as React from 'react';

import * as Utils from "../Utils";
import { Pitch } from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';

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

export interface IGuitarFretboardProps {
  width: number;
  height: number;
  pressedNotes: Array<GuitarNote>;
}
export class GuitarFretboard extends React.Component<IGuitarFretboardProps, {}> {
  public render(): JSX.Element {
    const stringCount = 6;
    const fretCount = 11;
    const nutWidth = 8;
    const stringWidth = 4;
    const fretWidth = 4;
    const stringSpacing = (this.props.height - stringWidth) / (stringCount - 1);
    const fretSpacing = (this.props.width - nutWidth) / fretCount;

    const nutX = nutWidth / 2;
    const nut = <line x1={nutX} x2={nutX} y1={0} y2={this.props.height} stroke="black" strokeWidth={nutWidth} />;

    const getStringY = (stringIndex: number) => this.props.height - (stringWidth / 2) - (stringIndex * stringSpacing);
    const stringsLeft = nutWidth;
    const strings = Utils.range(0, stringCount - 1)
      .map(i => {
        const y = getStringY(i);
        return <line key={i} x1={stringsLeft} x2={this.props.width} y1={y} y2={y} stroke="black" strokeWidth={stringWidth} />;
      });
    
    const frets = Utils.range(1, fretCount)
      .map(i => {
        const x = stringsLeft + (i * fretSpacing);
        return <line key={i} x1={x} x2={x} y1={0} y2={this.props.height} stroke="black" strokeWidth={fretWidth} />;
      });
    
    const getFretSpaceCenterX = (fretNumber: number) => stringsLeft + ((fretNumber - 1) * fretSpacing) + (fretSpacing / 2);
    const fretDotRadius = fretSpacing / 4;
    const fretDotY = this.props.height / 2;
    const fretDots = this.dottedFretNumbers
      .map(fretNumber => {
        const x = getFretSpaceCenterX(fretNumber);
        return <circle key={fretNumber} cx={x} cy={fretDotY} r={fretDotRadius} fill="black" strokeWidth="0" />;
      });
    
    const noteHighlights = this.props.pressedNotes
      .map((note, i) => {
        const x = Math.max(
          getFretSpaceCenterX(note.getFretNumber(standardGuitarTuning)),
          nutWidth / 2
        );
        const y = getStringY(note.stringIndex);
        return <circle key={i} cx={x} cy={y} r={fretDotRadius} fill="red" strokeWidth="0" />;
      });

    return (
      <svg width={this.props.width} height={this.props.height} version="1.1" xmlns="http://www.w3.org/2000/svg">
        {nut}
        {strings}
        {frets}
        {fretDots}
        {noteHighlights}
      </svg>
    );
  }

  private dottedFretNumbers = [3, 5, 7, 9];
}