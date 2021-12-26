import * as React from "react";

import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Chord } from "../../lib/TheoryLib/Chord";
import { PianoKeyboardMetrics, renderPianoKeyboardKeyLabels } from "../Utils/PianoKeyboard";
import { playPitches } from '../../Audio/PianoAudio';
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { Scale } from "../../lib/TheoryLib/Scale";
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { PlayablePianoKeyboard } from './PlayablePianoKeyboard';
import { Button } from "../../ui/Button/Button";

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);

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
    
    const pitches = chord.getPitchClasses();

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

    const maxWidth = (this.props.maxWidth !== undefined) ? this.props.maxWidth : 400;
    
    const showChordInfoText = (this.props.showChordInfoText !== undefined)
      ? this.props.showChordInfoText
      : true;
    
    const renderChordInfoText = () => {
      return (
        <div style={{fontSize: "1.5em"}}>
          <p>{chord.rootPitchClass.toString(false)} {chord.type.name}</p>
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
          <PlayablePianoKeyboard
            maxWidth={maxWidth}
            lowestPitch={pianoLowestPitch}
            highestPitch={pianoHighestPitch}
            wrapOctave={true}
            canPressKeyFn={p => new Set<number>(pitches.map(p => p.midiNumberNoOctave)).has(p.midiNumberNoOctave)}
            renderExtrasFn={metrics => this.renderPianoExtrasFn(metrics, pitches)}
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
              >
                <span><i className="material-icons" style={{ verticalAlign: "middle" }}>play_arrow</i></span>
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
          const scalePitches = unwrapValueOrUndefined(scale).getPitchClasses();
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

    const pitches = chord.getPitchClasses();
    const allChordPitches = getPitchesInRange(pianoLowestPitch, pianoHighestPitch, pitches);
    this.playAudioCancelFn = playPitches(allChordPitches)[1];
  }
}
