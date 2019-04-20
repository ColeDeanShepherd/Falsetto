import * as React from "react";
import * as Vex from "vexflow";
import { Button, Card, CardContent, Typography, Select } from "@material-ui/core";

import * as Utils from "../Utils";
import { TimeSignature } from "../TimeSignature";
import * as Audio from "../Audio";
import { VexFlowComponent } from "./VexFlowComponent";
import { Rational } from "../Rational";
import { noteDurationToVexFlowStr } from '../VexFlowUtils';

const clickAudioPath = "audio/metronome_click.wav";

const width = 800;
const height = 140;

interface INoteValuePlayerProps {
  noteValue?: Rational;
  showNoteValueSelect?: boolean;
}
interface INoteValuePlayerState {
  noteValue: Rational;
  beatsPerMinute: number;
  isPlaying: boolean;
  timeStartedPlaying: number;
  lastPlayTimeInSeconds: number;
}

export class NoteValuePlayer extends React.Component<INoteValuePlayerProps, INoteValuePlayerState> {
  public constructor(props: INoteValuePlayerProps) {
    super(props);

    const initialState: INoteValuePlayerState = {
      noteValue: this.props.noteValue ? this.props.noteValue : new Rational(1, 4),
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
              Note Value Player
            </Typography>
          </div>

          {this.props.showNoteValueSelect
            ? (
              <Select
                native
                value={this.state.noteValue.denominator}
                onChange={event => this.onNoteValueChange(event.target.value)}
              >
                {Utils.range(1, 16).map(n => <option value={n}>{n}</option>)}
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

  private timeSignature = new TimeSignature(4, 4);
  private getPlayTimeInSeconds(performanceNow: number): number {
    return Utils.wrapReal(
      (performanceNow - this.state.timeStartedPlaying) / 1000,
      0, this.measureDurationInSeconds
    );
  }
  private get measureDurationInSeconds(): number {
    const measureDurationInMinutes = this.timeSignature.numBeats / this.state.beatsPerMinute;
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
      .addTimeSignature(this.timeSignature.toString());
    stave
      .setContext(context)
      .draw();
    
    // TODO: beams

    const vexFlowNotes = Utils.repeatGenerator(
      i => {
        const note = new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: noteDurationToVexFlowStr(this.state.noteValue),
        });
        //note.setStyle({ fillStyle: `rgba(0, 0, 0, ${this.getVolume(i)})` });

        return note;
      },
      this.state.noteValue.denominator
    );

    let tuplet = !Utils.isPowerOf2(this.state.noteValue.denominator)
      ? new Vex.Flow.Tuplet(vexFlowNotes, {
        num_notes: vexFlowNotes.length,
        notes_occupied: Utils.highestPowerOf2(vexFlowNotes.length),
        location: -1,
        bracketed: true
      } as any)
      : undefined;
    
    const voice = new Vex.Flow.Voice({num_beats: this.timeSignature.numBeats, beat_value: this.timeSignature.beatNoteValue});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], width - 100);
    
    voice.draw(context, stave);

    if (tuplet) {
      tuplet.setContext(context).draw();
    }

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
      Audio.playSound(clickAudioPath);
    }

    this.setState({ lastPlayTimeInSeconds: playTimeInSeconds });

    requestAnimationFrame(this.playUpdate.bind(this));
  }

  private getCurrentNoteIndex(playTimeInSeconds: number): number {
    const percentDoneWithMeasure = playTimeInSeconds / this.measureDurationInSeconds;
    return Math.floor(this.timeSignature.numBeats * percentDoneWithMeasure);
  }
  
  private onNoteValueChange(newValueStr: string) {
    const noteValue = parseInt(newValueStr);
    this.setState({ noteValue: new Rational(1, noteValue), timeStartedPlaying: window.performance.now(), lastPlayTimeInSeconds: -1 });
  }
}