import * as React from "react";
import Vex from "vexflow";
import { Select, CircularProgress } from "@material-ui/core";

import { TimeSignature } from "../../lib/TheoryLib/TimeSignature";
import * as Audio from "../../Audio/Audio";
import { VexFlowComponent } from "../Utils/VexFlowComponent";
import { Rational } from "../../lib/Core/Rational";
import { noteDurationToVexFlowStr } from '../../ui/VexFlowUtils';
import { RhythmPlayer, IRhythmNote } from '../../RhythmPlayer';
import { SizeAwareContainer } from '../Utils/SizeAwareContainer';
import { Size2D } from '../../lib/Core/Size2D';
import { repeatGenerator } from '../../lib/Core/ArrayUtils';
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { Howl } from "howler";

const clickAudioPath = "/audio/metronome_click.wav";

function getTimeSignatureStr(numBeats: number, beatNoteValue: number): string {
  return `${numBeats}/${beatNoteValue}`;
}

export enum BeatStrength {
  Strong,
  Medium,
  Weak
}

export function getBeatStrength(timeSignature: TimeSignature, noteIndex: number): BeatStrength {
  const timeSignatureStr = getTimeSignatureStr(timeSignature.numBeats, timeSignature.beatNoteValue);

  switch (timeSignatureStr) {
    case "4/4":
      switch (noteIndex) {
        case 0:
          return BeatStrength.Strong;
        case 2:
          return BeatStrength.Medium;
        case 1:
        case 3:
          return BeatStrength.Weak;
      }
    case "3/4":
      switch (noteIndex) {
        case 0:
          return BeatStrength.Strong;
        case 1:
        case 2:
          return BeatStrength.Weak;
      }
    case "2/4":
      switch (noteIndex) {
        case 0:
          return BeatStrength.Strong;
        case 1:
          return BeatStrength.Weak;
      }
    case "6/8":
      switch (noteIndex) {
        case 0:
          return BeatStrength.Strong;
        case 3:
          return BeatStrength.Medium;
        case 1:
        case 2:
        case 4:
        case 5:
          return BeatStrength.Weak;
      }
    case "9/8":
      switch (noteIndex) {
        case 0:
          return BeatStrength.Strong;
        case 3:
        case 6:
          return BeatStrength.Medium;
        case 1:
        case 2:
        case 4:
        case 5:
        case 7:
        case 8:
          return BeatStrength.Weak;
      }
    case "12/8":
      switch (noteIndex) {
        case 0:
          return BeatStrength.Strong;
        case 3:
        case 6:
        case 9:
          return BeatStrength.Medium;
        case 1:
        case 2:
        case 4:
        case 5:
        case 7:
        case 8:
        case 10:
        case 11:
          return BeatStrength.Weak;
      }
  }

  throw new Error(`Unsupported time signature ${timeSignatureStr} & note index ${noteIndex}`);
}

interface ITimeSignaturePlayerProps {
  timeSignature?: TimeSignature;
  showTimeSignatureSelect?: boolean;
}
interface ITimeSignaturePlayerState {
  canvasSize: Size2D;
  isLoadingSounds: boolean;
}

export class TimeSignaturePlayer extends React.Component<ITimeSignaturePlayerProps, ITimeSignaturePlayerState> {
  public constructor(props: ITimeSignaturePlayerProps) {
    super(props);

    const timeSignature = this.props.timeSignature ? this.props.timeSignature : new TimeSignature(4, 4);
    this.rhythmPlayer = new RhythmPlayer(
      timeSignature,
      this.createRhythmNotes(timeSignature), 120, this.onNotePlay.bind(this)
    );

    this.state = {
      canvasSize: new Size2D(0, 0),
      isLoadingSounds: false
    };
  }

  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);

    return (
      <Card>
        <div style={{display: "flex"}}>
          <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
            Time Signature Player
          </h2>
        </div>

        <p style={{ margin: 0 }}>BPM: {this.rhythmPlayer.beatsPerMinute}</p>

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

        <SizeAwareContainer height={100} onResize={s => this.onCanvasResize(s)}>
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
    
    const vexFlowNotes = this.createVexFlowNotes(this.rhythmPlayer.timeSignature);
    
    let beams: Array<Vex.Flow.Beam> | undefined = undefined;
    if (this.rhythmPlayer.timeSignature.beatNoteValue >= 8) {
      beams = new Array<Vex.Flow.Beam>(this.rhythmPlayer.timeSignature.numBeats / 3);

      for (let i = 0; i < beams.length; i++) {
        const startNoteIndex = 3 * i;
        beams[i] = new Vex.Flow.Beam(vexFlowNotes.slice(startNoteIndex, startNoteIndex + 3));
      }
    }
    
    const voice = new Vex.Flow.Voice({num_beats: this.rhythmPlayer.timeSignature.numBeats, beat_value: this.rhythmPlayer.timeSignature.beatNoteValue});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], size.width - 100);
    
    voice.draw(context, stave);

    if (beams !== undefined) {
      for (const beam of beams) {
        beam.setContext(context).draw();
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

  private createRhythmNotes(timeSignature: TimeSignature): Array<IRhythmNote> {
    return repeatGenerator(
      i => ({
        duration: new Rational(1, timeSignature.numBeats),
        isRest: false
      }),
      timeSignature.numBeats
    );
  }
  private createVexFlowNotes(timeSignature: TimeSignature): Array<Vex.Flow.StaveNote> {
    return repeatGenerator(
      i => {
        const note = new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: noteDurationToVexFlowStr(new Rational(1, timeSignature.beatNoteValue)),
        });
        const styleStr = `rgba(0, 0, 0, ${this.getOpacity(i)})`;
        note.setStyle({ fillStyle: styleStr, strokeStyle: styleStr });

        return note;
      },
      timeSignature.numBeats
    );
  }

  private play() {
    if (!this.clickSound) {
      Audio.loadSoundAsync(clickAudioPath)
        .then(clickSound => {
          this.clickSound = clickSound;
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

  private onNotePlay(noteIndex: number) {
    if (this.clickSound) {
      this.clickSound.volume(this.getVolume(noteIndex));
      this.clickSound.play();
    }
    this.forceUpdate();
  }

  private strongBeatVolume = 1;
  private mediumBeatVolume = 0.6;
  private weakBeatVolume = 0.175;

  private getVolume(noteIndex: number): number {
    const beatStrength = getBeatStrength(this.rhythmPlayer.timeSignature, noteIndex);

    switch (beatStrength) {
      case BeatStrength.Strong:
        return this.strongBeatVolume;
      case BeatStrength.Medium:
        return this.mediumBeatVolume;
      case BeatStrength.Weak:
        return this.weakBeatVolume;
      default:
        throw new Error(`Unknown BeatStrength: ${beatStrength}`);
    }
  }
  private getOpacity(noteIndex: number): number {
    const beatStrength = getBeatStrength(this.rhythmPlayer.timeSignature, noteIndex);

    switch (beatStrength) {
      case BeatStrength.Strong:
        return 1;
      case BeatStrength.Medium:
        return 0.6;
      case BeatStrength.Weak:
        return 0.3;
      default:
        throw new Error(`Unknown BeatStrength: ${beatStrength}`);
    }
  }
  
  private onTimeSignatureChange(newValueStr: string) {
    const newValue = TimeSignature.parse(newValueStr);

    const wasPlaying = this.rhythmPlayer.isPlaying;

    if (wasPlaying) {
      this.rhythmPlayer.stop();
    }

    this.rhythmPlayer.timeSignature = newValue;
    this.rhythmPlayer.rhythmNotes = this.createRhythmNotes(newValue);

    if (wasPlaying) {
      this.rhythmPlayer.play(true);
    }

    this.forceUpdate();
  }
  private onCanvasResize(newValue: Size2D) {
    this.setState({ canvasSize: newValue });
  }
}