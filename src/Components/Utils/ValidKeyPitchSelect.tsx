import * as React from "react";

import * as Utils from "../../Utils";
import { getValidKeyPitches } from '../../Key';
import { Pitch } from '../../Pitch';
import { pitchLetters } from '../../PitchLetter';
import { Button } from '@material-ui/core';

const basePitches = getValidKeyPitches(0);
const validSharpKeyPitches = pitchLetters
  .map(pitchLetter => {
    const basePitch = basePitches.find(
      bp => (bp.letter === pitchLetter) && (bp.signedAccidental === 1)
    );
    return (basePitch !== undefined) ? basePitch : null;
  });
const validNaturalKeyPitches = basePitches
  .filter(bp => bp.signedAccidental === 0);
const validFlatKeyPitches = pitchLetters
.map(pitchLetter => {
  const basePitch = basePitches.find(
    bp => (bp.letter === pitchLetter) && (bp.signedAccidental === -1)
  );
  return (basePitch !== undefined) ? basePitch : null;
});;

export interface IValidKeyPitchSelectProps {
  preferredOctaveNumber: number;
  value: Array<Pitch>;
  isMultiSelect?: boolean;
  onChange?: (newValue: Array<Pitch>) => void
}
export class ValidKeyPitchSelect extends React.Component<IValidKeyPitchSelectProps, {}> {
  public render(): JSX.Element {
    return (
      <div>
        {this.renderPitchRow(validSharpKeyPitches)}
        {this.renderPitchRow(validNaturalKeyPitches)}
        {this.renderPitchRow(validFlatKeyPitches)}
      </div>
    );
  }

  private renderPitchRow(pitches: Array<Pitch | null>): JSX.Element {
    return (
      <div>
        {pitches.map(pitch => {
          const style: any = { textTransform: "none" };

          if (!pitch) {
            style.visibility = "hidden";
            return <Button
              variant="contained"
              style={style}
            />;
          }
          
          const isPressed = this.props.value.some(p => p.equalsNoOctave(pitch));
          if (isPressed) {
            style.backgroundColor = "#959595";
          }

          return (
            <Button
              onClick={event => this.onPitchClick(pitch)}
              variant="contained"
              style={style}>
              {pitch.toString(false)}
            </Button>
          );
        })}
      </div>
    );
  }

  private onPitchClick(pitch: Pitch) {
    if (!this.props.onChange) { return; }

    const newValue = Utils.toggleArrayElementCustomEquals(
      this.props.value,
      new Pitch(
        pitch.letter, pitch.signedAccidental,
        pitch.octaveNumber + this.props.preferredOctaveNumber
      ),
      (a, b) => a.equalsNoOctave(b)
    );
    if ((newValue.length !== 1) && !this.props.isMultiSelect) { return; }

    this.props.onChange(newValue);
  }
}