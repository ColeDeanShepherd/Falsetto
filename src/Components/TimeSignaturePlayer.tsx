import * as React from "react";
import * as Vex from "vexflow";
import { Button, Card, CardContent, Typography, Select } from "@material-ui/core";

import * as Utils from "../Utils";
import { TimeSignature } from "../TimeSignature";
import * as Audio from "../Audio";
import { VexFlowComponent } from "./VexFlowComponent";
import { Rational } from "../Rational";
import { noteDurationToVexFlowStr, getTimeSignatureStr } from '../VexFlowUtils';

const clickAudioPath = "audio/metronome_click.wav";

const width = 800;
const height = 100;

interface ITimeSignaturePlayerProps {
  timeSignature?: TimeSignature;
  showTimeSignatureSelect?: boolean;
}
interface ITimeSignaturePlayerState {
  timeSignature: TimeSignature;
  beatsPerMinute: number;
  isPlaying: boolean;
  timeStartedPlaying: number;
  lastPlayTimeInSeconds: number;
}

export class TimeSignaturePlayer extends React.Component<ITimeSignaturePlayerProps, ITimeSignaturePlayerState> {
  public constructor(props: ITimeSignaturePlayerProps) {
    super(props);

    const initialState: ITimeSignaturePlayerState = {
      timeSignature: this.props.timeSignature ? this.props.timeSignature : new TimeSignature(4, 4),
      beatsPerMinute: 120,
      isPlaying: false,
      timeStartedPlaying: 0,
      lastPlayTimeInSeconds: -1
    };
    this.state = initialState;
  }

  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Time Signature Player
            </Typography>
          </div>

          {this.props.showTimeSignatureSelect
            ? (
              <Select
                native
                value={this.state.timeSignature.toString()}
                onChange={event => this.onTimeSignatureChange(event.target.value)}
              >
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="2/4">2/4</option>
                <option value="6/8">6/8</option>
                <option value="9/8">9/8</option>
                <option value="12/8">12/8</option>
              </Select>
            )
            : null
          }

          <VexFlowComponent
            width={width} height={height}
            vexFlowRender={vexFlowRender}
          />
          
          {!this.state.isPlaying
            ? (
              <Button
                onClick={event => this.play()}
                disableRipple={true}
                disableFocusRipple={true}
                variant="contained"
              >
                Play
              </Button>
            )
            : (
              <Button
                onClick={event => this.stop()}
                disableRipple={true}
                disableFocusRipple={true}
                variant="contained"
              >
                Stop
              </Button>
            )
          }
        </CardContent>
      </Card>
    );
  }

  private getPlayTimeInSeconds(performanceNow: number): number {
    return Utils.wrapReal(
      (performanceNow - this.state.timeStartedPlaying) / 1000,
      0, this.measureDurationInSeconds
    );
  }
  private get measureDurationInSeconds(): number {
    const measureDurationInMinutes = this.state.timeSignature.numBeats / this.state.beatsPerMinute;
    const measureDurationInSeconds = 60 * measureDurationInMinutes;
    return measureDurationInSeconds;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");
  
    const stave = new Vex.Flow.Stave(0, 0, width);
    stave
      .addClef("treble")
      .addTimeSignature(this.state.timeSignature.toString());
    stave
      .setContext(context)
      .draw();
    
    const vexFlowNotes = Utils.repeatGenerator(
      i => {
        const note = new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: noteDurationToVexFlowStr(new Rational(1, this.state.timeSignature.beatNoteValue)),
        });
        const styleStr = `rgba(0, 0, 0, ${Math.sqrt(this.getVolume(i))})`;
        note.setStyle({ fillStyle: styleStr, strokeStyle: styleStr });

        return note;
      },
      this.state.timeSignature.numBeats
    );
    
    const voice = new Vex.Flow.Voice({num_beats: this.state.timeSignature.numBeats, beat_value: this.state.timeSignature.beatNoteValue});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], width - 100);
    
    voice.draw(context, stave);

    if (this.state.isPlaying) {
      // render time bar
      const timeBarNoteIndex = this.getCurrentNoteIndex(this.getPlayTimeInSeconds(window.performance.now()));

      if (timeBarNoteIndex < vexFlowNotes.length) {
        const timeBarWidth = 3;
        const timeBarHeight = height;
        const timeBarX = vexFlowNotes[timeBarNoteIndex].getAbsoluteX();
        const timeBarY = 0;
        
        context.fillRect(timeBarX, timeBarY, timeBarWidth, timeBarHeight);
      }
    }
  }

  private play() {
    this.setState(
      { isPlaying: true, timeStartedPlaying: window.performance.now(), lastPlayTimeInSeconds: -1 },
      () => requestAnimationFrame(this.playUpdate.bind(this))
    );
  }
  private stop() {
    this.setState({ isPlaying: false });
  }

  private playUpdate() {
    if (!this.state.isPlaying) { return; }

    const playTimeInSeconds = this.getPlayTimeInSeconds(window.performance.now());
    const lastNoteIndex = this.getCurrentNoteIndex(this.state.lastPlayTimeInSeconds);
    const currentNoteIndex = this.getCurrentNoteIndex(playTimeInSeconds);

    if (currentNoteIndex !== lastNoteIndex) {
      Audio.playSound(clickAudioPath, this.getVolume(currentNoteIndex));
    }

    this.setState({ lastPlayTimeInSeconds: playTimeInSeconds });

    requestAnimationFrame(this.playUpdate.bind(this));
  }

  private getCurrentNoteIndex(playTimeInSeconds: number): number {
    const percentDoneWithMeasure = playTimeInSeconds / this.measureDurationInSeconds;
    return Math.floor(this.state.timeSignature.numBeats * percentDoneWithMeasure);
  }
  private getVolume(noteIndex: number): number {
    const strongBeatVolume = 1;
    const mediumBeatVolume = 0.6;
    const weakBeatVolume = 0.175;

    const timeSignatureStr = getTimeSignatureStr(this.state.timeSignature.numBeats, this.state.timeSignature.beatNoteValue);

    switch (timeSignatureStr) {
      case "4/4":
        switch (noteIndex) {
          case 0:
            return strongBeatVolume;
          case 2:
            return mediumBeatVolume;
          case 1:
          case 3:
            return weakBeatVolume;
        }
      case "3/4":
        switch (noteIndex) {
          case 0:
            return strongBeatVolume;
          case 1:
          case 2:
            return weakBeatVolume;
        }
      case "2/4":
        switch (noteIndex) {
          case 0:
            return strongBeatVolume;
          case 1:
            return weakBeatVolume;
        }
      case "6/8":
        switch (noteIndex) {
          case 0:
            return strongBeatVolume;
          case 3:
            return mediumBeatVolume
          case 1:
          case 2:
          case 4:
          case 5:
            return weakBeatVolume;
        }
      case "9/8":
        switch (noteIndex) {
          case 0:
            return strongBeatVolume;
          case 3:
          case 6:
            return mediumBeatVolume
          case 1:
          case 2:
          case 4:
          case 5:
          case 7:
          case 8:
            return weakBeatVolume;
        }
        case "12/8":
          switch (noteIndex) {
            case 0:
              return strongBeatVolume;
            case 3:
            case 6:
            case 9:
              return mediumBeatVolume
            case 1:
            case 2:
            case 4:
            case 5:
            case 7:
            case 8:
            case 10:
            case 11:
              return weakBeatVolume;
          }
    }
 
    throw new Error(`Unsupported time signature ${timeSignatureStr} & note index ${noteIndex}`);
  }
  
  private onTimeSignatureChange(newValueStr: string) {
    const newValue = TimeSignature.parse(newValueStr);
    this.setState({ timeSignature: newValue, timeStartedPlaying: window.performance.now(), lastPlayTimeInSeconds: -1 });
  }
}