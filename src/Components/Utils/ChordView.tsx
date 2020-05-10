import * as React from "react";

import { Vector2D } from '../../lib/Core/Vector2D';
import { Size2D } from "../../lib/Core/Size2D";
import { Rect2D } from '../../lib/Core/Rect2D';
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Button } from "@material-ui/core";
import { Chord } from "../../lib/TheoryLib/Chord";
import { PianoKeyboard, PianoKeyboardMetrics, renderPianoKeyboardNoteNames, renderPianoKeyboardKeyLabels } from "../Utils/PianoKeyboard";
import { playPitches } from '../../Audio/PianoAudio';
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { getPianoKeyboardAspectRatio } from '../Utils/PianoUtils';
import { Scale } from "../../lib/TheoryLib/Scale";
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);
const pianoOctaveCount = 2;
const pianoAspectRatio = getPianoKeyboardAspectRatio(pianoOctaveCount);

function getPitchesInRange(lowestPitch: Pitch, highestPitch: Pitch, pitchesNoOctaveNumber: Array<Pitch>): Array<Pitch> {
  const pitchMidiNumberNoOctaves = pitchesNoOctaveNumber.map(p => p.midiNumberNoOctave);

  const lowestPitchMidiNumber = lowestPitch.midiNumber;
  const highestPitchMidiNumber = highestPitch.midiNumber;

  let result = new Array<Pitch>();

  for (let midiNumber = lowestPitchMidiNumber; midiNumber <= highestPitchMidiNumber; midiNumber++) {
    const pitch = Pitch.createFromMidiNumber(midiNumber);

    const pitchIndex = pitchMidiNumberNoOctaves.indexOf(pitch.midiNumberNoOctave);
    if (pitchIndex < 0) { continue; }
    
    result.push(pitch);
  }

  return result;
}

export interface IChordViewProps {
  chord: Chord;
  showChordInfoText?: boolean;
  showPianoKeyboard?: boolean;
  showChordFormulaOnPiano?: boolean;
  scale?: Scale;
  showScaleDegreesOnPiano?: boolean;
  maxWidth?: number;
}

export class ChordView extends React.Component<IChordViewProps, {}> {
  public componentWillUpdate() {
    if (this.playAudioCancelFn) {
      this.playAudioCancelFn();
      this.playAudioCancelFn = null;
    }
  }

  public render(): JSX.Element {
    const { chord } = this.props;
    
    const pitches = chord.getPitches();

    const renderPitchesText = () => {
      const pitchStrings = pitches
        .map(pitch => pitch.toString(false));
      const pitchesString = pitchStrings.join(", ");

      return <p>Pitches: {pitchesString}</p>;
    };

    const renderScaleDegreesText = () => {
      return <p>Major Scale Degrees: {chord.type.formula.toString()}</p>;
    };

    const renderIntervalsText = () => {
      const intervals = chord.type.getIntervals();
      const intervalStrings = intervals
        .map((interval, i) => (i === 0) ? "R" : interval.toString());
      const intervalsString = intervalStrings.join(", ");

      return <p>Intervals: {intervalsString}</p>;
    };
    
    const onKeyPress = (pitch: Pitch) => {
      const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

      if (arrayContains(pitchMidiNumberNoOctaves, pitch.midiNumberNoOctave)) {
        playPitches([pitch]);
      }
    };

    const maxWidth = (this.props.maxWidth !== undefined) ? this.props.maxWidth : 400;
    const pianoStyle = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };
    
    const showChordInfoText = (this.props.showChordInfoText !== undefined)
      ? this.props.showChordInfoText
      : true;
    
    const renderChordInfoText = () => {
      return (
        <div style={{fontSize: "1.5em"}}>
          <p>{chord.rootPitch.toString(false)} {chord.type.name}</p>
          {renderPitchesText()}
          {renderScaleDegreesText()}
          {renderIntervalsText()}
        </div>
      );
    };

    const showPianoKeyboard = (this.props.showPianoKeyboard !== undefined)
      ? this.props.showPianoKeyboard
      : true;

    const renderPianoKeyboard = () => {
      return (
        <div>
          <PianoKeyboard
            rect={new Rect2D(new Size2D(pianoAspectRatio * 100, 100), new Vector2D(0, 0))}
            lowestPitch={pianoLowestPitch}
            highestPitch={pianoHighestPitch}
            onKeyPress={onKeyPress}
            renderExtrasFn={metrics => this.renderPianoExtrasFn(metrics, pitches)}
            style={pianoStyle}
          />
        </div>
      );
    };

    const containerContents = (
      <div>
        <div style={{textAlign: "center"}}>
          {showChordInfoText ? renderChordInfoText() : null}
          
          <div>
            <p>
              <Button
                onClick={event => this.onListenClick()}
                variant="contained"
              >
                Listen
              </Button>
            </p>
          </div>

          {showPianoKeyboard ? renderPianoKeyboard() : null}
        </div>
      </div>
    );
    
    return containerContents;
  }
  
  private renderPianoExtrasFn(metrics: PianoKeyboardMetrics, pitches: Array<Pitch>): JSX.Element {
    const { chord } = this.props;

    const showChordFormulaOnPiano = (this.props.showChordFormulaOnPiano !== undefined)
      ? this.props.showChordFormulaOnPiano
      : false;
      
    const showScaleDegreesOnPiano = ((this.props.showScaleDegreesOnPiano !== undefined) && (this.props.scale !== undefined))
      ? this.props.showScaleDegreesOnPiano
      : false;

    const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);
    
    return renderPianoKeyboardKeyLabels(
      metrics,
      /*useSharps*/ false, // TODO: remove
      pitch => {
        const visualPitchIndex = pitchMidiNumberNoOctaves.indexOf(pitch.midiNumberNoOctave);
        if (visualPitchIndex < 0) { return null; }

        const visualPitch = pitches[visualPitchIndex];
        
        const includeOctaveNumber = false;
        const useSymbols = true;
        const visualPitchString = visualPitch.toString(includeOctaveNumber, useSymbols);

        
          
        let labels = new Array<string>();

        if (showChordFormulaOnPiano) {
          labels.push(chord.type.formula.parts[visualPitchIndex].toString(/*useSymbols*/ true));
        }

        if (showScaleDegreesOnPiano) {
          const { scale } = this.props;
          const scalePitches = unwrapValueOrUndefined(scale).getPitches();
          const scaleDegreeIndex = scalePitches.findIndex(sp => sp.midiNumberNoOctave == pitch.midiNumberNoOctave);

          if (scaleDegreeIndex >= 0) {
            const scaleDegreeNumber = 1 + scaleDegreeIndex;
            labels.push(scaleDegreeNumber.toString());
          }
        }

        labels.push(visualPitchString);
        
        return labels;
    });
  }

  private playAudioCancelFn: (() => void) | null = null;

  private onListenClick() {
    const { chord } = this.props;

    if (this.playAudioCancelFn) {
      this.playAudioCancelFn();
      this.playAudioCancelFn = null;
    }

    const pitches = chord.getPitches();
    const allChordPitches = getPitchesInRange(pianoLowestPitch, pianoHighestPitch, pitches);
    this.playAudioCancelFn = playPitches(allChordPitches)[1];
  }
}
