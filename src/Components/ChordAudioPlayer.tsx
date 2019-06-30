import * as React from "react";

import { Pitch } from '../Pitch';
import { Chord, ChordType } from '../Chord';
import { PitchesAudioPlayer, PitchesAudioPlayerExports } from './PitchesAudioPlayer';

export interface IChordAudioPlayerProps {
  chordType: ChordType;
  rootPitch: Pitch;
  onGetExports?: (exports: PitchesAudioPlayerExports) => void;
}
export class ChordAudioPlayer extends React.Component<IChordAudioPlayerProps, {}> {
  public render(): JSX.Element {
    const pitches = Chord.fromPitchAndFormulaString(
      this.props.rootPitch, this.props.chordType.formulaString
    ).pitches;

    return <PitchesAudioPlayer pitches={pitches} playSequentially={false} />;
  }
}