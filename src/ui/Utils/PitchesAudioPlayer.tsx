import * as React from "react";
import { CircularProgress } from "@material-ui/core";

import { areArraysEqualComparer } from "../../lib/Core/ArrayUtils";
import * as Audio from "../../Audio/Audio";
import { Pitch } from '../../lib/TheoryLib/Pitch';
import { unwrapMaybe } from '../../lib/Core/Utils';
import { IPitchesAudio } from '../../Audio/IPitchesAudio';
import { PianoPitchesAudio } from '../../Audio/PianoAudio';
import { Button } from "../../ui/Button/Button";

export enum PitchesAudioPlayerPlayState {
  PLAYABLE,
  LOADING
}

export class PitchesAudioPlayerExports {
  public constructor(
    public stopPlayingFn: () => void
  ) {}
}

export interface IPitchesAudioPlayerProps {
  pitches: Array<Pitch>;
  playSequentially: boolean;
  delayInMs?: number;
  cutOffSounds?: boolean;
  pitchesAudio?: IPitchesAudio
  onGetExports?: (exports: PitchesAudioPlayerExports) => void;
}

export interface IPitchesAudioPlayerState {
  playState: PitchesAudioPlayerPlayState;
}

export class PitchesAudioPlayer extends React.Component<IPitchesAudioPlayerProps, IPitchesAudioPlayerState> {
  public constructor(props: IPitchesAudioPlayerProps) {
    super(props);

    this.state = {
      playState: PitchesAudioPlayerPlayState.PLAYABLE
    };

    this.loadSoundsPromise = null;
    this.loadedSounds = null;
    this.cancelPlayingFn = null;

    if (props.onGetExports) {
      props.onGetExports(new PitchesAudioPlayerExports(() => this.stopSounds()));
    }
  }
  public render(): JSX.Element {
    const buttonStyle: any = { textTransform: "none" };

    switch (this.state.playState) {
      case PitchesAudioPlayerPlayState.PLAYABLE:
        return (
          <Button onClick={e => this.loadAndPlay()} style={buttonStyle}>
            <span>{this.props.children ? this.props.children : <i className="material-icons" style={{ verticalAlign: "middle" }}>play_arrow</i>}</span>
          </Button>
        );
      case PitchesAudioPlayerPlayState.LOADING:
        return (
          <Button style={buttonStyle}>
            <CircularProgress size={20} disableShrink={true} />
          </Button>
        );
    }
  }
  public componentDidUpdate(
    prevProps: IPitchesAudioPlayerProps,
    prevState: IPitchesAudioPlayerState) {
    if (!areArraysEqualComparer(this.props.pitches, prevProps.pitches, (p1, p2) => p1.equals(p2))) {
      this.stopSounds();
      this.loadSoundsPromise = null;
      this.loadedSounds = null;
      this.setState({ playState: PitchesAudioPlayerPlayState.PLAYABLE });
    }
  }

  private loadSoundsPromise: Promise<Howl[]> | null;
  private loadedSounds: Howl[] | null;
  private cancelPlayingFn: (() => void) | null;

  private loadAndPlay() {
    if (this.state.playState !== PitchesAudioPlayerPlayState.PLAYABLE) {
      return;
    }

    if ((this.loadedSounds === null) && (this.loadSoundsPromise === null)) {
      this.startLoadingSounds();
    } else if (this.loadedSounds !== null) {
      this.playLoadedSounds();
    } // else we are currently loading the sounds
  }
  private startLoadingSounds() {
    const pitchesAudio = this.props.pitchesAudio
      ? this.props.pitchesAudio
      : PianoPitchesAudio;

    this.setState({ playState: PitchesAudioPlayerPlayState.LOADING });

    const soundFilePaths = this.props.pitches
      .map(p => pitchesAudio.getAudioFilePath(p))
      .filter(sfp => sfp !== undefined)
      .map(sfp => sfp as string);
    this.loadSoundsPromise = Audio.loadSoundsAsync(soundFilePaths)
      .then(loadedSounds => {
        this.loadedSounds = loadedSounds;
        this.loadSoundsPromise = null;

        this.playLoadedSounds();

        return loadedSounds;
      });
  }
  private playLoadedSounds() {
    this.setState({ playState: PitchesAudioPlayerPlayState.PLAYABLE }, () => {
      this.stopSounds();

      const loadedSounds = unwrapMaybe(this.loadedSounds);

      if (!this.props.playSequentially) {
        for (const sound of unwrapMaybe(loadedSounds)) {
          sound.play();
        }
  
        this.cancelPlayingFn = () => {
          for (const sound of unwrapMaybe(loadedSounds)) {
            sound.stop();
          }
        };
      } else {
        const delayInMs = (this.props.delayInMs !== undefined) ? this.props.delayInMs : 500;
        const cutOffSounds = (this.props.cutOffSounds !== undefined) ? this.props.cutOffSounds : true;
        this.cancelPlayingFn = Audio.playSoundsSequentially(loadedSounds, delayInMs, cutOffSounds);
      }
    });
  }
  private stopSounds() {
    if (!this.loadedSounds || !this.cancelPlayingFn) { return; }

    this.cancelPlayingFn();
  }
}