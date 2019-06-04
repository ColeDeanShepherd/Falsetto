import * as React from "react";

import { Pitch } from '../Pitch';
import { Scale } from '../Scale';
import { PitchesAudioPlayer } from './PitchesAudioPlayer';

export interface IScaleAudioPlayerProps {
  scale: Scale;
  rootPitch: Pitch;
}
export class ScaleAudioPlayer extends React.Component<IScaleAudioPlayerProps, {}> {
  public render(): JSX.Element {
    const pitches = this.props.scale.getPitches(this.props.rootPitch)
      .concat(new Pitch(
        this.props.rootPitch.letter,
        this.props.rootPitch.signedAccidental,
        this.props.rootPitch.octaveNumber + 1));

    return <PitchesAudioPlayer pitches={pitches} playSequentially={true} />;
  }
}