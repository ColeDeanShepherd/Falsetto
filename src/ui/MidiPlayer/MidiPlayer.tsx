import * as React from "react";
import { Midi, Track } from "@tonejs/midi";
import { Note as MidiNote } from "@tonejs/midi/dist/Note";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PianoKeyboard, PianoKeyboardMetrics } from '../Utils/PianoKeyboard';
import { fullPianoLowestPitch, fullPianoHighestPitch } from '../Utils/PianoUtils';
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { AppModel } from "../../App/Model";
import { Interval } from "../../lib/TheoryLib/Interval";
import { Button } from "../Button/Button";
import { Rect2D } from '../../lib/Core/Rect2D';
import { Size2D } from '../../lib/Core/Size2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { getTranslateTransformString } from '../../lib/Core/SvgUtils';
import { findIntervalsChordsScales } from "../../lib/TheoryLib/Analysis";
import { createAnalysisTestMidi } from '../../lib/Midi/AnalysisTestMidiFile';

import { MidiNotesAnalysis, analyzeMidiNotes, getDetectedKeyAtTicks } from '../../lib/Midi/MidiAnalysis';
import { testMidiFile1 } from '../../lib/Midi/TestMidiFile1';

const frameIntervalMs = 16; // 60 FPS

function runUpdateLoop(updateFn: (deltaMs: number) => void): () => void {
  let isCanceled = false;

  const firstFrameTime = performance.now();
  let lastFrameTime = firstFrameTime;

  const internalUpdate = () => {
    if (isCanceled) { return; }

    const time = performance.now();

    const deltaMs = time - lastFrameTime;
    lastFrameTime = time;

    updateFn(deltaMs);

    window.setTimeout(internalUpdate, frameIntervalMs);
  };

  window.setTimeout(internalUpdate, frameIntervalMs);

  return () => { isCanceled = true; };
}

interface PlayState {
  isPlaying: boolean;
  midi: Midi;
  timeMs: number;
  trackNextNoteIndexes: Array<number>;
  currentlyPlayingNotes: Array<MidiNote>;
}

function updateMidiPlaying(playState: PlayState, deltaMs: number) {
  playState.timeMs += deltaMs;

  // release pitches
  for (let i = 0; i < playState.currentlyPlayingNotes.length;) {
    const note = playState.currentlyPlayingNotes[i];
    const noteEndTimeS = note.time + note.duration;
    const noteEndTimeMs = 1000 * noteEndTimeS;

    if (playState.timeMs > noteEndTimeMs) {
      AppModel.instance.pianoAudio.releaseKey(Pitch.createFromMidiNumber(note.midi));
      playState.currentlyPlayingNotes.splice(i, 1);
    } else {
      i++;
    }
  }

  let pitchesToPlay = new Array<[Pitch, number]>();

  // find pitches to play
  for (let trackIndex = 0; trackIndex < playState.midi.tracks.length; trackIndex++) {
    let track = playState.midi.tracks[trackIndex];
    let nextNoteIndex = playState.trackNextNoteIndexes[trackIndex];

    while ((nextNoteIndex < track.notes.length) && ((1000 * track.notes[nextNoteIndex].time) < playState.timeMs)) {
      pitchesToPlay.push([Pitch.createFromMidiNumber(track.notes[nextNoteIndex].midi), track.notes[nextNoteIndex].velocity]);
      playState.currentlyPlayingNotes.push(track.notes[nextNoteIndex]);
      nextNoteIndex++;
    }

    playState.trackNextNoteIndexes[trackIndex] = nextNoteIndex;
  }

  // play pitches
  AppModel.instance.pianoAudio.pressKeys(pitchesToPlay);
}

export const size = new Size2D(1024, 768);

export class MidiPlayerView extends React.Component<{}, {}> {
  public componentDidMount() {
    this.parseMidiFile();
  }

  public componentWillUnmount() {
    if (this.cancelPlayingFn) {
      this.cancelPlayingFn();
      this.cancelPlayingFn = undefined;
    }
  }

  public render(): JSX.Element {
    const pressedPitches = (this.playState !== undefined)
      ? this.playState.currentlyPlayingNotes
        .map(n => Pitch.createFromMidiNumber(n.midi))
      : [];
    const pressedPitchesStr = pressedPitches
      .map(p => p.toOneAccidentalAmbiguousString(false))
      .join(', ');
    const intervalsChordsScales = findIntervalsChordsScales(pressedPitches);

    const pianoMetrics = new PianoKeyboardMetrics(
      size.width,
      /*maxHeight*/ undefined,
      fullPianoLowestPitch,
      fullPianoHighestPitch
    );

    const pianoPosition = new Vector2D(0, size.height - pianoMetrics.getHeight());

    const msToPixelScale = 0.075;

    // TODO: variable tempo midi files
    const msPerBeat = (bpm: number): number => 60000 / bpm;

    const ticksToMs = (ticks: number): number => this.playState
      ? msPerBeat(this.playState.midi.header.tempos[0].bpm) * (ticks / this.playState.midi.header.ppq)
      : 0;

    const msToHeight = (ms: number): number => msToPixelScale * ms;
    const heightToMs = (height: number): number => height / msToPixelScale;

    const timeMsToY = (timeMs: number): number => pianoPosition.y - msToHeight(timeMs);
    const yToTimeMs = (y: number): number => heightToMs(pianoPosition.y - y);

    const renderNoteContainer = (): JSX.Element | null => {
      if (this.playState === undefined) { return null; }

      const noteContainer = (
        <g transform={getTranslateTransformString(new Vector2D(0, msToHeight(this.playState.timeMs)))}>
          {renderNoteBars()}
          {renderKeyIndicators()}
        </g>
      );
      
      return noteContainer;
    }

    const renderKeyIndicators = (): JSX.Element[] | null => {
      if (this.playState === undefined) { return null; }
      if (this.analysis === undefined) { return null; }

      let keyIndicators = new Array<JSX.Element>();

      for (const detectedKey of this.analysis.keys) {
        const y = timeMsToY(ticksToMs(detectedKey.tickRange.minValue));
        keyIndicators.push(
          <g>
            <text x={0} y={y - 5}>{detectedKey.key.toString()}</text>
            <line x1={0} y1={y} x2={size.width} y2={y} stroke="#000" strokeWidth="2" />
          </g>
        );
      }

      return keyIndicators;
    };

    const renderNoteBars = (): JSX.Element[] | null => {
      if (this.playState === undefined) { return null; }
      if (this.analysis === undefined) { return null; }

      const minTimeMs = this.playState.timeMs + yToTimeMs(pianoPosition.y);
      const maxTimeMs = this.playState.timeMs + yToTimeMs(0);

      let noteBars = new Array<JSX.Element>();

      for (const track of this.playState.midi.tracks) {
        for (const note of track.notes) {
          const noteStartTimeMs = 1000 * note.time;
          const noteDurationMs = 1000 * note.duration;
          const noteEndTimeMs = noteStartTimeMs + noteDurationMs;

          const isNoteVisible = (noteStartTimeMs < maxTimeMs) && (noteEndTimeMs > minTimeMs);
          if (!isNoteVisible) {
            continue;
          }

          const pitch = Pitch.createFromMidiNumber(note.midi);
          const pianoKeyRect = pianoMetrics.getKeyRect(pitch);

          const noteBarSize = new Size2D(pianoKeyRect.size.width, msToHeight(noteDurationMs));
          const noteBarRect = new Rect2D(
            noteBarSize,
            new Vector2D(pianoKeyRect.left, timeMsToY(noteEndTimeMs))
          );

          const detectedKey = getDetectedKeyAtTicks(this.analysis, note.ticks);

          noteBars.push((
            <g>
              <rect
                x={noteBarRect.left} y={noteBarRect.top}
                width={noteBarRect.size.width} height={noteBarRect.size.height}
                fill="green">
              </rect>
              {(detectedKey !== undefined)
                ? (<text x={noteBarRect.left + 3} y={noteBarRect.bottom - 6}>{detectedKey.getPitchClassScaleDegree(pitch.class).toString()}</text>)
                : null}
            </g>
          ));
        }
      }

      return noteBars;
    };
    
    return (
      <div style={{ height: "100%", textAlign: "center" }}>
        <div>
          {this.playState
            ? <Button onClick={() => this.playState ? this.resetPlayStateToBeginning(this.playState) : undefined}><SkipPreviousIcon /></Button>
            : null}

          {(this.playState && !this.playState.isPlaying)
            ? <Button onClick={() => this.play()}><PlayArrowIcon /></Button>
            : null}
            
          {(this.playState && this.playState.isPlaying)
            ? <Button onClick={() => this.pause()}><PauseIcon /></Button>
            : null}
        </div>

        <div style={{ height: "100%" }}>
          <svg
            width={size.width} height={size.height}
            //viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
            version="1.1" xmlns="http://www.w3.org/2000/svg"
            style={{ flexGrow: 1 }}
          >
            {renderNoteContainer()}
            <PianoKeyboard
              position={pianoPosition}
              maxWidth={size.width}
              lowestPitch={fullPianoLowestPitch}
              highestPitch={fullPianoHighestPitch}
              pressedPitches={pressedPitches} />
          </svg>
        </div>
      </div>
    );
  }

  private playState: PlayState | undefined = undefined;
  private analysis: MidiNotesAnalysis | undefined = undefined;
  private cancelPlayingFn: (() => void) | undefined = undefined;

  private async parseMidiFile() {
    //const midi = await Midi.fromUrl(testMidiFile1);
    const midi = createAnalysisTestMidi();
    await this.prepareToPlay(midi);
  }

  private async prepareToPlay(midi: Midi) {
    await AppModel.instance.pianoAudio.preloadSounds();
    this.playState = this.createPlayState(midi);
    this.analysis = analyzeMidiNotes(midi);

    this.forceUpdate();
  }

  private createPlayState(midi: Midi): PlayState {
    const playState = {
      isPlaying: false,
      midi: midi,
      timeMs: 0,
      trackNextNoteIndexes: midi.tracks.map(t => 0),
      currentlyPlayingNotes: []
    } as PlayState;

    return playState;
  }

  private resetPlayStateToBeginning(playState: PlayState) {
    playState.timeMs = 0;
    playState.trackNextNoteIndexes = playState.midi.tracks.map(t => 0);
    playState.currentlyPlayingNotes = [];

    AppModel.instance.pianoAudio.releaseAllKeys();

    this.forceUpdate();
  }

  private play() {
    if (!this.playState) { return; }

    this.playState.isPlaying = true;

    this.cancelPlayingFn = runUpdateLoop((deltaMs) => {
      updateMidiPlaying(unwrapValueOrUndefined(this.playState), deltaMs);
      this.forceUpdate();
    });
  }

  private pause() {
    if (!this.playState) { return; }

    this.playState.isPlaying = false;

    this.forceUpdate();

    if (this.cancelPlayingFn) {
      this.cancelPlayingFn();
      this.cancelPlayingFn = undefined;
    }
  }

  private getIntervalsString(intervals: Array<Interval>) {
    switch (intervals.length) {
      case 1:
        return intervals[0].toString();
      case 2:
        return `${intervals[0].toString()} (inverted: ${intervals[1].toString()})`;
      default:
        return "";
    }
  }
}