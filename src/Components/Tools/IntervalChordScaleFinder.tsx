import * as React from "react";

import * as Utils from "../../lib/Core/Utils";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Typography } from "@material-ui/core";
import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics, renderPressedPianoKeys } from "../Utils/PianoKeyboard";
import { Interval } from '../../lib/TheoryLib/Interval';
import { Chord } from '../../lib/TheoryLib/Chord';
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { ScaleType, getAllModePitchIntegers } from '../../lib/TheoryLib/Scale';
import { generateChordNames } from '../../lib/TheoryLib/ChordName';
import { ChordScaleFormula } from '../../lib/TheoryLib/ChordScaleFormula';
import { playPitches } from '../../Audio/PianoAudio';
import { StringDictionary } from '../../lib/Core/StringDictionary';
import { areArraysEqual, uniqWithSelector, immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray } from '../../lib/Core/ArrayUtils';
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";

// TODO: refactor Chord, Scale
// TODO: add support for multiple chord names
export function findIntervalsChordsScales(pitches: Array<Pitch>): {
  intervals: Array<Interval>,
  chords: Array<Chord>,
  scales: Array<[ScaleType, Pitch]>
} {
  return {
    intervals: findIntervals(pitches),
    chords: findChords(pitches),
    scales: findScales(pitches)
  };
}
export function findIntervals(pitches: Array<Pitch>): Array<Interval> {
  if (pitches.length !== 2) { return new Array<Interval>(); }

  const halfSteps = Math.max(pitches[0].midiNumber, pitches[1].midiNumber)
    - Math.min(pitches[0].midiNumber, pitches[1].midiNumber);
  let intervals = [Interval.fromHalfSteps(halfSteps)];

  const invertedInterval = intervals[0].invertedSimple;
  if (!invertedInterval.equals(intervals[0])) {
    intervals.push(invertedInterval);
  }

  return intervals;
}
export function findChords(pitches: Array<Pitch>): Array<Chord> {
  if (pitches.length === 0) { return new Array<Chord>(); }

  // TODO: initialize chord IDs
  const chords = generateChordNames(pitches)
    .map(cn => new Chord(new ChordType("", cn[1], new ChordScaleFormula([]), [cn[1]]), cn[0]));

  return chords
    ? chords
    : new Array<Chord>();
}
export function findScales(pitches: Array<Pitch>): Array<[ScaleType, Pitch]> {
  if (pitches.length === 0) { return new Array<[ScaleType, Pitch]>(); }

  const sortedPitches = pitches
    .slice()
    .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
  const basePitchIntegers = sortedPitches
    .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
  const allPitchIntegers = getAllModePitchIntegers(basePitchIntegers);
  const scaleTypes = allPitchIntegers
    .map((pis, i): [ScaleType | undefined, Pitch] => [
      ScaleType.All.find(ct => areArraysEqual(ct.pitchIntegers, pis)),
      pitches[i]
    ])
    .filter(t => t[0])
    .map((t): [ScaleType, Pitch] => [Utils.unwrapValueOrUndefined(t[0]), t[1]]);

  return scaleTypes
    ? scaleTypes
    : new Array<[ScaleType, Pitch]>();
}

export function keyToPitch(keyString: string): Pitch | null {
  switch (keyString) {
    // bottom rows
    case "z":
      return new Pitch(PitchLetter.C, 0, 4);
    case "s":
      return new Pitch(PitchLetter.D, -1, 4);
    case "x":
      return new Pitch(PitchLetter.D, 0, 4);
    case "d":
      return new Pitch(PitchLetter.E, -1, 4);
    case "c":
      return new Pitch(PitchLetter.E, 0, 4);
    case "v":
      return new Pitch(PitchLetter.F, 0, 4);
    case "g":
      return new Pitch(PitchLetter.G, -1, 4);
    case "b":
      return new Pitch(PitchLetter.G, 0, 4);
    case "h":
      return new Pitch(PitchLetter.A, -1, 4);
    case "n":
      return new Pitch(PitchLetter.A, 0, 4);
    case "j":
      return new Pitch(PitchLetter.B, -1, 4);
    case "m":
      return new Pitch(PitchLetter.B, 0, 4);
    case ",":
      return new Pitch(PitchLetter.C, 0, 5);
    case "l":
      return new Pitch(PitchLetter.D, -1, 5);
    case ".":
      return new Pitch(PitchLetter.D, 0, 5);
    case ";":
      return new Pitch(PitchLetter.E, -1, 5);
    case "/":
      return new Pitch(PitchLetter.E, 0, 5);

    // top rows
    case "q":
      return new Pitch(PitchLetter.C, 0, 5);
    case "2":
      return new Pitch(PitchLetter.D, -1, 5);
    case "w":
      return new Pitch(PitchLetter.D, 0, 5);
    case "3":
      return new Pitch(PitchLetter.E, -1, 5);
    case "e":
      return new Pitch(PitchLetter.E, 0, 5);
    case "r":
      return new Pitch(PitchLetter.F, 0, 5);
    case "5":
      return new Pitch(PitchLetter.G, -1, 5);
    case "t":
      return new Pitch(PitchLetter.G, 0, 5);
    case "6":
      return new Pitch(PitchLetter.A, -1, 5);
    case "y":
      return new Pitch(PitchLetter.A, 0, 5);
    case "7":
      return new Pitch(PitchLetter.B, -1, 5);
    case "u":
      return new Pitch(PitchLetter.B, 0, 5);
    case "i":
      return new Pitch(PitchLetter.C, 0, 6);
    case "9":
      return new Pitch(PitchLetter.C, 1, 6);
    case "o":
      return new Pitch(PitchLetter.D, 0, 6);
    case "0":
      return new Pitch(PitchLetter.D, 1, 6);
    case "p":
      return new Pitch(PitchLetter.E, 0, 6);
    case "[":
      return new Pitch(PitchLetter.F, 0, 6);
    case "=":
      return new Pitch(PitchLetter.F, 1, 6);
    case "]":
      return new Pitch(PitchLetter.G, 0, 6);
    
    default:
      return null;
  }
}

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
          <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
            Interval/Chord/Scale Finder
          </Typography>
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