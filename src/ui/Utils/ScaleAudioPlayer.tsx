import * as React from "react";

import { Pitch } from '../../lib/TheoryLib/Pitch';
import { Scale } from '../../lib/TheoryLib/Scale';
import { PitchesAudioPlayer, PitchesAudioPlayerExports } from './PitchesAudioPlayer';
import { IPitchesAudio } from '../../Audio/IPitchesAudio';

export interface IScaleAudioPlayerProps {
  scale: Scale;
  pitchCount?: number;
  onGetExports?: (exports: PitchesAudioPlayerExports) => void;
  pitchesAudio?: IPitchesAudio;
}
export class ScaleAudioPlayer extends React.Component<IScaleAudioPlayerProps, {}> {
  public render(): JSX.Element {
    const { scale, pitchCount, pitchesAudio, onGetExports } = this.props;

    const pitches = this.getPitchesToPlay(scale.getPitches(), pitchCount);
    
    return <PitchesAudioPlayer
      pitches={pitches}
      playSequentially={true}
      pitchesAudio={pitchesAudio}
      onGetExports={onGetExports} />;
  }

  private getPitchesToPlay(scalePitches: Array<Pitch>, numPitchesToPlay: number | undefined): Array<Pitch> {
    // If there's a specified # of pitches to play, repeat the scale in higher octaves if necessary.
    if ((numPitchesToPlay !== undefined) && (numPitchesToPlay !== scalePitches.length)) {
      const newPitches = new Array<Pitch>(numPitchesToPlay);

      for (let i = 0; i < newPitches.length; i++) {
        const deltaOctaveNumber = Math.floor(i / scalePitches.length);
        const basePitch = scalePitches[i % (scalePitches.length)];
        newPitches[i] = new Pitch(
          basePitch.letter,
          basePitch.signedAccidental,
          basePitch.octaveNumber + deltaOctaveNumber
        );
      }

      return newPitches
    }
    // If there's not a specified # of pitches to play, just add the root note an octave higher.
    else {
      return scalePitches.concat(
        Pitch.addOctaves(scalePitches[0], 1)
      );
    }
  }
}