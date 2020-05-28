import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import { Size2D } from "../../lib/Core/Size2D";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { ScaleType, ScaleTypeGroup, Scale } from "../../lib/TheoryLib/Scale";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { playPitches, PianoPitchesAudio } from '../../Audio/PianoAudio';
import * as PianoScaleDronePlayer from "../Utils/PianoScaleDronePlayer";
import { getPreferredGuitarScaleShape } from '../Utils/GuitarFretboard';
import { getStandardGuitarTuning } from "../Utils/StringedInstrumentTuning";
import { ScaleAudioPlayer } from '../Utils/ScaleAudioPlayer';
import { GuitarScaleViewer } from '../Utils/GuitarScaleViewer';
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { ScaleSelect } from "../Utils/ScaleSelect";
import { GuitarPitchesAudio } from '../../Audio/GuitarAudio';

const pianoKeyboardLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoKeyboardHighestPitch = new Pitch(PitchLetter.B, 0, 5);

export interface IScaleViewerProps {
  title?: string;
  scaleTypeGroups?: Array<ScaleTypeGroup>;
  renderAllScaleShapes: boolean;
  playSimultaneously?: boolean;
  showPianoKeyboard?: boolean;
  showGuitarFretboard?: boolean;
  isEmbedded?: boolean;
}
export interface IScaleViewerState {
  scaleTypeGroup: ScaleTypeGroup;
  scale: Scale;
}

export class ScaleViewer extends React.Component<IScaleViewerProps, IScaleViewerState> {
  public constructor(props: IScaleViewerProps) {
    super(props);

    this.state = {
      scaleTypeGroup: this.scaleTypeGroups[0],
      scale: new Scale(this.scaleTypeGroups[0].scaleTypes[0], new Pitch(PitchLetter.C, 0, 4))
    };
  }

  public render(): JSX.Element {
    const title = this.props.title
      ? this.props.title
      : "Scale Viewer";
    
    const pitches = this.state.scale.getPitches();
    const pitchStrings = pitches
      .map(pitch => pitch.toString(false));
    const pitchesString = pitchStrings.join(", ");

    const intervals = this.state.scale.type.getIntervals();
    const intervalStrings = intervals
      .map((interval, i) => (i === 0) ? "R" : interval.toString());
    const intervalsString = intervalStrings.join(", ");

    const guitarSize = new Size2D(400, 140);
    
    const onKeyPress = (pitch: Pitch) => {
      const { playSimultaneously } = this.props;
      
      if (this.stopPlayingKeysAudioFn) {
        this.stopPlayingKeysAudioFn();
        this.stopPlayingKeysAudioFn = undefined;
      }

      if (playSimultaneously) {
        const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

        if (arrayContains(pitchMidiNumberNoOctaves, pitch.midiNumberNoOctave)) {
          this.stopPlayingKeysAudioFn = playPitches([pitch])[1];
        }
      } else {
        PianoScaleDronePlayer.onKeyPress(this.state.scale, pitch)
      }
    };
    
    const showPianoKeyboard = (this.props.showPianoKeyboard !== undefined)
      ? this.props.showPianoKeyboard
      : true;
    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;

    const guitarTuning = getStandardGuitarTuning(6);

    const numPitchesToPlay = showPianoKeyboard
      ? pitches.length
      : getPreferredGuitarScaleShape(this.state.scale, guitarTuning).length;

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              {title}
            </Typography>
          </div>
        
          <div style={{textAlign: "center"}}>
            <ScaleSelect
              scaleTypeGroups={this.scaleTypeGroups}
              value={[this.state.scaleTypeGroup, this.state.scale]}
              onChange={newValue => this.onScaleChange(newValue)} />
            
            <div style={{fontSize: "1.5em"}}>
              <p>{this.state.scale.rootPitch.toString(false)} {this.state.scale.type.name}</p>
              <p>{pitchesString}</p>
              <p>{this.state.scale.type.formula.toString()}</p>
              <p>{intervalsString}</p>
            </div>

            <div>
              <p>
                <ScaleAudioPlayer
                  scale={this.state.scale}
                  pitchCount={numPitchesToPlay}
                  pitchesAudio={showPianoKeyboard ? PianoPitchesAudio : GuitarPitchesAudio}
                  onGetExports={e => this.stopPlayingScaleAudioFn = e.stopPlayingFn} />
              </p>
            </div>

            <div>
              <div>
                {showPianoKeyboard ? (
                  <PianoKeyboard
                    maxWidth={400}
                    lowestPitch={pianoKeyboardLowestPitch}
                    highestPitch={pianoKeyboardHighestPitch}
                    onKeyPress={onKeyPress}
                    renderExtrasFn={metrics => PianoScaleDronePlayer.renderExtrasFn(metrics, pitches, this.state.scale.rootPitch)}
                  />
                ) : null}
              </div>

              <div style={{marginTop: "1em"}}>
                {showGuitarFretboard ? (
                  <GuitarScaleViewer
                    scale={this.state.scale}
                    size={guitarSize}
                    tuning={guitarTuning}
                    renderAllScaleShapes={this.props.renderAllScaleShapes} />
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  private get scaleTypeGroups(): Array<ScaleTypeGroup> {
    return this.props.scaleTypeGroups
      ? this.props.scaleTypeGroups
      : ScaleType.Groups;
  }

  private onScaleChange(newValue: [ScaleTypeGroup, Scale]) {
    const [ newScaleTypeGroup, newScale ] = newValue;
    this.setState({ scaleTypeGroup: newScaleTypeGroup, scale: newScale }, this.postScaleChange.bind(this));
  }

  private stopPlayingKeysAudioFn: (() => void) | undefined = undefined;
  private stopPlayingScaleAudioFn: (() => void) | null = null;

  private postScaleChange() {
    if (this.stopPlayingScaleAudioFn) {
      this.stopPlayingScaleAudioFn();
      this.stopPlayingScaleAudioFn = null;
    }
  }
}