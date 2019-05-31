import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { getIntervalsFromFormulaString } from './Scale';

export class Chord {
  public static fromPitchAndFormulaString(pitch: Pitch, formulaString: string): Chord {
    Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

    const intervals = getIntervalsFromFormulaString(formulaString);

    const pitches = intervals
      .map(interval => Pitch.addInterval(pitch, VerticalDirection.Up, interval));
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

export const basicTriads = [
  { type: "major", formulaString: "1 3 5" },
  { type: "minor", formulaString: "1 b3 5" },
  { type: "diminished", formulaString: "1 b3 b5" },
  { type: "augmented", formulaString: "1 3 #5" }
];
export const seventhChords = [
  { type: "Maj7", formulaString: "1 3 5 7" },
  { type: "7", formulaString: "1 3 5 b7" },
  { type: "m7", formulaString: "1 b3 5 b7" },
  { type: "minMaj7", formulaString: "1 b3 5 7" },
  { type: "dim7", formulaString: "1 b3 b5 bb7" },
  { type: "m7b5", formulaString: "1 b3 b5 b7" },
  { type: "aug7", formulaString: "1 3 #5 b7" },
  { type: "augM7", formulaString: "1 3 #5 7" },
];
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