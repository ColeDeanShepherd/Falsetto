import * as React from "react";

import * as Utils from "../Utils";
import { Vector2D } from '../Vector2D';
import { Size2D } from "../Size2D";
import { Rect2D } from '../Rect2D';
import { PitchLetter } from "../PitchLetter";
import { ScaleType } from "../Scale";
import { Pitch } from "../Pitch";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Chord } from "../Chord";
import { PianoKeyboard } from "./PianoKeyboard";
import { GuitarFretboard, renderGuitarFretboardScaleExtras } from "./GuitarFretboard";
import { playPitchesSequentially, playPitches } from '../Piano';
import * as PianoScaleDronePlayer from "./PianoScaleDronePlayer";
import { GuitarScaleViewer } from './Quizzes/GuitarScales';

const validSharpKeyPitches = [
  null,
  null,
  new Pitch(PitchLetter.C, 1, 4),
  null,
  null,
  new Pitch(PitchLetter.F, 1, 4),
  null
];
const validNaturalKeyPitches = [
  new Pitch(PitchLetter.A, 0, 4),
  new Pitch(PitchLetter.B, 0, 4),
  new Pitch(PitchLetter.C, 0, 4),
  new Pitch(PitchLetter.D, 0, 4),
  new Pitch(PitchLetter.E, 0, 4),
  new Pitch(PitchLetter.F, 0, 4),
  new Pitch(PitchLetter.G, 0, 4)
];
const validFlatKeyPitches = [
  new Pitch(PitchLetter.A, -1, 4),
  new Pitch(PitchLetter.B, -1, 4),
  new Pitch(PitchLetter.C, -1, 5),
  new Pitch(PitchLetter.D, -1, 4),
  new Pitch(PitchLetter.E, -1, 4),
  null,
  new Pitch(PitchLetter.G, -1, 4)
];

interface IScaleViewerProps {
  title?: string;
  scales?: Array<ScaleType>;
  renderAllScaleShapes: boolean;
  playSimultaneously?: boolean;
  showGuitarFretboard?: boolean;
  isEmbedded?: boolean;
}
interface IScaleViewerState {
  rootPitch: Pitch;
  scale: ScaleType;
}

export class ScaleViewer extends React.Component<IScaleViewerProps, IScaleViewerState> {
  public constructor(props: IScaleViewerProps) {
    super(props);

    this.state = {
      rootPitch: new Pitch(PitchLetter.C, 0, 4),
      scale: this.scales[0]
    };
  }

  public render(): JSX.Element {
    const title = this.props.title
      ? this.props.title
      : "Scale Viewer";
      
    const pitches = Chord.fromPitchAndFormulaString(
      this.state.rootPitch,
      this.state.scale.formulaString
    )
      .pitches;
    const pitchStrings = pitches
      .map(pitch => pitch.toString(false));
    const pitchesString = pitchStrings.join(", ");

    const intervals = this.state.scale.getIntervals();
    const intervalStrings = intervals
      .map((interval, i) => (i === 0) ? "R" : interval.toString());
    const intervalsString = intervalStrings.join(", ");

    const pianoGuitarStyle = { width: "100%", maxWidth: "400px", height: "auto" };

    const pianoSize = new Size2D(400, 100);
    const guitarSize = new Size2D(400, 140);
    
    const onKeyPress = this.props.playSimultaneously
      ? ((pitch: Pitch) => {
        const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

        if (Utils.arrayContains(pitchMidiNumberNoOctaves, pitch.midiNumberNoOctave)) {
          playPitches([pitch]);
        }
      })
      : (pitch: Pitch) => PianoScaleDronePlayer.onKeyPress(this.state.scale, this.state.rootPitch, pitch);
    
    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;

    const guitarRootPitch = new Pitch(
      this.state.rootPitch.letter,
      this.state.rootPitch.signedAccidental,
      this.state.rootPitch.octaveNumber - 2
    );

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
              {this.renderRootPitchRow(validSharpKeyPitches)}
              {this.renderRootPitchRow(validNaturalKeyPitches)}
              {this.renderRootPitchRow(validFlatKeyPitches)}
            </div>
            
            <Typography gutterBottom={true} variant="h6" component="h4">
              Type
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.scales.map(scale => {
                const style: any = { textTransform: "none" };
                
                const isPressed = scale.type === this.state.scale.type;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={scale.type}
                    onClick={event => this.onScaleClick(scale)}
                    variant="contained"
                    style={style}
                  >
                    {scale.type}
                  </Button>
                );
              })}
            </div>
            <div style={{fontSize: "1.5em"}}>
              <p>{this.state.rootPitch.toString(false)} {this.state.scale.type}</p>
              <p>{pitchesString}</p>
              <p>{this.state.scale.formulaString}</p>
              <p>{intervalsString}</p>
            </div>

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

            <div>
              <div>
                <PianoKeyboard
                  rect={new Rect2D(pianoSize, new Vector2D(0, 0))}
                  lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                  highestPitch={new Pitch(PitchLetter.B, 0, 5)}
                  onKeyPress={onKeyPress}
                  renderExtrasFn={metrics => PianoScaleDronePlayer.renderExtrasFn(metrics, pitches, this.state.rootPitch)}
                  style={pianoGuitarStyle}
                />
              </div>

              <div style={{marginTop: "1em"}}>
                {(showGuitarFretboard && false) ? (
                  <GuitarScaleViewer
                    scaleType={this.state.scale}
                    rootPitch={guitarRootPitch}
                    size={guitarSize}
                    renderAllScaleShapes={this.props.renderAllScaleShapes} />
                ) : null}
                <p>Guitar scales coming soon!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  private get scales(): Array<ScaleType> {
    return this.props.scales
      ? this.props.scales
      : ScaleType.All;
  }
  private renderRootPitchRow(rootPitches: Array<Pitch | null>): JSX.Element {
    return (
      <div>
        {rootPitches.map(pitch => {
          const style: any = { textTransform: "none" };
          
          const isPressed = pitch && (pitch.equals(this.state.rootPitch));
          if (isPressed) {
            style.backgroundColor = "#959595";
          }

          return (
            pitch
              ? (
                <Button
                  onClick={event => this.onRootPitchClick(pitch)}
                  variant="contained"
                  style={style}
                >
                  {pitch.toString(false)}
                </Button>
              )
              : (
                <Button
                  variant="contained"
                  style={{ visibility: "hidden" }}
                />
              )
          );
        })}
      </div>
    );
  }

  private onRootPitchClick(rootPitch: Pitch) {
    this.setState({ rootPitch: rootPitch }, this.onScaleChange.bind(this));
  }
  private onScaleClick(scale: ScaleType) {
    this.setState({ scale: scale }, this.onScaleChange.bind(this));
  }

  private onScaleChange() {
    if (this.playAudioCancelFn) {
      this.playAudioCancelFn();
      this.playAudioCancelFn = null;
    }
  }

  private playAudioCancelFn: (() => void) | null = null;

  private onListenClick() {
    if (this.playAudioCancelFn) {
      this.playAudioCancelFn();
      this.playAudioCancelFn = null;
    }

    const playSimultaneously = (this.props.playSimultaneously !== undefined)
      ? this.props.playSimultaneously
      : false;

    let pitches = Chord.fromPitchAndFormulaString(
      this.state.rootPitch,
      this.state.scale.formulaString
    ).pitches;

    if (playSimultaneously) {
      playPitches(pitches);
    } else {
      pitches = pitches.concat(new Pitch(
        this.state.rootPitch.letter,
        this.state.rootPitch.signedAccidental,
        this.state.rootPitch.octaveNumber + 1
      ));
      const cutOffSounds = true;
      this.playAudioCancelFn = playPitchesSequentially(pitches, 500, cutOffSounds);
    }
  }
}