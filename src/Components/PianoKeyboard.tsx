import * as React from 'react';

import * as Utils from "../Utils";

export interface IPianoKeyboardProps {
  width: number;
  height: number;
  noteIndex: number;
}
export class PianoKeyboard extends React.Component<IPianoKeyboardProps, {}> {
  public render(): JSX.Element {
    const whiteKeyCount = 7;
    const whiteKeyWidth = this.props.width / whiteKeyCount;
    const whiteKeyHeight = this.props.height;
    const getWhiteKeyX = (i: number) => i * whiteKeyWidth;
    const whiteKeys = Utils.range(0, whiteKeyCount - 1)
      .map(i => <rect key={i} x={getWhiteKeyX(i)} y={0} width={whiteKeyWidth} height={whiteKeyHeight} fill="white" stroke="black" stroke-width="2"/>);

    const blackKeyCount = 5;
    const blackKeyWidth = 0.75 * whiteKeyWidth;
    const blackKeyHeight = this.props.height / 2;
    const getBlackKeyX = (i: number) => {
      const leftWhiteKeyI = (i <= 1) ? i : (i + 1);
      const leftWhiteKeyX = getWhiteKeyX(leftWhiteKeyI);
      const x = leftWhiteKeyX + whiteKeyWidth - (blackKeyWidth / 2);

      return x;
    };
    const blackKeys = Utils.range(0, blackKeyCount - 1)
      .map(i => {
        return <rect key={i} x={getBlackKeyX(i)} y={0} width={blackKeyWidth} height={blackKeyHeight} fill="black" stroke-width="0" />;
      });
    
    const noteDotRadius = blackKeyWidth / 3;
    const isBlackKey = (noteIndex: number) => {
      switch (noteIndex) {
        case 1:
        case 3:
        case 6:
        case 8:
        case 10:
          return true;
        default:
          return false;
      }
    };
    const getKeyX = (noteIndex: number) => {
      if (!isBlackKey(noteIndex)) {
        let whiteKeyIndex: number;

        switch (noteIndex) {
          case 0:
            whiteKeyIndex = 0;
            break;
          case 2:
            whiteKeyIndex = 1;
            break;
          case 4:
            whiteKeyIndex = 2;
            break;
          case 5:
            whiteKeyIndex = 3;
            break;
          case 7:
            whiteKeyIndex = 4;
            break;
          case 9:
            whiteKeyIndex = 5;
            break;
          case 11:
            whiteKeyIndex = 6;
            break;
          default:
            throw new Error(`Unknown note index: ${noteIndex}`);
        }

        return getWhiteKeyX(whiteKeyIndex);
      } else {
        let blackKeyIndex: number;

        switch (noteIndex) {
          case 1:
            blackKeyIndex = 0;
            break;
          case 3:
            blackKeyIndex = 1;
            break;
          case 6:
            blackKeyIndex = 2;
            break;
          case 8:
            blackKeyIndex = 3;
            break;
          case 10:
            blackKeyIndex = 4;
            break;
          default:
            throw new Error(`Unknown note index: ${noteIndex}`);
        }

        return getBlackKeyX(blackKeyIndex);
      }
    };
    const highlightedNoteX = !isBlackKey(this.props.noteIndex)
      ? getKeyX(this.props.noteIndex) + (whiteKeyWidth / 2)
      : getKeyX(this.props.noteIndex) + (blackKeyWidth / 2);
    const highlightedNoteY = !isBlackKey(this.props.noteIndex)
      ? (0.75 * whiteKeyHeight)
      : (blackKeyHeight / 2);
    const highlightedNote = <circle cx={highlightedNoteX} cy={highlightedNoteY} r={noteDotRadius} fill="red" strokeWidth="0" />;

    return (
      <svg width={this.props.width} height={this.props.height} version="1.1" xmlns="http://www.w3.org/2000/svg">
        {whiteKeys}
        {blackKeys}
        {highlightedNote}
      </svg>
    );
  }

  private dottedFretNumbers = [3, 5, 7, 9];
}