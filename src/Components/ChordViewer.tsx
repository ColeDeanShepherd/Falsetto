import * as React from "react";

import * as Utils from "../Utils";
import { Vector2D } from '../Vector2D';
import { Size2D } from "../Size2D";
import { Rect2D } from '../Rect2D';
import { PitchLetter } from "../PitchLetter";
import { Pitch } from "../Pitch";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Chord, ChordType, ChordTypeGroup } from "../Chord";
import { PianoKeyboard } from "./PianoKeyboard";
import { playPitches } from '../Piano';
import * as PianoScaleDronePlayer from "./PianoScaleDronePlayer";
import { GuitarChordViewer } from './Quizzes/GuitarScales';

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

interface IChordViewerProps {
  title?: string;
  chordTypeGroups?: Array<ChordTypeGroup>;
  showGuitarFretboard?: boolean;
  isEmbedded?: boolean;
}
interface IChordViewerState {
  chordTypeGroup: ChordTypeGroup;
  chord: Chord;
}

export class ChordViewer extends React.Component<IChordViewerProps, IChordViewerState> {
  public constructor(props: IChordViewerProps) {
    super(props);

    this.state = {
      chordTypeGroup: this.chordTypeGroups[0],
      chord: new Chord(this.chordTypeGroups[0].chordTypes[0], new Pitch(PitchLetter.C, 0, 4))
    };
  }

  public render(): JSX.Element {
    const title = this.props.title
      ? this.props.title
      : "Chord Viewer";
      
    const pitches = this.state.chord.getPitches();
    const pitchStrings = pitches
      .map(pitch => pitch.toString(false));
    const pitchesString = pitchStrings.join(", ");

    const intervals = this.state.chord.type.getIntervals();
    const intervalStrings = intervals
      .map((interval, i) => (i === 0) ? "R" : interval.toString());
    const intervalsString = intervalStrings.join(", ");

    const pianoGuitarStyle = { width: "100%", maxWidth: "400px", height: "auto" };

    const pianoSize = new Size2D(400, 100);
    const guitarSize = new Size2D(400, 140);
    
    const onKeyPress = (pitch: Pitch) => {
      const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

      if (Utils.arrayContains(pitchMidiNumberNoOctaves, pitch.midiNumberNoOctave)) {
        playPitches([pitch]);
      }
    };
    
    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;

    const guitarRootPitch = new Pitch(
      this.state.chord.rootPitch.letter,
      this.state.chord.rootPitch.signedAccidental,
      this.state.chord.rootPitch.octaveNumber - 2
    );
    
    const baseButtonStyle: any = { textTransform: "none" };
    
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
            
            {(this.chordTypeGroups.length > 1) ? (
              <div>
                <Typography gutterBottom={true} variant="h6" component="h4">
                  Category
                </Typography>
                <div style={{padding: "1em 0"}}>
                  {this.chordTypeGroups.map(chordTypeGroup => {
                    return (
                      <Button
                        key={chordTypeGroup.name}
                        onClick={event => this.onChordTypeGroupClick(chordTypeGroup)}
                        variant="contained"
                        style={baseButtonStyle}
                      >
                        {chordTypeGroup.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Typography gutterBottom={true} variant="h6" component="h4">
              Type
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.state.chordTypeGroup.chordTypes.map(chordType => {
                const style: any = { ...baseButtonStyle };
                
                const isPressed = chordType.name === this.state.chord.type.name;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={chordType.name}
                    onClick={event => this.onChordType(chordType)}
                    variant="contained"
                    style={style}
                  >
                    {chordType.name}
                  </Button>
                );
              })}
            </div>
            <div style={{fontSize: "1.5em"}}>
              <p>{this.state.chord.rootPitch.toString(false)} {this.state.chord.type.name}</p>
              <p>{pitchesString}</p>
              <p>{this.state.chord.type.formula.toString()}</p>
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
                  renderExtrasFn={metrics => PianoScaleDronePlayer.renderExtrasFn(metrics, pitches, this.state.chord.rootPitch)}
                  style={pianoGuitarStyle}
                />
              </div>

              <div style={{marginTop: "1em"}}>
                {(showGuitarFretboard) ? (
                  <GuitarChordViewer
                    chordType={this.state.chord.type}
                    rootPitch={guitarRootPitch}
                    size={guitarSize} />
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  private get chordTypeGroups(): Array<ChordTypeGroup> {
    return this.props.chordTypeGroups
      ? this.props.chordTypeGroups
      : ChordType.Groups;
  }
  private renderRootPitchRow(rootPitches: Array<Pitch | null>): JSX.Element {
    return (
      <div>
        {rootPitches.map(pitch => {
          const style: any = { textTransform: "none" };
          
          const isPressed = pitch && (pitch.equals(this.state.chord.rootPitch));
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
    const newChord = new Chord(this.state.chord.type, rootPitch);
    this.setState({ chord: newChord }, this.onChordChange.bind(this));
  }
  private onChordTypeGroupClick(chordTypeGroup: ChordTypeGroup) {
    this.setState({ chordTypeGroup: chordTypeGroup }, this.onChordChange.bind(this));
  }
  private onChordType(chordType: ChordType) {
    const newChord = new Chord(chordType, this.state.chord.rootPitch);
    this.setState({ chord: newChord }, this.onChordChange.bind(this));
  }

  private onChordChange() {
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

    playPitches(this.state.chord.getPitches());
  }
}