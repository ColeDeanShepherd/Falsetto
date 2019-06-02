import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { getIntervalsFromFormulaString } from './Scale';

export class Chord {
  public static PowerFormulaString = "1 5";

  public static MajorTriadFormulaString = "1 3 5";
  public static MinorTriadFormulaString = "1 b3 5";
  public static DiminishedTriadFormulaString = "1 b3 b5";
  public static AugmentedTriadFormulaString = "1 3 #5";

  public static Sus2FormulaString = "1 2 5";
  public static Sus4FormulaString = "1 4 5";

  public static SixthFormulaString = "1 3 5 6";
  public static Min6FormulaString = "1 b3 5 6";

  public static Maj7FormulaString = "1 3 5 7";
  public static Dom7FormulaString = "1 3 5 b7";
  public static Min7FormulaString = "1 b3 5 b7";
  public static MinMaj7FormulaString = "1 b3 5 7";
  public static Dim7FormulaString = "1 b3 b5 bb7";
  public static HalfDiminishedFormulaString = "1 b3 b5 b7";
  public static Aug7FormulaString = "1 3 #5 b7";
  public static AugM7FormulaString = "1 3 #5 7";
  public static MMaj7FormulaString = "1 b3 5 7";

  public static QuartalFormulaString = "1 4 b7";

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
  { type: "major", formulaString: Chord.MajorTriadFormulaString },
  { type: "minor", formulaString: Chord.MinorTriadFormulaString },
  { type: "diminished", formulaString: Chord.DiminishedTriadFormulaString },
  { type: "augmented", formulaString: Chord.AugmentedTriadFormulaString }
];
export const seventhChords = [
  { type: "Maj7", formulaString: Chord.Maj7FormulaString },
  { type: "7", formulaString: Chord.Dom7FormulaString},
  { type: "m7", formulaString: Chord.Min7FormulaString },
  { type: "minMaj7", formulaString: Chord.MinMaj7FormulaString },
  { type: "dim7", formulaString: Chord.Dim7FormulaString },
  { type: "m7b5", formulaString: Chord.HalfDiminishedFormulaString },
  { type: "aug7", formulaString: Chord.Aug7FormulaString },
  { type: "augM7", formulaString: Chord.AugM7FormulaString },
];
export const allChords = [
  { type: "power", formulaString: Chord.PowerFormulaString },

  { type: "major", formulaString: Chord.MajorTriadFormulaString },
  { type: "minor", formulaString: Chord.MinorTriadFormulaString },
  { type: "diminished", formulaString: Chord.DiminishedTriadFormulaString },
  { type: "augmented", formulaString: Chord.AugmentedTriadFormulaString },

  { type: "sus2", formulaString: Chord.Sus2FormulaString },
  { type: "sus4", formulaString: Chord.Sus4FormulaString },
  
  { type: "quartal", formulaString: Chord.QuartalFormulaString },

  { type: "6", formulaString: Chord.SixthFormulaString },
  { type: "m6", formulaString: Chord.Min6FormulaString },

  { type: "Maj7", formulaString: Chord.Maj7FormulaString },
  { type: "7", formulaString: Chord.Dom7FormulaString },
  { type: "m7", formulaString: Chord.Min7FormulaString },
  { type: "mMaj7", formulaString: Chord.MMaj7FormulaString },
  { type: "dim7", formulaString: Chord.Dim7FormulaString },
  { type: "m7b5", formulaString: Chord.HalfDiminishedFormulaString },
  { type: "aug7", formulaString: Chord.Aug7FormulaString },
  { type: "Maj7#5", formulaString: Chord.AugM7FormulaString }
];