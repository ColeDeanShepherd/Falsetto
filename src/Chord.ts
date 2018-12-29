import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { Interval } from "./Interval";
import { VerticalDirection } from './VerticalDirection';
import { PitchLetter } from './PitchLetter';

export class Chord {
  public static fromPitchAndFormulaString(pitch: Pitch, formulaString: string): Chord {
    Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

    const pitches = formulaString.split(" ")
      .map(scaleDegree => {
        let signedAccidental: number;
        if (scaleDegree[0] === "#") {
          signedAccidental = 1;
        } else if (scaleDegree[0] === "b") {
          signedAccidental = -1;
        } else {
          signedAccidental = 0;
        }

        const degreeNumberString = (signedAccidental === 0)
          ? scaleDegree
          : scaleDegree.substring(1);
        const degreeNumber = parseInt(degreeNumberString, 10);
        const interval = new Interval(degreeNumber, signedAccidental);
        return Pitch.addInterval(pitch, VerticalDirection.Up, interval);
      });
    return new Chord(pitches);
  }
  public constructor(public pitches: Array<Pitch>) {
    Utils.invariant(this.pitches.length > 1);
  }

  public toPitchString(): string {
    return this.pitches
      .map(p => p.toString(false))
      .join(" ");
  }
}