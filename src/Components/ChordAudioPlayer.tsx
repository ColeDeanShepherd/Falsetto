import * as React from "react";
import { Button, CircularProgress } from "@material-ui/core";

import * as Utils from "../Utils";
import * as Audio from "../Audio";
import { Chord, ChordType } from '../Chord';
import { getPitchAudioFilePath } from '../Piano';
import { Pitch } from '../Pitch';

export enum ChordAudioPlayerPlayState {
  PLAYABLE,
  LOADING
}

export interface IChordAudioPlayerProps {
  chordType: ChordType;
  rootPitch: Pitch;
}
export interface IChordAudioPlayerState {
  playState: ChordAudioPlayerPlayState;
}
export class ChordAudioPlayer extends React.Component<IChordAudioPlayerProps, IChordAudioPlayerState> {
  public constructor(props: IChordAudioPlayerProps) {
    super(props);

    this.state = {
      playState: ChordAudioPlayerPlayState.PLAYABLE
    };

    this.loadSoundsPromise = null;
    this.loadedSounds = null;
  }
  public render(): JSX.Element {
    const buttonStyle: any = { textTransform: "none" };

    switch (this.state.playState) {
      case ChordAudioPlayerPlayState.PLAYABLE:
        return (
          <Button variant="contained" onClick={e => this.loadAndPlay()} style={buttonStyle}>
            <span>{this.props.children ? this.props.children : <i className="material-icons">play_arrow</i>}</span>
          </Button>
        );
      case ChordAudioPlayerPlayState.LOADING:
        return (
          <Button variant="contained" style={buttonStyle}>
            <CircularProgress size={20} disableShrink={true} />
          </Button>
        );
    }
  }
  public componentDidUpdate(
    prevProps: IChordAudioPlayerProps,
    prevState: IChordAudioPlayerState) {
    if (!this.props.rootPitch.equals(prevProps.rootPitch) || !this.props.chordType.equals(prevProps.chordType)) {
      this.stopSounds();
      this.loadSoundsPromise = null;
      this.loadedSounds = null;
      this.setState({ playState: ChordAudioPlayerPlayState.PLAYABLE });
    }
  }

  private loadSoundsPromise: Promise<Howl[]> | null;
  private loadedSounds: Howl[] | null;

  private loadAndPlay() {
    if (this.state.playState !== ChordAudioPlayerPlayState.PLAYABLE) {
      return;
    }

    if ((this.loadedSounds === null) && (this.loadSoundsPromise === null)) {
      this.startLoadingSounds();
    } else if (this.loadedSounds !== null) {
      this.playLoadedSounds();
    } // else we are currently loading the sounds
  }
  private startLoadingSounds() {
    this.setState({ playState: ChordAudioPlayerPlayState.LOADING });

    const pitches = Chord.fromPitchAndFormulaString(this.props.rootPitch, this.props.chordType.formulaString)
      .pitches;
    const soundFilePaths = pitches
      .map(p => getPitchAudioFilePath(p))
      .filter(sfp => sfp !== null)
      .map(sfp => Utils.unwrapMaybe(sfp));
    this.loadSoundsPromise = Audio.loadSoundsAsync(soundFilePaths)
      .then(loadedSounds => {
        this.loadedSounds = loadedSounds;
        this.loadSoundsPromise = null;

        this.playLoadedSounds();

        return loadedSounds;
      });
  }
  private playLoadedSounds() {
    this.setState({ playState: ChordAudioPlayerPlayState.PLAYABLE }, () => {
      this.stopSounds();

      for (const sound of Utils.unwrapMaybe(this.loadedSounds)) {
        sound.play();
      }
    });
  }
  private stopSounds() {
    if (!this.loadedSounds) { return; }
    for (const sound of Utils.unwrapMaybe(this.loadedSounds)) {
      sound.stop();
    }
  }
}