import * as React from "react";
import * as Vex from "vexflow";
import { Button, Card, CardContent, Typography, Select } from "@material-ui/core";

import * as Utils from "../Utils";
import { TimeSignature } from "../TimeSignature";
import * as Audio from "../Audio";
import { VexFlowComponent } from "./VexFlowComponent";
import { Rational } from "../Rational";
import { noteDurationToVexFlowStr } from '../VexFlowUtils';
import { RhythymPlayer, IRhythymNote } from '../Rhythym';
import { getBeatIntervalS } from './Metronome';

const clickAudioPath = "audio/metronome_click.wav";
const woodBlockAudioPath = "audio/wood_block.wav";

const width = 800;
const height = 140;

interface INoteValuePlayerProps {
  noteValue?: Rational;
  showNoteValueSelect?: boolean;
}
interface INoteValuePlayerState {
  noteValue: Rational;
}

export class NoteValuePlayer extends React.Component<INoteValuePlayerProps, INoteValuePlayerState> {
  public constructor(props: INoteValuePlayerProps) {
    super(props);

    const initialState: INoteValuePlayerState = {
      noteValue: this.props.noteValue ? this.props.noteValue : new Rational(1, 4)
    };

    this.rhythymPlayer = new RhythymPlayer(
      new TimeSignature(4, 4),
      this.createRhythymNotes(initialState.noteValue),
      120,
      this.onNotePlay.bind(this)
    );
    this.rhythymPlayer.onPlayUpdate = this.onPlayUpdate.bind(this);

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
          
          {!this.rhythymPlayer.isPlaying
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

  private rhythymPlayer: RhythymPlayer;
  
  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");
  
    const stave = new Vex.Flow.Stave(0, 0, width);
    stave
      .addClef("treble")
      .addTimeSignature(this.rhythymPlayer.timeSignature.toString());
    stave
      .setContext(context)
      .draw();
    
    // TODO: beams

    const vexFlowNotes = this.createVexFlowNotes();

    // TODO: improve beaming for powers of 2
    let beam = (this.state.noteValue.denominator >= 8)
      ? new Vex.Flow.Beam(vexFlowNotes)
      : undefined;

    let tuplet = !Utils.isPowerOf2(this.state.noteValue.denominator)
      ? new Vex.Flow.Tuplet(vexFlowNotes, {
        num_notes: vexFlowNotes.length,
        notes_occupied: Utils.highestPowerOf2(vexFlowNotes.length),
        location: -1,
        bracketed: true,
        ratioed: false
      })
      : undefined;
    
    const voice = new Vex.Flow.Voice({num_beats: this.rhythymPlayer.timeSignature.numBeats, beat_value: this.rhythymPlayer.timeSignature.beatNoteValue});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], width - 100);
    
    voice.draw(context, stave);

    if (beam) {
      beam.setContext(context).draw();
    }

    if (tuplet) {
      tuplet.setContext(context).draw();
    }

    if (this.rhythymPlayer.isPlaying) {
      // render time bar
      const timeBarNoteIndex = this.rhythymPlayer.currentNoteIndex;

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
    this.rhythymPlayer.play(true);
    this.forceUpdate();
  }
  private stop() {
    this.rhythymPlayer.stop();
    this.forceUpdate();
  }

  private onPlayUpdate(playTimeInSeconds: number, lastPlayTimeInSeconds: number | null) {
    let shouldPlayBeat = false;

    if (lastPlayTimeInSeconds === null) {
      shouldPlayBeat = true;
    } else {
      const beatInterval = getBeatIntervalS(this.rhythymPlayer.beatsPerMinute);
      const lastBeatIndex = Math.floor(lastPlayTimeInSeconds / beatInterval);
      const beatIndex = Math.floor(playTimeInSeconds / beatInterval);

      if (beatIndex !== lastBeatIndex) {
        shouldPlayBeat = true;
      }
    }

    if (shouldPlayBeat) {
      Audio.playSound(woodBlockAudioPath);
    }
  }
  private onNotePlay(noteIndex: number) {
    Audio.playSound(clickAudioPath);
    this.forceUpdate();
  }

  private createVexFlowNotes(): Array<Vex.Flow.StaveNote> {
    return Utils.repeatGenerator(
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
  }
  private createRhythymNotes(noteValue: Rational): Array<IRhythymNote> {
    return Utils.repeatGenerator<IRhythymNote>(
      i => ({
        duration: noteValue,
        isRest: false
      }),
      noteValue.denominator
    );
  }
  
  private onNoteValueChange(newValueStr: string) {
    const noteValue = parseInt(newValueStr);
    const stateDelta = { noteValue: new Rational(1, noteValue) };

    this.rhythymPlayer.stop();
    this.rhythymPlayer = new RhythymPlayer(
      new TimeSignature(4, 4),
      this.createRhythymNotes(stateDelta.noteValue),
      120,
      this.onNotePlay.bind(this)
    );
    this.rhythymPlayer.onPlayUpdate = this.onPlayUpdate.bind(this);

    this.setState(stateDelta);
  }
}