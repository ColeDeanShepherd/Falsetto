import * as Utils from "./Utils";
import { Rational } from "./Rational";
import { TimeSignature } from "./TimeSignature";

export interface IRhythymNote {
  duration: Rational;
  isRest: boolean;
}

export class RhythymPlayer {
  public constructor(
    public timeSignature: TimeSignature,
    public rhythymNotes: IRhythymNote[],
    public beatsPerMinute: number,
    public onNotePlay: ((i: number) => void) | null
  ) {
    this.shouldLoop = false;
    this.timeStartedPlaying = null;
    this.lastPlayTimeInSeconds = null;
  }
  
  public get isPlaying(): boolean {
    return this.timeStartedPlaying !== null;
  }
  public get playTimeInSeconds(): number {
    return this.getPlayTimeInSeconds(window.performance.now());
  }
  public get currentNoteIndex(): number {
    return this.getCurrentNoteIndex(this.getPlayTimeInSeconds(window.performance.now())); // TODO: make sure this only updates after a playUpdate?
  }

  public play(shouldLoop: boolean) {
    this.shouldLoop = shouldLoop;
    this.timeStartedPlaying = window.performance.now();
    this.lastPlayTimeInSeconds = null;

    requestAnimationFrame(this.playUpdate.bind(this))
  }
  public stop() {
    this.timeStartedPlaying = null;
  }

  public getCurrentNoteIndex(playTimeInSeconds: number): number {
    const currentTimeInMeasures = playTimeInSeconds / this.getMeasureDurationInSeconds();

    let timeInMeasures = 0;
    let noteIndex = 0;

    while (noteIndex < this.rhythymNotes.length) {
      timeInMeasures += this.rhythymNotes[noteIndex].duration.asReal;
      if (currentTimeInMeasures >= timeInMeasures) {
        noteIndex++;
      } else {
        break;
      }
    }

    return noteIndex;
  }
  public getMeasureDurationInSeconds(): number {
    const beatsPerSecond = this.beatsPerMinute / 60;
    return this.timeSignature.numBeats / beatsPerSecond;
  }
  public getNoteStartTimeInSeconds(noteIndex: number): number {
    let noteOffsetInMeasures = 0;

    for (let i = 0; i < noteIndex; i++) {
      noteOffsetInMeasures += this.rhythymNotes[i].duration.asReal;
    }

    return noteOffsetInMeasures * this.getMeasureDurationInSeconds();
  }

  private shouldLoop: boolean;
  private timeStartedPlaying: number | null;
  private lastPlayTimeInSeconds: number | null;

  private playUpdate() {
    if (!this.isPlaying) { return; }

    const playTimeInSeconds = this.getPlayTimeInSeconds(window.performance.now());

    if (this.onNotePlay) {
      const triggeredNoteIndex = this.getTriggeredNoteIndex(playTimeInSeconds);
      if (triggeredNoteIndex !== null) {
        this.onNotePlay(triggeredNoteIndex);
      }
    }

    this.lastPlayTimeInSeconds = playTimeInSeconds;

    requestAnimationFrame(this.playUpdate.bind(this));
  }
  private getTriggeredNoteIndex(playTimeInSeconds: number): number | null {
    // If we just started playing or if we just looped:
    if ((this.lastPlayTimeInSeconds === null) || (this.lastPlayTimeInSeconds > playTimeInSeconds)) {
      return (this.rhythymNotes.length > 0) ? 0 : null;
    }

    const lastNoteIndex = this.getCurrentNoteIndex(this.lastPlayTimeInSeconds);
    const currentNoteIndex = this.getCurrentNoteIndex(playTimeInSeconds);

    return (currentNoteIndex !== lastNoteIndex) ? currentNoteIndex : null;
  }
  private getPlayTimeInSeconds(performanceNow: number): number {
    if (!this.isPlaying) {
      return 0;
    }

    let playTimeInSeconds = (performanceNow - Utils.unwrapMaybe(this.timeStartedPlaying)) / 1000;

    if (this.shouldLoop && (playTimeInSeconds > this.getMeasureDurationInSeconds())) {
      playTimeInSeconds = Utils.wrapReal(
        playTimeInSeconds, 0, this.getMeasureDurationInSeconds()
      );
    }

    return playTimeInSeconds;
  }
}