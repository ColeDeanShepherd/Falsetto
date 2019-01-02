import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { Interval } from "./Interval";
import { VerticalDirection } from './VerticalDirection';

export class Chord {
  public static fromPitchAndFormulaString(pitch: Pitch, formulaString: string): Chord {
    Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

    const pitches = formulaString.split(" ")
      .map(scaleDegree => {
        const accidentalString = Utils.takeCharsWhile(scaleDegree, 0, c => (c === "#") || (c === "b"));

        let signedAccidental: number;
        if (accidentalString.length === 0) {
          signedAccidental = 0;
        } else if (scaleDegree[0] === "#") {
          signedAccidental = accidentalString.length;
        } else if (scaleDegree[0] === "b") {
          signedAccidental = -accidentalString.length;
        } else {
          throw new Error(`Invalid accidental character: ${scaleDegree[0]}`);
        }

        const degreeNumberString = scaleDegree.substring(accidentalString.length);
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