import { ChordQuality, chordQualityToString } from './ChordQuality';
import { ChordType } from './Chord';
import { Pitch } from './Pitch';
import { getAllModePitchIntegers } from './Scale';
import { precondition } from '../Core/Dbc';

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

export function generateChordNames(pitches: Array<Pitch>): Array<[Pitch, string]> {
  precondition(pitches.length > 0);
  
  const sortedPitches = pitches
    .slice()
    .sort((a, b) => (a.midiNumberNoOctave < b.midiNumberNoOctave) ? -1 : 1);
  const basePitchIntegers = sortedPitches
    .map(p => p.midiNumberNoOctave - sortedPitches[0].midiNumberNoOctave);
  const allPitchIntegers = getAllModePitchIntegers(basePitchIntegers);

  let chordNames = new Array<[Pitch, string]>();
  let minPitchCount: number | null = null;
  let maxAlterationCount = 9999;

  for (let i = 0; i < allPitchIntegers.length; i++) {
    const pitchIntegers = new Set<number>(allPitchIntegers[i]);

    for (const chordType of ChordType.AllByNumNotesDescending) {
      if ((minPitchCount !== null) && (chordType.pitchCount < minPitchCount)) {
        break;
      }

      const alterations = chordType.matchPitchIntegers(pitchIntegers);
      if ((alterations === null) || (alterations.length > maxAlterationCount)) {
        continue;
      }

      if (alterations.length < maxAlterationCount) {
        chordNames = [];
        maxAlterationCount = alterations.length;
      }

      const alterationsString = (alterations.length > 0) ? (" " + alterations.join("")) : "";
      chordNames.push([sortedPitches[i], chordType.symbols[0] + alterationsString]);
      
      minPitchCount = chordType.pitchCount;
    }
  }

  return chordNames;
}