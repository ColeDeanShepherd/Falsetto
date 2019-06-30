import * as React from "react";

import { Pitch } from '../Pitch';
import { ScaleType } from '../Scale';
import { PitchesAudioPlayer, PitchesAudioPlayerExports } from './PitchesAudioPlayer';

export interface IScaleAudioPlayerProps {
  scale: ScaleType;
  rootPitch: Pitch;
  pitchCount?: number;
  onGetExports?: (exports: PitchesAudioPlayerExports) => void;
}
export class ScaleAudioPlayer extends React.Component<IScaleAudioPlayerProps, {}> {
  public render(): JSX.Element {
    let pitches = this.props.scale.getPitches(this.props.rootPitch);
    
    if ((this.props.pitchCount !== undefined) && (this.props.pitchCount !== pitches.length)) {
      const newPitches = new Array<Pitch>(this.props.pitchCount);
      for (let i = 0; i < newPitches.length; i++) {
        const deltaOctaveNumber = Math.floor(i / pitches.length)
        const basePitch = pitches[i % (pitches.length)];
        newPitches[i] = new Pitch(
          basePitch.letter,
          basePitch.signedAccidental,
          basePitch.octaveNumber + deltaOctaveNumber
        );
      }

      pitches = newPitches
    } else {
      pitches = pitches.concat(
        new Pitch(
          this.props.rootPitch.letter,
          this.props.rootPitch.signedAccidental,
          this.props.rootPitch.octaveNumber + 1
        )
      );
    }

    return <PitchesAudioPlayer pitches={pitches} playSequentially={true} />;
  }
}