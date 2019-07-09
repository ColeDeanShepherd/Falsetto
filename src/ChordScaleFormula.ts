import * as Utils from "./Utils";
import { Pitch, getAccidentalString } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { Interval } from './Interval';
import { getSimpleChordNoteNumber } from './Chord';
import { ChordName } from './ChordName';
import { ChordQuality, isAugmentedChordQuality, isDiminishedChordQuality } from './ChordQuality';

export class ChordScaleFormula {
  public static parse(formulaString: string): ChordScaleFormula {
    Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

    return new ChordScaleFormula(
      formulaString.split(" ").map(ChordScaleFormulaPart.parse)
    );
  }

  public constructor(public parts: Array<ChordScaleFormulaPart>) {}

  public get pitchIntegers(): Array<number> {
    return this.parts.map(p => p.pitchInteger);
  }

  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return this.parts
      .map(p => p.getIntervalFromRootNote())
      .map(interval => Pitch.addInterval(rootPitch, VerticalDirection.Up, interval));
  }
  public toString(): string {
    return this.parts
      .map(p => p.toString())
      .join(" ");
  }
  
  public withAddedPart(chordNoteNumber: number, signedAccidental: number): ChordScaleFormula {
    Utils.precondition(chordNoteNumber >= 9);
    Utils.precondition((chordNoteNumber % 2) === 1);

    const simpleChordNoteNumber = getSimpleChordNoteNumber(chordNoteNumber);

    let insertIndex = -1;
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i];

      if (getSimpleChordNoteNumber(part.chordNoteNumber) === simpleChordNoteNumber) {
        if (part.signedAccidental === signedAccidental) {
          throw new Error(`Already added ${chordNoteNumber}, ${signedAccidental}`);
        } else if (part.signedAccidental > signedAccidental) {
          insertIndex = i;
          break;
        }
      } else if (part.chordNoteNumber > simpleChordNoteNumber) {
        insertIndex = i;
        break;
      } 
    }

    return (insertIndex >= 0)
      ? new ChordScaleFormula(Utils.newArraySplice(this.parts, insertIndex, 0, new ChordScaleFormulaPart(chordNoteNumber, signedAccidental)))
      : new ChordScaleFormula(this.parts.concat([new ChordScaleFormulaPart(chordNoteNumber, signedAccidental)]));
  }
  public withoutPart(chordNoteNumber: number): ChordScaleFormula {
    Utils.precondition(chordNoteNumber >= 2);

    const simpleChordNoteNumber = getSimpleChordNoteNumber(chordNoteNumber);
    const partIndex = this.parts.findIndex(p =>
      getSimpleChordNoteNumber(p.chordNoteNumber) === simpleChordNoteNumber
    );
    Utils.precondition(partIndex >= 0);

    return new ChordScaleFormula(Utils.newArraySplice(this.parts, partIndex, 1));
  }
  public withSharpenedOrFlattenedPart(chordNoteNumber: number, signedAccidental: number): ChordScaleFormula {
    Utils.precondition(signedAccidental !== 0);
    Utils.precondition(chordNoteNumber >= 2);

    const simpleChordNoteNumber = getSimpleChordNoteNumber(chordNoteNumber);
    const partIndex = this.parts.findIndex(p =>
      (getSimpleChordNoteNumber(p.chordNoteNumber) === simpleChordNoteNumber) &&
      (p.signedAccidental === 0)
    );
    Utils.precondition(partIndex >= 0);

    const newFormulaParts = this.parts.slice();
    newFormulaParts[partIndex].signedAccidental = signedAccidental;
    return new ChordScaleFormula(newFormulaParts);
  }

  public generateChordNames(): Array<ChordName> {
    // universal preconditions
    Utils.precondition(this.parts.length > 0);
    Utils.precondition(this.parts[0].chordNoteNumber === 1);
    Utils.precondition(this.parts[0].signedAccidental === 0);

    // special cases
    if ((this.parts.length === 2) && (this.parts[1].chordNoteNumber === 5) && (this.parts[1].signedAccidental === 0)) {
      return [new ChordName(ChordQuality.Power, null, [])];
    }

    if (this.parts.length === 3) {
      if (
        (this.parts[1].chordNoteNumber === 4) && (this.parts[1].signedAccidental === 0) &&
        (this.parts[2].chordNoteNumber === 7) && (this.parts[2].signedAccidental === -1)
      ) {
        return [new ChordName(ChordQuality.Quartal, null, [])];
      }
    } else if (this.parts.length === 4) {
      if (
        (this.parts[1].chordNoteNumber === 4) && (this.parts[1].signedAccidental === 0) &&
        (this.parts[2].chordNoteNumber === 3) && (this.parts[2].signedAccidental === -1) &&
        (this.parts[3].chordNoteNumber === 7) && (this.parts[3].signedAccidental === -1)
      ) {
        return [new ChordName(ChordQuality.Quartal, null, [])];
      }
    }

    // general-case preconditions
    if (this.parts.length < 3) {
      return [];
    }

    // get signed accidentals
    let firstSignedAccidental: number | null = null;
    let secondSignedAccidental: number | null = null;
    let thirdSignedAccidental: number | null = null;
    let fourthSignedAccidental: number | null = null;
    let fifthSignedAccidental: number | null = null;
    let sixthSignedAccidental: number | null = null;
    let seventhSignedAccidental: number | null = null;
    let ninthSignedAccidental: number | null = null;
    let eleventhSignedAccidental: number | null = null;
    let thirteenthSignedAccidental: number | null = null;

    for (const part of this.parts) {
      switch (part.chordNoteNumber) {
        case 1:
          if ((firstSignedAccidental === null) || (part.signedAccidental === 0)) {
            firstSignedAccidental = part.signedAccidental;
          }
          break;
        case 2:
          if ((secondSignedAccidental === null) || (part.signedAccidental === 0)) {
            secondSignedAccidental = part.signedAccidental;
          }
          break;
        case 3:
          if ((thirdSignedAccidental === null) || (part.signedAccidental === 0)) {
            thirdSignedAccidental = part.signedAccidental;
          }
          break;
        case 4:
          if ((fourthSignedAccidental === null) || (part.signedAccidental === 0)) {
            fourthSignedAccidental = part.signedAccidental;
          }
          break;
        case 5:
          if ((fifthSignedAccidental === null) || (part.signedAccidental === 0)) {
            fifthSignedAccidental = part.signedAccidental;
          }
          break;
        case 6:
          if ((sixthSignedAccidental === null) || (part.signedAccidental === 0)) {
            sixthSignedAccidental = part.signedAccidental;
          }
          break;
        case 7:
          if ((seventhSignedAccidental === null) || (part.signedAccidental === 0)) {
            seventhSignedAccidental = part.signedAccidental;
          }
          break;
        case 9:
          if ((ninthSignedAccidental === null) || (part.signedAccidental === 0)) {
            ninthSignedAccidental = part.signedAccidental;
          }
          break;
        case 11:
          if ((eleventhSignedAccidental === null) || (part.signedAccidental === 0)) {
            eleventhSignedAccidental = part.signedAccidental;
          }
          break;
        case 13:
          if ((thirteenthSignedAccidental === null) || (part.signedAccidental === 0)) {
            thirteenthSignedAccidental = part.signedAccidental;
          }
          break;
        default:
          throw new Error(`Unknown chord note #: ${part.chordNoteNumber}`);
      }
    }
    
    // get possible qualities
    const getPossibleQualities = (): Array<ChordQuality> => {
      if (fifthSignedAccidental === 1) {
        // Augmented
        if (seventhSignedAccidental === 0) {
          return [ChordQuality.AugmentedMajor];
        } else if ((seventhSignedAccidental === -1) || (seventhSignedAccidental === null)) {
          return [ChordQuality.Augmented];
        } else {
          return [];
        }
      } else if (fifthSignedAccidental === -1) {
        // Diminished
        if (seventhSignedAccidental === 0) {
          return [ChordQuality.DiminishedMajor];
        } else if (seventhSignedAccidental === -1) {
          return [ChordQuality.HalfDiminished];
        } else if ((seventhSignedAccidental === -2)) {
          return [ChordQuality.Diminished];
        } else if (seventhSignedAccidental === null) {
          if (thirdSignedAccidental === -1) {
            return [ChordQuality.Diminished];
          } else {
            return [];
          }
        } else {
          return [];
        }
      } else if ((fifthSignedAccidental === null) || (fifthSignedAccidental === 0)) {
        if (seventhSignedAccidental === 0) {
          if (thirdSignedAccidental === 0) {
            return [ChordQuality.Major];
          } else if (thirdSignedAccidental === -1) {
            return [ChordQuality.MinorMajor];
          } else {
            return [ChordQuality.Major, ChordQuality.MinorMajor];
          }
        } else if (seventhSignedAccidental === -1) {
          if (thirdSignedAccidental === 0) {
            return [ChordQuality.Dominant];
          } else if (thirdSignedAccidental === -1) {
            return [ChordQuality.Minor];
          } else {
            return [ChordQuality.Dominant, ChordQuality.Minor];
          }
        } else if (seventhSignedAccidental === null) {
          if (thirdSignedAccidental === 0) {
            return [ChordQuality.Major];
          } else if (thirdSignedAccidental === -1) {
            return [ChordQuality.Minor];
          } else {
            return [];
          }
        } else {
          return [];
        }
      } else {
        return [];
      }
    }
    
    const qualities = getPossibleQualities();
    if (qualities.length === 0) {
      return [];
    }
    
    // get extension string
    const getExtension = (): number | null => {
      if (seventhSignedAccidental !== null) {
        if (thirteenthSignedAccidental !== null) {
          if ((thirteenthSignedAccidental === 0) || (thirteenthSignedAccidental === -1)) {
            return 13;
          } else {
            throw new Error(`Invalid chord 13th signed accidental: ${thirteenthSignedAccidental}`);
          }
        } else if (eleventhSignedAccidental !== null) {
          if ((eleventhSignedAccidental === 0) || (eleventhSignedAccidental === 1)) {
            return 11;
          } else {
            throw new Error(`Invalid chord 11th signed accidental: ${thirteenthSignedAccidental}`);
          }
        } else if (ninthSignedAccidental !== null) {
          if ((ninthSignedAccidental >= -1) && (ninthSignedAccidental <= 1)) {
            return 9;
          } else {
            throw new Error(`Invalid chord 9th signed accidental: ${thirteenthSignedAccidental}`);
          }
        } else {
          if ((seventhSignedAccidental >= -2) && (seventhSignedAccidental <= 0)) {
            return 7;
          } else {
            throw new Error(`Invalid chord 7th signed accidental: ${thirteenthSignedAccidental}`);
          }
        }
      } else if (fifthSignedAccidental !== null) {
        if ((fifthSignedAccidental >= -1) && (fifthSignedAccidental <= 1)) {
          if (sixthSignedAccidental !== null) {
            if ((sixthSignedAccidental === 0) || (sixthSignedAccidental === 1)) {
              return 6;
            } else {
              throw new Error(`Invalid chord 6th signed accidental: ${thirteenthSignedAccidental}`);
            }
          } else {
            return null;
          }
        } else {
          throw new Error(`Invalid chord 5th signed accidental: ${thirteenthSignedAccidental}`);
        }
      } else {
        throw new Error(`Can't name chord formula ${this.toString()}`);
      }
    }

    const extension = getExtension();
    
    // get alterations
    const getAlterations =(chordQuality: ChordQuality): Array<string> => {
      const alterations = new Array<string>();

      // sharpened/flattened notes
      if (fifthSignedAccidental !== null) {
        if ((fifthSignedAccidental > 0) && (!isAugmentedChordQuality(chordQuality))) {
          alterations.push("#5");
        } else if ((fifthSignedAccidental < 0) && (!isDiminishedChordQuality(chordQuality))) {
          alterations.push("b5");
        }
      }

      if ((ninthSignedAccidental !== null) && (ninthSignedAccidental !== 0)) {
        alterations.push(getAccidentalString(ninthSignedAccidental) + "9");
      }
      
      if ((eleventhSignedAccidental !== null) && (eleventhSignedAccidental !== 0)) {
        alterations.push(getAccidentalString(eleventhSignedAccidental) + "11");
      }
      
      if ((thirteenthSignedAccidental !== null) && (thirteenthSignedAccidental !== 0)) {
        alterations.push(getAccidentalString(thirteenthSignedAccidental) + "13");
      }

      // sus2/sus4
      if ((extension === null) && (thirdSignedAccidental === null)) {
        if (secondSignedAccidental === 0) {
          alterations.push("sus2");
        } else if (fourthSignedAccidental === 0) {
          alterations.push("sus4");
        }
      }

      // add
      if (extension === null) {
        // TODO: support multiple adds
        if (ninthSignedAccidental !== null) {
          alterations.push(`add${getAccidentalString(ninthSignedAccidental)}9`);
        }
        
        if (eleventhSignedAccidental !== null) {
          alterations.push(`add${getAccidentalString(eleventhSignedAccidental)}11`);
        }
        
        if (thirteenthSignedAccidental !== null) {
          alterations.push(`add${getAccidentalString(thirteenthSignedAccidental)}13`);
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

    // for each quality and alterations
    const chordNames = new Array<ChordName>();

    for (const quality of qualities) {
      const alterations = getAlterations(quality);
      chordNames.push(new ChordName(quality, extension, alterations))
    }

    return chordNames;
  }
}
export class ChordScaleFormulaPart {
  public static parse(formulaPartString: string): ChordScaleFormulaPart {
    const accidentalString = Utils.takeCharsWhile(formulaPartString, 0, c => (c === "#") || (c === "b"));

    let signedAccidental: number;
    if (accidentalString.length === 0) {
      signedAccidental = 0;
    } else if (accidentalString[0] === "#") {
      signedAccidental = accidentalString.length;
    } else if (accidentalString[0] === "b") {
      signedAccidental = -accidentalString.length;
    } else {
      throw new Error(`Invalid accidental character: ${accidentalString[0]}`);
    }

    const scaleDegreeNumberString = formulaPartString.substring(accidentalString.length);
    const scaleDegreeNumber = parseInt(scaleDegreeNumberString, 10);

    return new ChordScaleFormulaPart(scaleDegreeNumber, signedAccidental);
  }

  public constructor(
    public chordNoteNumber: number,
    public signedAccidental: number
  ) {
    Utils.invariant(chordNoteNumber >= 1);
  }

  public get pitchInteger(): number {
    return Interval.getSimpleIntervalTypeHalfSteps(Interval.getSimpleIntervalType(this.chordNoteNumber)) + this.signedAccidental;
  }

  public toString(): string {
    return this.chordNoteNumber.toString + getAccidentalString(this.signedAccidental);
  }
  public getIntervalFromRootNote(): Interval {
    return new Interval(this.chordNoteNumber, this.signedAccidental);
  }
}