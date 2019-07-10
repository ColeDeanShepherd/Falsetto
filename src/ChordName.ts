import * as Utils from "./Utils";
import { ChordQuality, chordQualityToString } from './ChordQuality';
import { ChordType } from './Chord';

export class ChordName {
  public constructor(
    public quality: ChordQuality,
    public extension: number | null,
    public alterations: Array<string>
  ) {}

  public toString(): string {
    let nameParts = new Array<string>();

    nameParts.push(chordQualityToString(this.quality));
    
    if ((this.extension !== null) && (this.extension > 5)) {
      nameParts.push(`${this.extension.toString()}th`);
    }
    
    if (this.alterations.length > 0) {
      nameParts.push(this.alterations.join());
    }

    return nameParts.join(" ");
  }
}

export function generateChordNames(pitchIntegers: Set<number>): Array<string> {
  // universal preconditions
  Utils.precondition(pitchIntegers.size > 0);
  Utils.precondition(pitchIntegers.has(0));

  const chordNames = new Array<string>();
  let minPitchCount: number | null = null;

  for (const chordType of ChordType.AllByNumNotesDescending) {
    if ((minPitchCount !== null) && (chordType.pitchCount < minPitchCount)) {
      break;
    }

    const alterations = chordType.matchPitchIntegers(pitchIntegers);
    if (alterations !== null) {
      const alterationsString = (alterations.length > 0) ? (" " + alterations.join("")) : "";
      chordNames.push(chordType.symbols[0] + alterationsString);
      
      minPitchCount = chordType.pitchCount;
    }
  }

  return chordNames;
}