import * as React from "react";
import * as Vex from "vexflow";
import { Button, Card, CardContent, Typography, Select } from "@material-ui/core";

import * as Utils from "../Utils";
import { TimeSignature } from "../TimeSignature";
import * as Audio from "../Audio";
import { VexFlowComponent } from "./VexFlowComponent";
import { Rational } from "../Rational";
import { noteDurationToVexFlowStr, getTimeSignatureStr } from '../VexFlowUtils';
import { RhythymPlayer, IRhythymNote } from '../Rhythym';

const clickAudioPath = "audio/metronome_click.wav";

const width = 800;
const height = 100;

interface ITimeSignaturePlayerProps {
  timeSignature?: TimeSignature;
  showTimeSignatureSelect?: boolean;
}
interface ITimeSignaturePlayerState {}

export class TimeSignaturePlayer extends React.Component<ITimeSignaturePlayerProps, ITimeSignaturePlayerState> {
  public constructor(props: ITimeSignaturePlayerProps) {
    super(props);

    const timeSignature = this.props.timeSignature ? this.props.timeSignature : new TimeSignature(4, 4);
    this.rhythmPlayer = new RhythymPlayer(
      timeSignature,
      this.createRhythmNotes(timeSignature), 120, this.onNotePlay.bind(this)
    );

    this.state = {};
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
                value={this.rhythmPlayer.timeSignature.toString()}
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
          
          {!this.rhythmPlayer.isPlaying
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

  private rhythmPlayer: RhythymPlayer;

  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");
  
    const stave = new Vex.Flow.Stave(0, 0, width);
    stave
      .addClef("treble")
      .addTimeSignature(this.rhythmPlayer.timeSignature.toString());
    stave
      .setContext(context)
      .draw();
    
    const vexFlowNotes = this.createVexFlowNotes(this.rhythmPlayer.timeSignature);
    
    const voice = new Vex.Flow.Voice({num_beats: this.rhythmPlayer.timeSignature.numBeats, beat_value: this.rhythmPlayer.timeSignature.beatNoteValue});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], width - 100);
    
    voice.draw(context, stave);

    if (this.rhythmPlayer.isPlaying) {
      // render time bar
      const timeBarNoteIndex = this.rhythmPlayer.currentNoteIndex;

      if (timeBarNoteIndex < vexFlowNotes.length) {
        const timeBarWidth = 3;
        const timeBarHeight = height;
        const timeBarX = vexFlowNotes[timeBarNoteIndex].getAbsoluteX();
        const timeBarY = 0;
        
        context.fillRect(timeBarX, timeBarY, timeBarWidth, timeBarHeight);
      }
    }
  }

  private createRhythmNotes(timeSignature: TimeSignature): Array<IRhythymNote> {
    return Utils.repeatGenerator(
      i => ({
        duration: new Rational(1, timeSignature.numBeats),
        isRest: false
      }),
      timeSignature.numBeats
    );
  }
  private createVexFlowNotes(timeSignature: TimeSignature): Array<Vex.Flow.StaveNote> {
    return Utils.repeatGenerator(
      i => {
        const note = new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: noteDurationToVexFlowStr(new Rational(1, timeSignature.beatNoteValue)),
        });
        const styleStr = `rgba(0, 0, 0, ${Math.sqrt(this.getVolume(i))})`;
        note.setStyle({ fillStyle: styleStr, strokeStyle: styleStr });

        return note;
      },
      timeSignature.numBeats
    );
  }

  private play() {
    this.rhythmPlayer.play(true);
    this.forceUpdate();
  }
  private stop() {
    this.rhythmPlayer.stop();
    this.forceUpdate();
  }

  private onNotePlay(noteIndex: number) {
    Audio.playSound(clickAudioPath, this.getVolume(noteIndex));
    this.forceUpdate();
  }

  private getVolume(noteIndex: number): number {
    const strongBeatVolume = 1;
    const mediumBeatVolume = 0.6;
    const weakBeatVolume = 0.175;

    const timeSignatureStr = getTimeSignatureStr(this.rhythmPlayer.timeSignature.numBeats, this.rhythmPlayer.timeSignature.beatNoteValue);

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

    this.rhythmPlayer.stop();
    this.rhythmPlayer = new RhythymPlayer(
      newValue,
      this.createRhythmNotes(newValue),
      this.rhythmPlayer.beatsPerMinute,
      this.rhythmPlayer.onNotePlay
    );
    this.forceUpdate();
  }
}