import * as React from "react";

import * as Utils from "../Utils";
import { Rect } from "../Rect";
import { Pitch } from "../Pitch";

class PianoKeyboardMetrics {
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

  public getKeyIndex(pitch: Pitch): number {
    return pitch.midiNumber - this.lowestPitch.midiNumber;
  }
  public getKeyRect(pitch: Pitch): Rect {
    var isWhite = pitch.isWhiteKey;
    return new Rect(
      isWhite ? this.whiteKeyWidth : this.blackKeyWidth,
      isWhite ? this.whiteKeyHeight : this.blackKeyHeight,
      this.keyLeftXs[this.getKeyIndex(pitch)], 0
    );
  }
}

export interface IPianoKeyboardProps {
  width: number;
  height: number;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  pressedPitches: Array<Pitch>;
  onKeyPress?: (keyPitch: Pitch) => void;
}
export class PianoKeyboard extends React.Component<IPianoKeyboardProps, {}> {
  public render(): JSX.Element {
    const metrics = this.getMetrics();

    const whiteKeys = new Array<JSX.Element>();
    const blackKeys = new Array<JSX.Element>();
    const whiteKeyHighlights = new Array<JSX.Element>();
    const blackKeyHighlights = new Array<JSX.Element>();
    
    for (let i = 0; i < metrics.keyCount; i++) {
      const midiNumber = metrics.lowestPitch.midiNumber + i;
      const pitch = Pitch.createFromMidiNumber(midiNumber);
      
      const isPressed = this.props.pressedPitches.some(pp => pp.equals(pitch));
      const highlightRect = Rect.growAroundCenter(metrics.getKeyRect(pitch), - 6);

      if (pitch.isWhiteKey) {
        whiteKeys.push(<rect
          key={i}
          x={metrics.keyLeftXs[i]} y={0}
          width={metrics.whiteKeyWidth} height={metrics.whiteKeyHeight}
          fill="white" stroke="black" strokeWidth="2" className="cursor-pointer-on-hover"
          onClick={event => this.props.onKeyPress ? this.props.onKeyPress(pitch) : null}
        />);

        if (isPressed) {
          whiteKeyHighlights.push(<rect
            key={pitch.toString(true)}
            x={highlightRect.leftX} y={highlightRect.topY}
            width={highlightRect.width} height={highlightRect.height}
            fill="red" strokeWidth="0" className="cursor-pointer-on-hover"
            onClick={event => this.props.onKeyPress ? this.props.onKeyPress(pitch) : null}
          />);
        }
      } else {
        blackKeys.push(<rect
          key={i}
          x={metrics.keyLeftXs[i]} y={0}
          width={metrics.blackKeyWidth} height={metrics.blackKeyHeight}
          fill="black" strokeWidth="0" className="cursor-pointer-on-hover"
          onClick={event => this.props.onKeyPress ? this.props.onKeyPress(pitch) : null}
        />);
        
        if (isPressed) {
          blackKeyHighlights.push(<rect
            key={pitch.toString(true)}
            x={highlightRect.leftX} y={highlightRect.topY}
            width={highlightRect.width} height={highlightRect.height}
            fill="red" strokeWidth="0" className="cursor-pointer-on-hover"
            onClick={event => this.props.onKeyPress ? this.props.onKeyPress(pitch) : null}
          />);
        }
      }
    }

    return (
      <svg width={this.props.width} height={this.props.height} version="1.1" xmlns="http://www.w3.org/2000/svg">
        {whiteKeys}
        {whiteKeyHighlights}
        {blackKeys}
        {blackKeyHighlights}
      </svg>
    );
  }


  private getMetrics(): PianoKeyboardMetrics {
    return new PianoKeyboardMetrics(
      this.props.width, this.props.height,
      this.props.lowestPitch, this.props.highestPitch
    );
  }
}