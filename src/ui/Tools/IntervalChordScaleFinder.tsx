import * as React from "react";

import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch, keyToPitch } from "../../lib/TheoryLib/Pitch";
import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics, renderPressedPianoKeys } from "../Utils/PianoKeyboard";
import { Interval } from '../../lib/TheoryLib/Interval';
import { playPitches } from '../../Audio/PianoAudio';
import { StringDictionary } from '../../lib/Core/StringDictionary';
import { uniqWithSelector, immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray } from '../../lib/Core/ArrayUtils';
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { findIntervalsChordsScales } from "../../lib/TheoryLib/Analysis";

interface IIntervalChordScaleFinderProps {}
interface IIntervalChordScaleFinderState {
  pressedPitches: Array<Pitch>;
}

export class IntervalChordScaleFinder extends React.Component<IIntervalChordScaleFinderProps, IIntervalChordScaleFinderState> {
  public constructor(props: IIntervalChordScaleFinderProps) {
    super(props);

    this.state = {
      pressedPitches: []
    };
  }

  public componentDidMount() {
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    window.addEventListener("keydown", this.boundOnKeyDown);
    
    this.boundOnKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keyup", this.boundOnKeyUp);
  }
  public componentWillUnmount() {
    if (this.boundOnKeyDown) {
      window.removeEventListener("keydown", this.boundOnKeyDown);
      this.boundOnKeyDown = undefined;
    }

    if (this.boundOnKeyUp) {
      window.removeEventListener("keyup", this.boundOnKeyUp);
      this.boundOnKeyUp = undefined;
    }
  }

  public render(): JSX.Element {
    const uniquePressedPitches = uniqWithSelector(this.state.pressedPitches, p => p.midiNumberNoOctave);
    uniquePressedPitches.sort((a, b) => (a.midiNumber < b.midiNumber) ? -1 : 1);
    const intervalsChordsScales = findIntervalsChordsScales(uniquePressedPitches);

    const pressedPitchesStr = uniquePressedPitches
      .map(p => p.toOneAccidentalAmbiguousString(false))
      .join(', ');
    
    const onPianoKeyPress = this.toggleIsPianoKeyPressed.bind(this);
    
    return (
      <Card>
        <div style={{display: "flex"}}>
          <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
            Interval/Chord/Scale Finder
          </h2>
        </div>
      
        <div>
          <div>
            <p><span style={{ fontWeight: "bold" }}>Notes: </span>{pressedPitchesStr}</p>
            <p>
              <span style={{ fontWeight: "bold" }}>Interval: </span>
              {this.getIntervalsString(intervalsChordsScales.intervals)}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Chords: </span>
              {(intervalsChordsScales.chords.length > 0)
                //? intervalsChordsScales.chords.map(c => c.rootPitch.toOneAccidentalAmbiguousString(false) + " " + c.chordType.name).join(', ')
                ? intervalsChordsScales.chords.map(c => c.getSymbol(true)).join(', ')
                : null}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Scales: </span>
              {(intervalsChordsScales.scales.length > 0)
                ? intervalsChordsScales.scales.map(s => s[1].toOneAccidentalAmbiguousString(false) + " " + s[0].name).join(', ')
                : null}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p>
              <PianoKeyboard
                maxWidth={400}
                lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                highestPitch={new Pitch(PitchLetter.B, 0, 5)}
                onKeyPress={onPianoKeyPress}
                renderLayeredExtrasFn={metrics => this.renderExtras(metrics)}
              />
            </p>

            <p>
              <Button
                onClick={event => this.reset()}
                style={{ textTransform: "none" }}
              >
                Reset
              </Button>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  private boundOnKeyDown: ((event: KeyboardEvent) => void) | undefined;
  private boundOnKeyUp: ((event: KeyboardEvent) => void) | undefined;
  private pitchCancellationFns: StringDictionary<() => void> = {};

  private renderExtras(metrics: PianoKeyboardMetrics): { whiteKeyLayerExtras: JSX.Element, blackKeyLayerExtras: JSX.Element } {
    const whitePressedPitches = this.state.pressedPitches
      .filter(p => p.isWhiteKey);
    const whiteKeyLayerExtras = (
      <g>
        {renderPressedPianoKeys(metrics, whitePressedPitches)}
      </g>
    );
    const blackPressedPitches = this.state.pressedPitches
      .filter(p => p.isBlackKey);
    const blackKeyLayerExtras = (
      <g>
        {renderPressedPianoKeys(metrics, blackPressedPitches)}
        {renderPianoKeyboardNoteNames(metrics)}
      </g>
    );

    return {
      whiteKeyLayerExtras: whiteKeyLayerExtras,
      blackKeyLayerExtras: blackKeyLayerExtras
    };
  }
  private getIntervalsString(intervals: Array<Interval>) {
    switch (intervals.length) {
      case 1:
        return intervals[0].toString();
      case 2:
        return `${intervals[0].toString()} (inverted: ${intervals[1].toString()})`;
      default:
        return "";
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.repeat) { return; }

    const pitch = keyToPitch(event.key)
    if (pitch === null) { return; }

    this.setIsPianoKeyPressed(pitch, true);
  }
  private onKeyUp(event: KeyboardEvent) {
    const pitch = keyToPitch(event.key)
    if (pitch === null) { return; }

    this.setIsPianoKeyPressed(pitch, false);
  }
  private setIsPianoKeyPressed(pitch: Pitch, value: boolean) {
    const cancellationFnKey = pitch.midiNumber.toString();
    if (value) {
      const cancellationFn = playPitches([pitch])[1];
      this.pitchCancellationFns[cancellationFnKey] = cancellationFn;

      this.setState({
        pressedPitches: immutableAddIfNotFoundInArray(this.state.pressedPitches, pitch, p => p.equals(pitch))
      });
    } else {
      const cancellationFn = this.pitchCancellationFns[cancellationFnKey];
      if (cancellationFn) {
        cancellationFn();
        delete this.pitchCancellationFns[cancellationFnKey];
      }

      this.setState({
        pressedPitches: immutableRemoveIfFoundInArray(this.state.pressedPitches, p => p.equals(pitch))
      });
    }
  }
  private toggleIsPianoKeyPressed(pitch: Pitch) {
    const isPressed = this.state.pressedPitches.find(p => p.midiNumber === pitch.midiNumber) !== undefined;
    this.setIsPianoKeyPressed(pitch, !isPressed);
  }
  private reset() {
    this.setState({ pressedPitches: [] });
  }
}