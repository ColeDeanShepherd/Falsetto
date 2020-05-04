import * as React from "react";

import { Vector2D } from '../../lib/Core/Vector2D';
import { Size2D } from "../../lib/Core/Size2D";
import { Rect2D } from '../../lib/Core/Rect2D';
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Chord } from "../../lib/TheoryLib/Chord";
import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { playPitches } from '../../Audio/PianoAudio';
import * as PianoScaleDronePlayer from "../Utils/PianoScaleDronePlayer";
import { GuitarChordViewer } from '../Utils/GuitarChordViewer';
import { getStandardGuitarTuning } from '../Utils/StringedInstrumentTuning';
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { getPianoKeyboardAspectRatio } from '../Utils/PianoUtils';

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);
const pianoOctaveCount = 2;
const pianoAspectRatio = getPianoKeyboardAspectRatio(pianoOctaveCount);

const guitarTuning = getStandardGuitarTuning(6);

export interface IChordViewerProps {
  title?: string;
  chordTypeGroups?: Array<ChordTypeGroup>;
  renderOnCard?: boolean;
  showChordSelect?: boolean;
  showChordInfoText?: boolean;
  showPianoKeyboard?: boolean;
  showGuitarFretboard?: boolean;
}

export interface IChordViewerState {
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
    const { chord } = this.state;

    const title = this.props.title
      ? this.props.title
      : "Chord Viewer";
    
    const pitches = this.state.chord.getPitches();

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
      const intervals = this.state.chord.type.getIntervals();
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

    const pianoGuitarStyle = { width: "100%", maxWidth: "400px", height: "auto" };
    
    const renderOnCard = (this.props.renderOnCard !== undefined)
      ? this.props.renderOnCard
      : true;

    const showChordSelect = (this.props.showChordSelect !== undefined)
      ? this.props.showChordSelect
      : true;
    
    const renderChordSelect = () => {
      return (
        <div>
          <Typography gutterBottom={true} variant="h6" component="h4">
            Root Pitch
          </Typography>
          <div style={{padding: "1em 0"}}>
            <ValidKeyPitchSelect
              preferredOctaveNumber={4}
              value={[this.state.chord.rootPitch]}
              onChange={rootPitches => this.onRootPitchClick(rootPitches[0])}
            />
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
        </div>
      );
    };
    
    const showChordInfoText = (this.props.showChordInfoText !== undefined)
      ? this.props.showChordInfoText
      : true;
    
    const renderChordInfoText = () => {
      return (
        <div style={{fontSize: "1.5em"}}>
          <p>{this.state.chord.rootPitch.toString(false)} {this.state.chord.type.name}</p>
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
            renderExtrasFn={metrics => PianoScaleDronePlayer.renderExtrasFn(metrics, pitches, this.state.chord.rootPitch)}
            style={pianoGuitarStyle}
          />
        </div>
      );
    };

    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;

    const renderGuitarFretboard = () => {
      const guitarSize = new Size2D(400, 140);
      
      const guitarRootPitch = new Pitch(
        this.state.chord.rootPitch.letter,
        this.state.chord.rootPitch.signedAccidental,
        this.state.chord.rootPitch.octaveNumber - 2
      );

      return (
        <div style={{marginTop: "1em"}}>
          <GuitarChordViewer
            chordType={this.state.chord.type}
            rootPitch={guitarRootPitch}
            tuning={guitarTuning}
            size={guitarSize} />
        </div>
      );
    };
    
    const baseButtonStyle: any = { textTransform: "none" };

    const containerContents = (
      <div>
        <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
          {title}
        </Typography>
        
        <div style={{textAlign: "center"}}>
          {showChordSelect ? renderChordSelect() : null}
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
          {showGuitarFretboard ? renderGuitarFretboard() : null }
        </div>
      </div>
    );
    
    return renderOnCard
    ? (
      <Card>
        <CardContent>
          {containerContents}
        </CardContent>
      </Card>
    ) : containerContents;
  }

  private get chordTypeGroups(): Array<ChordTypeGroup> {
    return this.props.chordTypeGroups
      ? this.props.chordTypeGroups
      : ChordType.Groups;
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