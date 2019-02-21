import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { Interval } from "./Interval";
import { VerticalDirection } from "./VerticalDirection";

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

export const allChords = [
  { type: "power", formulaString: "1 5" },

  { type: "major", formulaString: "1 3 5" },
  { type: "minor", formulaString: "1 b3 5" },
  { type: "diminished", formulaString: "1 b3 b5" },
  { type: "augmented", formulaString: "1 3 #5" },
  { type: "sus2", formulaString: "1 2 5" },
  { type: "sus4", formulaString: "1 4 5" },

  { type: "6", formulaString: "1 3 5 6" },
  { type: "m6", formulaString: "1 b3 5 6" },

  { type: "Maj7", formulaString: "1 3 5 7" },
  { type: "7", formulaString: "1 3 5 b7" },
  { type: "m7", formulaString: "1 b3 5 b7" },
  { type: "mMaj7", formulaString: "1 b3 5 7" },
  { type: "dim7", formulaString: "1 b3 b5 bb7" },
  { type: "m7b5", formulaString: "1 b3 b5 b7" },
  { type: "aug7", formulaString: "1 3 #5 b7" },
  { type: "Maj7#5", formulaString: "1 3 #5 7" },

  { type: "lydian", formulaString: "1 #4 5" },
  { type: "sus4b5", formulaString: "1 4 5b" },
  { type: "phrygian", formulaString: "1 b2 5" },
  { type: "quartal", formulaString: "1 4 b7" }
];