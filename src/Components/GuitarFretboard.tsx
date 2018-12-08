import * as React from 'react';

import * as Utils from "../Utils";

export interface IGuitarFretboardProps {
  width: number;
  height: number;
  noteStringIndex: number,
  noteFretNumber: number
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
    
    const highlightedNoteX = Math.max(
      getFretSpaceCenterX(this.props.noteFretNumber),
      nutWidth / 2
    );
    const highlightedNoteY = getStringY(this.props.noteStringIndex);
    const highlightedNote = <circle cx={highlightedNoteX} cy={highlightedNoteY} r={fretDotRadius} fill="red" strokeWidth="0" />;

    return (
      <svg width={this.props.width} height={this.props.height} version="1.1" xmlns="http://www.w3.org/2000/svg">
        {nut}
        {strings}
        {frets}
        {fretDots}
        {highlightedNote}
      </svg>
    );
  }

  private dottedFretNumbers = [3, 5, 7, 9];
}