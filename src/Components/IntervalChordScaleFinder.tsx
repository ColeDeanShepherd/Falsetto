import * as React from "react";

import * as Utils from "../Utils";
import { Vector2D } from '../Vector2D';
import { Size2D } from "../Size2D";
import { Rect2D } from '../Rect2D';
import { PitchLetter } from "../PitchLetter";
import { Pitch } from "../Pitch";
import { Card, CardContent, Typography } from "@material-ui/core";
import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics, renderPressedPianoKeys } from "./PianoKeyboard";
import { Interval } from '../Interval';
import {  ChordType } from '../Chord';
import { ScaleType, getAllModePitchIntegers } from '../Scale';

// TODO: refactor Chord, Scale
// TODO: add support for multiple chord names
export function findIntervalsChordsScales(pitches: Array<Pitch>): {
  intervals: Array<Interval>,
  chords: Array<[ChordType, Pitch]>,
  scales: Array<[ScaleType, Pitch]>
} {
  return {
    intervals: findIntervals(pitches),
    chords: findChords(pitches),
    scales: findScales(pitches)
  };
}
export function findIntervals(pitches: Array<Pitch>): Array<Interval> {
  return (pitches.length === 2)
  ? [Pitch.getInterval(pitches[0], pitches[1])]
  : new Array<Interval>();
}
export function findChords(pitches: Array<Pitch>): Array<[ChordType, Pitch]> {
  if (pitches.length === 0) { return new Array<[ChordType, Pitch]>(); }

  const sortedPitches = pitches
    .slice()
    .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
  const basePitchIntegers = sortedPitches
    .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
  const allPitchIntegers = getAllModePitchIntegers(basePitchIntegers);
  const chordTypes = allPitchIntegers
    .map((pis, i): [ChordType | undefined, Pitch] => [
      ChordType.All.find(ct => Utils.areArraysEqual(ct.pitchIntegers, pis)),
      pitches[i]
    ])
    .filter(t => t[0])
    .map((t): [ChordType, Pitch] => [Utils.unwrapValueOrUndefined(t[0]), t[1]]);

  return chordTypes
    ? chordTypes
    : new Array<[ChordType, Pitch]>();
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
      ScaleType.All.find(ct => Utils.areArraysEqual(ct.pitchIntegers, pis)),
      pitches[i]
    ])
    .filter(t => t[0])
    .map((t): [ScaleType, Pitch] => [Utils.unwrapValueOrUndefined(t[0]), t[1]]);

  return scaleTypes
    ? scaleTypes
    : new Array<[ScaleType, Pitch]>();
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

  public render(): JSX.Element {
    const pianoStyle = { width: "100%", maxWidth: "400px", height: "auto" };
    const pianoSize = new Size2D(200, 100);
    
    const pressedPitchesStr = this.state.pressedPitches
      .map(p => p.toOneAccidentalAmbiguousString(false))
      .join(', ');

    const onKeyPress = (pitch: Pitch) => {
      const newPressedPitches = Utils.toggleArrayElementCustomEquals(
        this.state.pressedPitches, pitch, (a, b) => a.midiNumberNoOctave === b.midiNumberNoOctave
      );
      newPressedPitches.sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
      this.setState({ pressedPitches: newPressedPitches });
    };

    const intervalsChordsScales = findIntervalsChordsScales(this.state.pressedPitches);

    // TODO: remove
    const sortedPitches = this.state.pressedPitches
      .slice()
      .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
    const basePitchIntegers = sortedPitches
      .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
    
    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Interval/Chord/Scale Finder
            </Typography>
          </div>
        
          <div>
            <div>
              <p>{basePitchIntegers.join(', ')}</p>
              <p><span style={{ fontWeight: "bold" }}>Notes: </span>{pressedPitchesStr}</p>
              <p>
                <span style={{ fontWeight: "bold" }}>Interval: </span>
                {(intervalsChordsScales.intervals.length > 0)
                  ? intervalsChordsScales.intervals.map(i => i.toString()).join(', ')
                  : null}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Chords: </span>
                {(intervalsChordsScales.chords.length > 0)
                  ? intervalsChordsScales.chords.map(c => c[1].toOneAccidentalAmbiguousString(false) + " " + c[0].name).join(', ')
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
              <PianoKeyboard
                rect={new Rect2D(pianoSize, new Vector2D(0, 0))}
                lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                highestPitch={new Pitch(PitchLetter.B, 0, 4)}
                onKeyPress={onKeyPress}
                renderLayeredExtrasFn={metrics => this.renderExtras(metrics)}
                style={pianoStyle}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  public renderExtras(metrics: PianoKeyboardMetrics): { whiteKeyLayerExtras: JSX.Element, blackKeyLayerExtras: JSX.Element } {
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
}