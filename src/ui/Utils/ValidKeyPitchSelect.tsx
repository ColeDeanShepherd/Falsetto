import * as React from "react";

import { Pitch } from '../../lib/TheoryLib/Pitch';
import { pitchLetters } from '../../lib/TheoryLib/PitchLetter';
import { toggleArrayElementCustomEquals } from '../../lib/Core/ArrayUtils';
import { Button } from "../../ui/Button/Button";

const basePitches = getValidKeyPitches(/*preferredOctaveNumber*/ 0);
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

    let newValue: Array<Pitch>;

    if (!this.props.isMultiSelect) {
      newValue = [pitch];
    } else {
      newValue = toggleArrayElementCustomEquals(
        this.props.value,
        createPitch(
          pitch.letter, pitch.signedAccidental,
          pitch.octaveNumber + this.props.preferredOctaveNumber
        ),
        (a, b) => a.equalsNoOctave(b)
      );
    }

    this.props.onChange(newValue);
  }
}