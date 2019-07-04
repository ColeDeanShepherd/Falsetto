import * as React from "react";

import * as Utils from "../Utils";
import { Vector2D } from '../Vector2D';
import { Size2D } from "../Size2D";
import { Rect2D } from '../Rect2D';
import { PitchLetter } from "../PitchLetter";
import { Pitch } from "../Pitch";
import { Card, CardContent, Typography } from "@material-ui/core";
import { PianoKeyboard, renderPianoKeyboardNoteNames } from "./PianoKeyboard";
import { Interval } from '../Interval';
import {  ChordType } from '../Chord';
import { ScaleType, getModePitchIntegers, getAllModePitchIntegers } from '../Scale';

// TODO: show root notes for chords & scales...
export function findIntervalsChordsScales(pitches: Array<Pitch>): {
  intervals: Array<Interval>,
  chords: Array<ChordType>,
  scales: Array<ScaleType>
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
export function findChords(pitches: Array<Pitch>): Array<ChordType> {
  if (pitches.length === 0) { return new Array<ChordType>(); }

  const sortedPitches = pitches
    .slice()
    .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
  const basePitchIntegers = sortedPitches
    .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
  const allPitchIntegers = getAllModePitchIntegers(basePitchIntegers);
  const chordTypes = allPitchIntegers
    .map(pi => ChordType.All
      .find(ct => Utils.areArraysEqual(ct.pitchIntegers, pi))
    )
    .filter(ct => ct)
    .map(ct => Utils.unwrapValueOrUndefined(ct));

  return chordTypes
    ? chordTypes
    : new Array<ChordType>();
}
export function findScales(pitches: Array<Pitch>): Array<ScaleType> {
  if (pitches.length === 0) { return new Array<ScaleType>(); }

  const sortedPitches = pitches
    .slice()
    .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
  const basePitchIntegers = sortedPitches
    .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
  const allPitchIntegers = getAllModePitchIntegers(basePitchIntegers);
  const scaleTypes = allPitchIntegers
    .map(pi => ScaleType.All
      .find(ct => Utils.areArraysEqual(ct.pitchIntegers, pi))
    )
    .filter(ct => ct)
    .map(ct => Utils.unwrapValueOrUndefined(ct));

  return scaleTypes
    ? scaleTypes
    : new Array<ScaleType>();
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
    
    // TODO: render key names
    // TODO: render pressed pitches on piano
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
    
    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Interval/Chord/Scale Finder
            </Typography>
          </div>
        
          <div style={{textAlign: "center"}}>
            <div style={{fontSize: "1.5em"}}>
              <p>{pressedPitchesStr}</p>
              {(intervalsChordsScales.intervals.length > 0)
                ? <p>Interval: {intervalsChordsScales.intervals.map(i => i.toString()).join(', ')}</p>
                : null}
              {(intervalsChordsScales.chords.length > 0)
                ? <p>Chords: {intervalsChordsScales.chords.map(c => c.name).join(', ')}</p>
                : null}
              {(intervalsChordsScales.scales.length > 0)
                ? <p>Scales: {intervalsChordsScales.scales.map(s => s.name).join(', ')}</p>
                : null}
            </div>

            <div>
              <PianoKeyboard
                rect={new Rect2D(pianoSize, new Vector2D(0, 0))}
                lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                highestPitch={new Pitch(PitchLetter.B, 0, 4)}
                onKeyPress={onKeyPress}
                renderExtrasFn={metrics => renderPianoKeyboardNoteNames(metrics)}
                style={pianoStyle}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}