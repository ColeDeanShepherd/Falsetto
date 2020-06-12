import * as React from "react";
import * as Vex from "vexflow";
import { Select, CircularProgress } from "@material-ui/core";

import * as Utils from "../../lib/Core/Utils";
import { TimeSignature } from "../../lib/TheoryLib/TimeSignature";
import * as Audio from "../../Audio/Audio";
import { VexFlowComponent } from "../Utils/VexFlowComponent";
import { Rational } from "../../lib/Core/Rational";
import { noteDurationToVexFlowStr } from '../../VexFlowUtils';
import { RhythmPlayer, IRhythmNote } from '../../RhythmPlayer';
import { getBeatIntervalS } from './Metronome';
import { SizeAwareContainer } from '../Utils/SizeAwareContainer';
import { Size2D } from '../../lib/Core/Size2D';
import { range, isPowerOf2, highestPowerOf2 } from '../../lib/Core/MathUtils';
import { repeatGenerator } from '../../lib/Core/ArrayUtils';
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";

const clickAudioPath = "/audio/metronome_click.wav";
const woodBlockAudioPath = "/audio/wood_block.wav";

const DEFAULT_MAX_NOTES_PER_BEAT = 9;

export interface INoteValuePlayerProps {
  notesPerBeat?: number;
  maxNotesPerBeat?: number;
  showNotesPerBeatSelect?: boolean;
}
export interface INoteValuePlayerState {
  notesPerBeat: number;
  canvasSize: Size2D;
  isLoadingSounds: boolean;
}
export class NoteValuePlayer extends React.Component<INoteValuePlayerProps, INoteValuePlayerState> {
  public constructor(props: INoteValuePlayerProps) {
    super(props);

    const initialState: INoteValuePlayerState = {
      notesPerBeat: this.props.notesPerBeat ? this.props.notesPerBeat : 3,
      canvasSize: new Size2D(0, 0),
      isLoadingSounds: false
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
    const maxNotesPerBeat = this.props.maxNotesPerBeat ? this.props.maxNotesPerBeat : DEFAULT_MAX_NOTES_PER_BEAT;

    return (
      <Card>
        <div style={{display: "flex"}}>
          <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
            Note Value Player
          </h2>
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
                {range(1, maxNotesPerBeat).map(n => <option key={n} value={n}>{n}</option>)}
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
            size={this.state.canvasSize}
            vexFlowRender={vexFlowRender}
          />
        </SizeAwareContainer>
        
        {!this.rhythmPlayer.isPlaying
          ? (
            <Button
              onClick={event => this.play()}
              disabled={this.state.isLoadingSounds}
            >
              {!this.state.isLoadingSounds ? <i className="material-icons">play_arrow</i> : <CircularProgress size={20} disableShrink={true} />}
            </Button>
          )
          : (
            <Button
              onClick={event => this.stop()}
            >
              <i className="material-icons">pause</i>
            </Button>
            )
          }
      </Card>
    );
  }

  private rhythmPlayer: RhythmPlayer;
  private clickSound: Howl | null = null;
  private woodBlockSound: Howl | null = null;
  
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


    if (!isPowerOf2(this.state.notesPerBeat)) {
      tuplets = new Array<Vex.Flow.Tuplet>(this.rhythmPlayer.timeSignature.numBeats);

      for (let i = 0; i < tuplets.length; i++) {
        const noteStartI = this.state.notesPerBeat * i;
        tuplets[i] = new Vex.Flow.Tuplet(vexFlowNotes.slice(noteStartI, noteStartI + this.state.notesPerBeat), {
          num_notes: this.state.notesPerBeat,
          notes_occupied: highestPowerOf2(this.state.notesPerBeat),
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
    if (!this.clickSound || !this.woodBlockSound) {
      Audio.loadSoundsAsync([clickAudioPath, woodBlockAudioPath])
        .then(sounds => {
          this.clickSound = sounds[0];
          this.woodBlockSound = sounds[1];
          this.playAfterSoundsLoaded();
        })
        .catch(error => {
          window.alert(`Failed loading sounds: ${error}`);
          this.setState({ isLoadingSounds: false });
        });

      this.setState({ isLoadingSounds: true });
    } else {
      this.playAfterSoundsLoaded();
    }
  }
  private playAfterSoundsLoaded() {
    this.rhythmPlayer.play(true);
    this.setState({ isLoadingSounds: false });
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
      Utils.unwrapMaybe(this.woodBlockSound).play();
    }
  }
  private onNotePlay(noteIndex: number) {
    Utils.unwrapMaybe(this.clickSound).play();
    this.forceUpdate();
  }

  private createRhythmNotes(timeSignature: TimeSignature, notesPerBeat: number): Array<IRhythmNote> {
    const noteCount = timeSignature.numBeats * notesPerBeat;
    return repeatGenerator<IRhythmNote>(
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
        duration: noteDurationToVexFlowStr(new Rational(1, highestPowerOf2(rn.duration.denominator))),
      }));
  }
  
  private onNoteValueChange(newValueStr: string) {
    const notesPerBeat = parseInt(newValueStr, 10);
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