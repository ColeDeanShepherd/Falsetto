import * as Utils from "./Utils";
import { ChordQuality, chordQualityToString, isAugmentedChordQuality, isDiminishedChordQuality } from './ChordQuality';
import { getAccidentalString } from './Pitch';

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

class ChordNoteSignedAccidentals {
  public first: number | null = null;
  public third: number | null = null;
  public fifth: number | null = null;
  public seventh: number | null = null;
  public ninth: number | null = null;
  public eleventh: number | null = null;
  public thirteenth: number | null = null;

  public get impliedThird(): number {
    return (this.third !== null) ? this.third : 0;
  }
  public get impliedFifth(): number {
    return (this.fifth !== null) ? this.fifth : 0;
  }
}
export function getChordNoteSignedAccidentals(pitchIntegers: Array<number>): ChordNoteSignedAccidentals {
  let signedAccidentals = new ChordNoteSignedAccidentals();

  for (const pitchInteger of pitchIntegers) {
    switch (pitchInteger) {
      case 0:
        signedAccidentals.first = 0;
        break;
      case 1:
        if (signedAccidentals.ninth === null) {
          signedAccidentals.ninth = -1;
        }
        break;
      case 2:
        signedAccidentals.ninth = 0;
        break;
      case 3:
        if (signedAccidentals.third === null) {
          signedAccidentals.third = -1;
        }
        break;
      case 4:
        signedAccidentals.third = 0;
        break;
      case 5:
        signedAccidentals.eleventh = 0;
        break;
      case 6:
        if (signedAccidentals.fifth === null) {
          signedAccidentals.fifth = -1;
        }
        break;
      case 7:
        signedAccidentals.fifth = 0;
        break;
      case 8:
        if (signedAccidentals.fifth === null) {
          signedAccidentals.fifth = 1;
        }
        break;
      case 9:
        signedAccidentals.thirteenth = 0;
        break;
      case 10:
        if (signedAccidentals.seventh === null) {
          signedAccidentals.seventh = -1;
        }
        break;
      case 11:
        signedAccidentals.seventh = 0;
        break;
      default:
        throw new Error(`Unknown pitch integer: ${pitchInteger}`);
    }
  }

  // validate
  if (signedAccidentals.thirteenth !== null) {
    if (!((signedAccidentals.thirteenth === 0) || (signedAccidentals.thirteenth === -1))) {
      throw new Error(`Invalid chord 13th signed accidental: ${signedAccidentals.thirteenth}`);
    }
  }
  if (signedAccidentals.eleventh !== null) {
    if (!((signedAccidentals.eleventh === 0) || (signedAccidentals.eleventh === 1))) {
      throw new Error(`Invalid chord 11th signed accidental: ${signedAccidentals.eleventh}`);
    }
  }
  if (signedAccidentals.ninth !== null) {
    if (!((signedAccidentals.ninth >= -1) && (signedAccidentals.ninth <= 1))) {
      throw new Error(`Invalid chord 9th signed accidental: ${signedAccidentals.ninth}`);
    }
  }
  if (signedAccidentals.seventh !== null) {
    if (!((signedAccidentals.seventh >= -2) && (signedAccidentals.seventh <= 0))) {
      throw new Error(`Invalid chord 7th signed accidental: ${signedAccidentals.seventh}`);
    }
  }
  if (signedAccidentals.fifth !== null) {
    if (!((signedAccidentals.fifth >= -1) && (signedAccidentals.fifth <= 1))) {
      throw new Error(`Invalid chord 5th signed accidental: ${signedAccidentals.fifth}`);
    }
  }
  if (signedAccidentals.third !== null) {
    if (!((signedAccidentals.third === 0) || (signedAccidentals.third === -1))) {
      throw new Error(`Invalid chord 3rd signed accidental: ${signedAccidentals.third}`);
    }
  }

  return signedAccidentals;
}
export function getChordExtension(signedAccidentals: ChordNoteSignedAccidentals): number | null {
  if (signedAccidentals.seventh !== null) {
    if (signedAccidentals.thirteenth !== null) {
      return 13;
    } else if (signedAccidentals.eleventh !== null) {
      return 11;
    } else if (signedAccidentals.ninth !== null) {
      return 9;
    } else {
      return 7;
    }
  } else if (signedAccidentals.fifth !== null) {
    if (signedAccidentals.thirteenth === null) {
      return 5;
    } else if (signedAccidentals.thirteenth === 0) {
      return 6;
    }
  }
  
  return null;
}
export function getPossibleChordQualities(signedAccidentals: ChordNoteSignedAccidentals, extension: number | null): ChordQuality | null {
  const _3 = (signedAccidentals.third === 0) || ((signedAccidentals.third === null) && (extension != null) && (extension >= 11));
  const _b3 = signedAccidentals.third === -1;

  const _5 = (signedAccidentals.fifth === 0) || ((extension !== null) && (signedAccidentals.fifth === null));
  const _b5 = signedAccidentals.fifth === -1;
  const _s5 = signedAccidentals.fifth === 1;

  const _7 = ((signedAccidentals.seventh === 0) || (signedAccidentals.seventh === null)) && ((signedAccidentals.thirteenth === 0) || (signedAccidentals.thirteenth === null));
  const _b7 = (signedAccidentals.seventh === -1) || (signedAccidentals.seventh === null) && ((signedAccidentals.thirteenth === 0) || (signedAccidentals.thirteenth === null));
  const _bb7 = (signedAccidentals.seventh === null) && ((signedAccidentals.thirteenth === 0) || (signedAccidentals.thirteenth === null));
  
  if (_3 && _s5 && _b7) { return ChordQuality.Augmented; }
  if (_3 && _5 && _7) { return ChordQuality.Major; }
  if (_b3 && _5 && _b7) { return ChordQuality.Minor; }
  if (_b3 && _b5 && _bb7) { console.log(extension); return ChordQuality.Diminished; }

  if ((extension !== null) && (extension >= 7)) {
    if (_3 && _s5 && _7) { return ChordQuality.AugmentedMajor; }
    if (_3 && _5 && _b7) { return ChordQuality.Dominant; }
    if (_b3 && _5 && _7) { return ChordQuality.MinorMajor; }
    if (_b3 && _b5 && _7) { return ChordQuality.DiminishedMajor; }
    if (_b3 && _b5 && _b7) { return ChordQuality.HalfDiminished; }
  }

  return null;
}
export function getChordAlterations(signedAccidentals: ChordNoteSignedAccidentals, quality: ChordQuality, extension: number | null): Array<string> {
  const alterations = new Array<string>();

    // sharpened/flattened notes
    if ((signedAccidentals.fifth !== null) && !isAugmentedChordQuality(quality) && !isDiminishedChordQuality(quality)) {
      if (signedAccidentals.fifth > 0) {
        alterations.push("#5");
      } else if (signedAccidentals.fifth < 0) {
        alterations.push("b5");
      }
    }

    if ((signedAccidentals.ninth !== null) && (signedAccidentals.ninth !== 0)) {
      alterations.push(getAccidentalString(signedAccidentals.ninth) + "9");
    }
    
    if ((signedAccidentals.eleventh !== null) && (signedAccidentals.eleventh !== 0)) {
      alterations.push(getAccidentalString(signedAccidentals.eleventh) + "11");
    }
    
    if ((signedAccidentals.thirteenth !== null) && (signedAccidentals.thirteenth !== 0)) {
      alterations.push(getAccidentalString(signedAccidentals.thirteenth) + "13");
    }

    // sus2/sus4
    if ((extension === 5) && (signedAccidentals.third === null)) {
      if (signedAccidentals.ninth === 0) {
        alterations.push("sus2");
      } else if (signedAccidentals.eleventh === 0) {
        alterations.push("sus4");
      }
    }

    // add
    if ((extension === 5) || (extension === 6)) {
      // TODO: support multiple adds
      if (signedAccidentals.ninth !== null) {
        alterations.push(`add${getAccidentalString(signedAccidentals.ninth)}9`);
      }
      
      if (signedAccidentals.eleventh !== null) {
        alterations.push(`add${getAccidentalString(signedAccidentals.eleventh)}11`);
      }
      
      if (signedAccidentals.thirteenth !== null) {
        alterations.push(`add${getAccidentalString(signedAccidentals.thirteenth)}13`);
      }
    }

    // dropped notes
    if (extension === 13) {
      // no 3
      // no 5
      // no 9
      // no 11
    } else if (extension === 11) {
      // no 3
      // no 5
      // no 9
    } else if (extension === 9) {
      // no 3?
      // no 5
    } else if (extension === 7) {

      // no 3?
      // no 5
    }

    return alterations;
}
export function generateChordNames(pitchIntegers: Array<number>): Array<ChordName> {
  // universal preconditions
  Utils.precondition(pitchIntegers.length > 0);
  Utils.precondition(pitchIntegers[0] === 0);

  // special cases
  if (Utils.areArraysEqual(pitchIntegers, [0, 7])) {
    return [new ChordName(ChordQuality.Power, null, [])];
  }

  if (Utils.areArraysEqual(pitchIntegers, [0, 5, 10]) || Utils.areArraysEqual(pitchIntegers, [0, 3, 5, 10])) {
    return [new ChordName(ChordQuality.Quartal, null, [])];
  }

  // general-case preconditions
  if (pitchIntegers.length < 3) {
    return [];
  }

  // body
  const signedAccidentals = getChordNoteSignedAccidentals(pitchIntegers);
  const extension = getChordExtension(signedAccidentals);
  if (extension === null) {
    return [];
  }

  const quality = getPossibleChordQualities(signedAccidentals, extension);

  if (quality === null) {
    return [];
  }
  
  const alterations = getChordAlterations(signedAccidentals, quality, extension);
  return [new ChordName(quality, extension, alterations)];
}