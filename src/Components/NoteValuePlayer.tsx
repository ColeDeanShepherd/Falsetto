import * as React from "react";
import * as Vex from "vexflow";
import { Button, Card, CardContent, Typography, Select } from "@material-ui/core";

import * as Utils from "../Utils";
import { TimeSignature } from "../TimeSignature";
import * as Audio from "../Audio";
import { VexFlowComponent } from "./VexFlowComponent";
import { Rational } from "../Rational";
import { noteDurationToVexFlowStr } from '../VexFlowUtils';
import { RhythmPlayer, IRhythmNote } from '../Rhythm';
import { getBeatIntervalS } from './Metronome';
import { SizeAwareContainer } from './SizeAwareContainer';
import { Size2D } from '../Size2D';

const clickAudioPath = "/audio/metronome_click.wav";
const woodBlockAudioPath = "/audio/wood_block.wav";

export interface INoteValuePlayerProps {
  notesPerBeat?: number;
  showNotesPerBeatSelect?: boolean;
}
export interface INoteValuePlayerState {
  notesPerBeat: number;
  canvasSize: Size2D;
}
export class NoteValuePlayer extends React.Component<INoteValuePlayerProps, INoteValuePlayerState> {
  public constructor(props: INoteValuePlayerProps) {
    super(props);

    const initialState: INoteValuePlayerState = {
      notesPerBeat: this.props.notesPerBeat ? this.props.notesPerBeat : 3,
      canvasSize: new Size2D(0, 0)
    };

    const timeSignature = new TimeSignature(4, 4);
    this.rhythmPlayer = new RhythmPlayer(
      timeSignature,
      this.createRhythmNotes(timeSignature, initialState.notesPerBeat),
      60,
      this.onNotePlay.bind(this)
    );
    this.rhythmPlayer.onPlayUpdate = this.onPlayUpdate.bind(this);

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

          <p style={{ margin: 0 }}>BPM: {this.rhythmPlayer.beatsPerMinute}</p>

          {this.props.showNotesPerBeatSelect
            ? (
              <div>
                <span>Notes Per Beat: </span>
                <Select
                  native
                  value={this.state.notesPerBeat}
                  onChange={event => this.onNoteValueChange(event.target.value)}
                >
                  {Utils.range(1, 9).map(n => <option key={n} value={n}>{n}</option>)}
                </Select>
              </div>
            )
            : null
          }

          <div>
            Name: {this.getTupletName(this.state.notesPerBeat)}
          </div>

          <SizeAwareContainer height={140} onResize={s => this.onCanvasResize(s)}>
            <VexFlowComponent
              width={this.state.canvasSize.width} height={this.state.canvasSize.height}
              vexFlowRender={vexFlowRender}
            />
          </SizeAwareContainer>
          
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

  private rhythmPlayer: RhythmPlayer;
  
  private vexFlowRender(context: Vex.IRenderContext, size: Size2D) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");
  
    const stave = new Vex.Flow.Stave(0, 0, size.width);
    stave
      .addClef("treble")
      .addTimeSignature(this.rhythmPlayer.timeSignature.toString());
    stave
      .setContext(context)
      .draw();

    const vexFlowNotes = this.createVexFlowNotes(this.rhythmPlayer.timeSignature, this.state.notesPerBeat);

    // TODO: fix beams
    let beams: Array<Vex.Flow.Beam> | undefined = undefined;

    if (this.state.notesPerBeat > 1) {
      beams = new Array<Vex.Flow.Beam>(this.rhythmPlayer.timeSignature.numBeats);

      for (let i = 0; i < beams.length; i++) {
        const noteStartI = this.state.notesPerBeat * i;
        beams[i] = new Vex.Flow.Beam(vexFlowNotes.slice(noteStartI, noteStartI + this.state.notesPerBeat));
      }
    }
    /*let beam = (this.state.notesPerBeat >= 2)
      ? new Vex.Flow.Beam(vexFlowNotes)
      : undefined;*/

    let tuplets: Array<Vex.Flow.Tuplet> | undefined = undefined;


    if (!Utils.isPowerOf2(this.state.notesPerBeat)) {
      tuplets = new Array<Vex.Flow.Tuplet>(this.rhythmPlayer.timeSignature.numBeats);

      for (let i = 0; i < tuplets.length; i++) {
        const noteStartI = this.state.notesPerBeat * i;
        tuplets[i] = new Vex.Flow.Tuplet(vexFlowNotes.slice(noteStartI, noteStartI + this.state.notesPerBeat), {
          num_notes: this.state.notesPerBeat,
          notes_occupied: Utils.highestPowerOf2(this.state.notesPerBeat),
          location: -1,
          bracketed: true,
          ratioed: false
        });
      }
    }
    
    const voice = new Vex.Flow.Voice({num_beats: this.rhythmPlayer.timeSignature.numBeats, beat_value: this.rhythmPlayer.timeSignature.beatNoteValue});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], size.width - 100);
    
    voice.draw(context, stave);

    if (beams) {
      for (const beam of beams) {
        beam.setContext(context).draw();
      }
    }

    if (tuplets) {
      for (const tuplet of tuplets) {
        tuplet.setContext(context).draw();
      }
    }

    if (this.rhythmPlayer.isPlaying) {
      // render time bar
      const timeBarNoteIndex = this.rhythmPlayer.currentNoteIndex;

      if (timeBarNoteIndex < vexFlowNotes.length) {
        const timeBarWidth = 3;
        const timeBarHeight = size.height;
        const timeBarX = vexFlowNotes[timeBarNoteIndex].getAbsoluteX();
        const timeBarY = 0;
        
        context.fillRect(timeBarX, timeBarY, timeBarWidth, timeBarHeight);
      }
    }
  }

  private play() {
    this.rhythmPlayer.play(true);
    this.forceUpdate();
  }
  private stop() {
    this.rhythmPlayer.stop();
    this.forceUpdate();
  }

  private onPlayUpdate(playTimeInSeconds: number, lastPlayTimeInSeconds: number | null) {
    let shouldPlayBeat = false;

    if (lastPlayTimeInSeconds === null) {
      shouldPlayBeat = true;
    } else {
      const beatInterval = getBeatIntervalS(this.rhythmPlayer.beatsPerMinute);
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

  private createRhythmNotes(timeSignature: TimeSignature, notesPerBeat: number): Array<IRhythmNote> {
    const noteCount = timeSignature.numBeats * notesPerBeat;
    return Utils.repeatGenerator<IRhythmNote>(
      i => ({
        duration: new Rational(1, noteCount),
        isRest: false
      }),
      noteCount
    );
  }
  private createVexFlowNotes(timeSignature: TimeSignature, notesPerBeat: number): Array<Vex.Flow.StaveNote> {
    return this.createRhythmNotes(timeSignature, notesPerBeat)
      .map(rn => new Vex.Flow.StaveNote({
        clef: "treble",
        keys: ["b/4"],
        duration: noteDurationToVexFlowStr(new Rational(1, Utils.highestPowerOf2(rn.duration.denominator))),
      }));
  }
  
  private onNoteValueChange(newValueStr: string) {
    const notesPerBeat = parseInt(newValueStr);
    const stateDelta = { notesPerBeat: notesPerBeat };

    const wasPlaying = this.rhythmPlayer.isPlaying;

    if (wasPlaying) {
      this.rhythmPlayer.stop();
    }

    this.rhythmPlayer.rhythmNotes = this.createRhythmNotes(this.rhythmPlayer.timeSignature, stateDelta.notesPerBeat);
    this.rhythmPlayer.onPlayUpdate = this.onPlayUpdate.bind(this);

    if (wasPlaying) {
      this.rhythmPlayer.play(true);
    }

    this.setState(stateDelta);
  }
  private onCanvasResize(newValue: Size2D) {
    this.setState({ canvasSize: newValue });
  }

  private getTupletName(notesPerBeat: number): string {
    switch (notesPerBeat) {
      case 3:
        return "triplet";
      case 5:
        return "quintuplet";
      case 6:
        return "sextuplet";
      case 7:
        return "septuplet";
      case 9:
        return "nonuplet";
      default:
        return "N/A";
    }
  }
}