import * as React from "react";
import * as Vex from "vexflow";
import { Button, Card, CardContent, Typography } from "@material-ui/core";

import * as Utils from "../Utils";
import * as Audio from "../Audio";
import { VexFlowComponent } from "./VexFlowComponent";
import { Rational } from "../Rational";
import { noteDurationToVexFlowStr, getTimeSignatureStr } from '../VexFlowUtils';

const clickAudioPath = "audio/metronome_click.wav";

const width = 800;
const height = 100;

interface ITimeSignaturePlayerProps {}
interface ITimeSignaturePlayerState {
  numBeats: number;
  beatNoteValue: number;
  beatsPerMinute: number;
  isPlaying: boolean;
  timeStartedPlaying: number;
  lastPlayTimeInSeconds: number;
}

export class TimeSignaturePlayer extends React.Component<ITimeSignaturePlayerProps, ITimeSignaturePlayerState> {
  public constructor(props: ITimeSignaturePlayerProps) {
    super(props);

    const initialState: ITimeSignaturePlayerState = {
      numBeats: 4,
      beatNoteValue: 4,
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
    const measureDurationInMinutes = this.state.numBeats / this.state.beatsPerMinute;
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
      .addTimeSignature(getTimeSignatureStr(this.state.numBeats, this.state.beatNoteValue));
    stave
      .setContext(context)
      .draw();
    
    const vexFlowNotes = Utils.repeatGenerator(
      i => {
        const note = new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: noteDurationToVexFlowStr(new Rational(1, this.state.beatNoteValue)),
        });
        //note.setStyle({ fillStyle: `rgba(0, 0, 0, ${this.getVolume(i)})` });

        return note;
      },
      this.state.numBeats
    );
    
    const voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], width);
    
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
    return Math.floor(this.state.numBeats * percentDoneWithMeasure);
  }
  private getVolume(noteIndex: number): number {
    const strongBeatVolume = 1;
    const mediumBeatVolume = 0.5;
    const weakBeatVolume = 0.25;

    const timeSignatureStr = getTimeSignatureStr(this.state.numBeats, this.state.beatNoteValue);

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
    }
 
    throw new Error(`Unsupported time signature ${timeSignatureStr} & note index ${noteIndex}`);
  }
}