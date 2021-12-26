import * as React from "react";
import { Chord, } from '../../lib/TheoryLib/Chord';
import { PitchesAudioPlayer, PitchesAudioPlayerExports } from './PitchesAudioPlayer';

export interface IChordAudioPlayerProps {
  chord: Chord;
  onGetExports?: (exports: PitchesAudioPlayerExports) => void;
}
export class ChordAudioPlayer extends React.Component<IChordAudioPlayerProps, {}> {
  public render(): JSX.Element {
    const pitches = this.props.chord.getPitchClasses();
    return <PitchesAudioPlayer pitches={pitches} playSequentially={false} />;
  }
}