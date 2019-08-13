import * as React from "react";

import { Pitch } from '../../Pitch';
import { Scale } from '../../Scale';
import { PitchesAudioPlayer, PitchesAudioPlayerExports } from './PitchesAudioPlayer';

export interface IScaleAudioPlayerProps {
  scale: Scale;
  pitchCount?: number;
  onGetExports?: (exports: PitchesAudioPlayerExports) => void;
}
export class ScaleAudioPlayer extends React.Component<IScaleAudioPlayerProps, {}> {
  public render(): JSX.Element {
    let pitches = this.props.scale.getPitches();
    
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
          this.props.scale.rootPitch.letter,
          this.props.scale.rootPitch.signedAccidental,
          this.props.scale.rootPitch.octaveNumber + 1
        )
      );
    }

    return <PitchesAudioPlayer pitches={pitches} playSequentially={true} />;
  }
}