import * as React from "react";
import { Button, Card, CardContent, Typography } from "@material-ui/core";

import { Vector2D } from '../../lib/Core/Vector2D';
import { Size2D } from "../../lib/Core/Size2D";
import { Rect2D } from '../../lib/Core/Rect2D';
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { ScaleType, ScaleTypeGroup, Scale } from "../../lib/TheoryLib/Scale";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { playPitches } from '../../Audio/PianoAudio';
import * as PianoScaleDronePlayer from "../Utils/PianoScaleDronePlayer";
import { getPreferredGuitarScaleShape } from '../Utils/GuitarFretboard';
import { getStandardGuitarTuning } from "../Utils/StringedInstrumentTuning";
import { ScaleAudioPlayer } from '../Utils/ScaleAudioPlayer';
import { GuitarScaleViewer } from '../Utils/GuitarScaleViewer';
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';
import { arrayContains } from '../../lib/Core/ArrayUtils';

// subtract one octave for valid key pitches

interface IScaleViewerProps {
  title?: string;
  scaleTypeGroups?: Array<ScaleTypeGroup>;
  renderAllScaleShapes: boolean;
  playSimultaneously?: boolean;
  showPianoKeyboard?: boolean;
  showGuitarFretboard?: boolean;
  isEmbedded?: boolean;
}
interface IScaleViewerState {
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
    
    const pitches = this.state.scale.type.formula.getPitches(this.state.scale.rootPitch);
    const pitchStrings = pitches
      .map(pitch => pitch.toString(false));
    const pitchesString = pitchStrings.join(", ");

    const intervals = this.state.scale.type.getIntervals();
    const intervalStrings = intervals
      .map((interval, i) => (i === 0) ? "R" : interval.toString());
    const intervalsString = intervalStrings.join(", ");

    const pianoGuitarStyle = { width: "100%", maxWidth: "400px", height: "auto" };

    const pianoSize = new Size2D(400, 100);
    const guitarSize = new Size2D(400, 140);
    
    const onKeyPress = (pitch: Pitch) => {
      const { playSimultaneously } = this.props;
      
      if (this.stopPlayingKeysAudioFn) {
        this.stopPlayingKeysAudioFn();
      }

      if (playSimultaneously) {
        const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

        if (arrayContains(pitchMidiNumberNoOctaves, pitch.midiNumberNoOctave)) {
          this.stopPlayingKeysAudioFn = playPitches([pitch])[1];
        }
      } else {
        this.stopPlayingKeysAudioFn = PianoScaleDronePlayer.onKeyPress(this.state.scale, pitch)
      }
    };
    
    const showPianoKeyboard = (this.props.showPianoKeyboard !== undefined)
      ? this.props.showPianoKeyboard
      : true;
    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;
    
    const baseButtonStyle: any = { textTransform: "none" };

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
            <Typography gutterBottom={true} variant="h6" component="h4">
              Root Pitch
            </Typography>
            <div style={{padding: "1em 0"}}>
              <ValidKeyPitchSelect
                preferredOctaveNumber={4}
                value={[this.state.scale.rootPitch]}
                onChange={rootPitches => this.onRootPitchClick(rootPitches[0])}
              />
            </div>
            
            <Typography gutterBottom={true} variant="h6" component="h4">
              Category
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.scaleTypeGroups.map(scaleTypeGroup => {
                return (
                  <Button
                    key={scaleTypeGroup.name}
                    onClick={event => this.onScaleTypeGroupClick(scaleTypeGroup)}
                    variant="contained"
                    style={baseButtonStyle}
                  >
                    {scaleTypeGroup.name}
                  </Button>
                );
              })}
            </div>

            <Typography gutterBottom={true} variant="h6" component="h4">
              Type
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.state.scaleTypeGroup.scaleTypes.map(scaleType => {
                const buttonStyle: any = { ...baseButtonStyle };
                const isPressed = scaleType.name === this.state.scale.type.name;
                if (isPressed) {
                  buttonStyle.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={scaleType.name}
                    onClick={event => this.onScaleTypeClick(scaleType)}
                    variant="contained"
                    style={buttonStyle}
                  >
                    {scaleType.name}
                  </Button>
                );
            })}
            </div>
            <div style={{fontSize: "1.5em"}}>
              <p>{this.state.scale.rootPitch.toString(false)} {this.state.scale.type.name}</p>
              <p>{pitchesString}</p>
              <p>{this.state.scale.type.formula.toString()}</p>
              <p>{intervalsString}</p>
            </div>

            <div>
              <p>
                <ScaleAudioPlayer scale={this.state.scale} pitchCount={numPitchesToPlay} onGetExports={e => this.stopPlayingScaleAudioFn = e.stopPlayingFn} />
              </p>
            </div>

            <div>
              <div>
                {showPianoKeyboard ? (
                  <PianoKeyboard
                    rect={new Rect2D(pianoSize, new Vector2D(0, 0))}
                    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                    highestPitch={new Pitch(PitchLetter.B, 0, 5)}
                    onKeyPress={onKeyPress}
                    renderExtrasFn={metrics => PianoScaleDronePlayer.renderExtrasFn(metrics, pitches, this.state.scale.rootPitch)}
                    style={pianoGuitarStyle}
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

  private onRootPitchClick(rootPitch: Pitch) {
    const newScale = new Scale(this.state.scale.type, rootPitch);
    this.setState({ scale: newScale }, this.onScaleChange.bind(this));
  }
  private onScaleTypeGroupClick(scaleTypeGroup: ScaleTypeGroup) {
    this.setState({ scaleTypeGroup: scaleTypeGroup }, this.onScaleChange.bind(this));
  }
  private onScaleTypeClick(scaleType: ScaleType) {
    const newScale = new Scale(scaleType, this.state.scale.rootPitch);
    this.setState({ scale: newScale }, this.onScaleChange.bind(this));
  }

  private stopPlayingKeysAudioFn: (() => void) | undefined = undefined;
  private stopPlayingScaleAudioFn: (() => void) | null = null;

  private onScaleChange() {
    if (this.stopPlayingScaleAudioFn) {
      this.stopPlayingScaleAudioFn();
      this.stopPlayingScaleAudioFn = null;
    }
  }
}