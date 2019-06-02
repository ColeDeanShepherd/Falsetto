import * as React from "react";
import { Button, CircularProgress } from "@material-ui/core";

import * as Utils from "../Utils";
import * as Audio from "../Audio";
import { Chord } from '../Chord';
import { getPitchAudioFilePath } from '../Piano';

export enum ChordAudioPlayerPlayState {
  PLAYABLE,
  LOADING
}

export interface IChordAudioPlayerProps {
  chord: Chord;
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
    switch (this.state.playState) {
      case ChordAudioPlayerPlayState.PLAYABLE:
        return (
          <Button variant="contained" onClick={e => this.loadAndPlay()}>
            {<i className="material-icons">play_arrow</i>}
          </Button>
        );
      case ChordAudioPlayerPlayState.LOADING:
        return (
          <Button variant="contained">
            <CircularProgress size={20} disableShrink={true} />
          </Button>
        );
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

    const pitches = this.props.chord.pitches;
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
      for (const sound of Utils.unwrapMaybe(this.loadedSounds)) {
        sound.stop();
        sound.play();
      }
    });
  }
}