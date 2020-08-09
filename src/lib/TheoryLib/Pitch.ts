import { PitchLetter, getPitchLetterMidiNoteNumberOffset, parsePitchLetter } from './PitchLetter';
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";
import { precondition } from '../Core/Dbc';
import { mod } from '../Core/MathUtils';
import { numMatchingCharsAtStart, numSubstringOccurrences } from '../Core/StringUtils';

/**
 * A "pitch class" represented by a number from 0 to 11, where:
 * 0 = C
 * 1 = C#/Db
 * 2 = D
 * 3 = D#/Eb
 * 4 = E
 * 5 = F
 * 6 = F#/Gb
 * 7 = G
 * 8 = G#/Ab
 * 9 = A
 * 10 = A#/Bb
 * 11 = B
 */
export type PitchClass = number;

export const cPitchClass: PitchClass = 0;
export const cSharpDFlatPitchClass: PitchClass = 1;
export const dPitchClass: PitchClass = 2;
export const dSharpEFlatPitchClass: PitchClass = 3;
export const ePitchClass: PitchClass = 4;
export const fPitchClass: PitchClass = 5;
export const fSharpGFlatPitchClass: PitchClass = 6;
export const gPitchClass: PitchClass = 7;
export const gSharpAFlatPitchClass: PitchClass = 8;
export const aPitchClass: PitchClass = 9;
export const aSharpBFlatPitchClass: PitchClass = 10;
export const bPitchClass: PitchClass = 11;

export type SignedAccidental = number;

export function getPitchRange(minPitch: Pitch, maxPitch: Pitch) {
  const minMidiNumber = minPitch.midiNumber;
  const maxMidiNumber = maxPitch.midiNumber;

  let pitches = new Array<Pitch>();

  for (let midiNumber = minMidiNumber; midiNumber <= maxMidiNumber; midiNumber++) {
    pitches.push(Pitch.createFromMidiNumber(midiNumber));
  }

  return pitches;
}

export function getAmbiguousPitchRange(
  minPitch: Pitch, maxPitch: Pitch,
  minSignedAccidental: number, maxSignedAccidental: number
): Array<Pitch> {
  precondition(minSignedAccidental <= maxSignedAccidental);

  const minLineOrSpaceOnStaffNumber = minPitch.lineOrSpaceOnStaffNumber;
  const maxLineOrSpaceOnStaffNumber = maxPitch.lineOrSpaceOnStaffNumber;
  const possibleNotes = new Array<Pitch>();

  for (
    let lineOrSpaceOnStaffNumber = minLineOrSpaceOnStaffNumber;
    lineOrSpaceOnStaffNumber < maxLineOrSpaceOnStaffNumber;
    lineOrSpaceOnStaffNumber++
  ) {
    for (
      let signedAccidental = minSignedAccidental;
      signedAccidental <= maxSignedAccidental;
      signedAccidental++
    ) {
      possibleNotes.push(Pitch.createFromLineOrSpaceOnStaffNumber(
        lineOrSpaceOnStaffNumber,
        signedAccidental
      ));
    }
  }

  return possibleNotes;
}

function getAccidentalStringInternal(signedAccidental: number, sharpText: string, flatText: string): string {
  if (signedAccidental === 0) {
    return "";
  }

  const accidentalCharacter = (signedAccidental > 0)
    ? sharpText
    : flatText;
  return accidentalCharacter.repeat(Math.abs(signedAccidental));
}

export function getAccidentalString(signedAccidental: number, useSymbols: boolean = false): string {
  return getAccidentalStringInternal(signedAccidental, useSymbols ? "♯" : "#", useSymbols ? "♭" : "b");
}

export function expandPitchRangeToIncludePitch(pitchRange: [Pitch, Pitch], pitch: Pitch): [Pitch, Pitch] {
  // If the pitch is lower than the range's min pitch, lower the range's min pitch to the lower pitch.
  if (pitch.midiNumber < pitchRange[0].midiNumber) {
    return [pitch, pitchRange[1]];
  }
  // If the pitch is higher than the range's max pitch, raise the range's max pitch to the higher pitch.
  else if (pitch.midiNumber > pitchRange[1].midiNumber) {
    return [pitchRange[0], pitch];
  }
  // If the pitch is already in the range, we don't need to expand the range.
  else {
    return pitchRange;
  }
}

export function getNumPitchesInRange(pitchRange: [Pitch, Pitch]): number {
  return pitchRange[1].midiNumber - pitchRange[0].midiNumber + 1;
}

export function parseSignedAccidental(str: string): number | undefined {
  if (str.length === 0) { return 0; }

  const firstChar = str[0];

  switch (firstChar) {
    case '#':
    case '♯':
      return numMatchingCharsAtStart(str, firstChar);
    case 'b':
    case '♭':
      return -numMatchingCharsAtStart(str, firstChar);
    default:
      return undefined;
  }
}

export function tryWrapPitchOctave(
  pitch: Pitch,
  lowestPitch: Pitch,
  highestPitch: Pitch
): Pitch | undefined {
  const lowestPitchMidiNumber = lowestPitch.midiNumber;
  const highestPitchMidiNumber = highestPitch.midiNumber;
  
  const pitchCountInRange = (highestPitchMidiNumber - lowestPitchMidiNumber) + 1;
  const pitchOctaveSpan = Math.ceil(pitchCountInRange / 12);
  
  // If the pitch is below the pitch range, shift it up by octaves until it isn't.
  if (pitch.midiNumber < lowestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitch = Pitch.addOctaves(pitch, pitchOctaveSpan);
    } while (pitch.midiNumber < lowestPitchMidiNumber);
  }
  // Otherwise, if the pitch is above the pitch range, shift it down by octaves until it isn't.
  else if (pitch.midiNumber > highestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitch = Pitch.addOctaves(pitch, -pitchOctaveSpan);
    } while (pitch.midiNumber > highestPitchMidiNumber);
  }

  // If the pitch is in range now, return it. Otherwise, return undefined.
  const pitchMidiNumber = pitch.midiNumber;

  return ((pitchMidiNumber >= lowestPitchMidiNumber) && (pitchMidiNumber <= highestPitchMidiNumber))
    ? pitch
    : undefined;
}

export const arePitchOffsetsFromCWhiteKeys = [
  true, // C
  false, // C#/Db
  true, // D
  false, // D#/Eb
  true, // E
  true, // F
  false, // F#/Gb
  true, // G
  false, // G#/Ab
  true, // A
  false, // A#/Bb
  true, // B
];
export const ambiguousPitchStrings = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];
export const ambiguousPitchStringsSymbols = [
  "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"
];

export const ambiguousKeyPitchStringsSymbols = [
  "A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭"
];

export function getEnglishAccidentalString(signedAccidental: number): string {
  return getAccidentalStringInternal(signedAccidental, "sharp", "flat");
}

export function parseEnglishSignedAccidental(str: string): number | undefined {
  if (str.length === 0) { return 0; }

  const firstChar = str[0];

  switch (firstChar) {
    case 's':
      return numSubstringOccurrences(str, "sharp", /*allowOverlapping*/ false);
    case 'f':
      return -numSubstringOccurrences(str, "flat", /*allowOverlapping*/ false);
    default:
      return undefined;
  }
}

export function getUriComponent(pitch: Pitch, includeOctaveNumber: boolean = false): string {
  return PitchLetter[pitch.letter] + getEnglishAccidentalString(pitch.signedAccidental) + (includeOctaveNumber ? pitch.octaveNumber.toString() : "");
}

export function parseFromUriComponent(uriComponent: string, octaveNumber: number): Pitch | undefined {
  const pitchLetter = parsePitchLetter(uriComponent);
  if (pitchLetter === undefined) { return undefined; }

  const signedAccidentalStr = uriComponent.substring(1);
  const signedAccidental = parseEnglishSignedAccidental(signedAccidentalStr);
  if (signedAccidental === undefined) { return undefined; }

  return new Pitch(pitchLetter, signedAccidental, octaveNumber);
}

export function isPitchLessThan(a: Pitch, b: Pitch): boolean {
  return a.midiNumber < b.midiNumber;
}

export function isPitchGreaterThan(a: Pitch, b: Pitch): boolean {
  return a.midiNumber > b.midiNumber;
}

export function areMidiNumbersSamePitchClass(a: number, b: number): boolean {
  return (Math.abs(a - b)) % 12 === 0
}

export function keyToPitch(keyString: string): Pitch | null {
  switch (keyString) {
    // bottom rows
    case "z":
      return new Pitch(PitchLetter.C, 0, 4);
    case "s":
      return new Pitch(PitchLetter.D, -1, 4);
    case "x":
      return new Pitch(PitchLetter.D, 0, 4);
    case "d":
      return new Pitch(PitchLetter.E, -1, 4);
    case "c":
      return new Pitch(PitchLetter.E, 0, 4);
    case "v":
      return new Pitch(PitchLetter.F, 0, 4);
    case "g":
      return new Pitch(PitchLetter.G, -1, 4);
    case "b":
      return new Pitch(PitchLetter.G, 0, 4);
    case "h":
      return new Pitch(PitchLetter.A, -1, 4);
    case "n":
      return new Pitch(PitchLetter.A, 0, 4);
    case "j":
      return new Pitch(PitchLetter.B, -1, 4);
    case "m":
      return new Pitch(PitchLetter.B, 0, 4);
    case ",":
      return new Pitch(PitchLetter.C, 0, 5);
    case "l":
      return new Pitch(PitchLetter.D, -1, 5);
    case ".":
      return new Pitch(PitchLetter.D, 0, 5);
    case ";":
      return new Pitch(PitchLetter.E, -1, 5);
    case "/":
      return new Pitch(PitchLetter.E, 0, 5);

    // top rows
    case "q":
      return new Pitch(PitchLetter.C, 0, 5);
    case "2":
      return new Pitch(PitchLetter.D, -1, 5);
    case "w":
      return new Pitch(PitchLetter.D, 0, 5);
    case "3":
      return new Pitch(PitchLetter.E, -1, 5);
    case "e":
      return new Pitch(PitchLetter.E, 0, 5);
    case "r":
      return new Pitch(PitchLetter.F, 0, 5);
    case "5":
      return new Pitch(PitchLetter.G, -1, 5);
    case "t":
      return new Pitch(PitchLetter.G, 0, 5);
    case "6":
      return new Pitch(PitchLetter.A, -1, 5);
    case "y":
      return new Pitch(PitchLetter.A, 0, 5);
    case "7":
      return new Pitch(PitchLetter.B, -1, 5);
    case "u":
      return new Pitch(PitchLetter.B, 0, 5);
    case "i":
      return new Pitch(PitchLetter.C, 0, 6);
    case "9":
      return new Pitch(PitchLetter.C, 1, 6);
    case "o":
      return new Pitch(PitchLetter.D, 0, 6);
    case "0":
      return new Pitch(PitchLetter.D, 1, 6);
    case "p":
      return new Pitch(PitchLetter.E, 0, 6);
    case "[":
      return new Pitch(PitchLetter.F, 0, 6);
    case "=":
      return new Pitch(PitchLetter.F, 1, 6);
    case "]":
      return new Pitch(PitchLetter.G, 0, 6);
    
    default:
      return null;
  }
}

export function pitchFromClass(pitchClass: number, octaveNumber: number, useSharps: boolean = true): Pitch {
  switch (pitchClass) {
    case 0:
      return new Pitch(PitchLetter.C, 0, octaveNumber);
    case 1:
      return useSharps ? new Pitch(PitchLetter.C, 1, octaveNumber) : new Pitch(PitchLetter.D, -1, octaveNumber);
    case 2:
      return new Pitch(PitchLetter.D, 0, octaveNumber);
    case 3:
      return useSharps ? new Pitch(PitchLetter.D, 1, octaveNumber) : new Pitch(PitchLetter.E, -1, octaveNumber);
    case 4:
      return new Pitch(PitchLetter.E, 0, octaveNumber);
    case 5:
      return new Pitch(PitchLetter.F, 0, octaveNumber);
    case 6:
      return useSharps ? new Pitch(PitchLetter.F, 1, octaveNumber) : new Pitch(PitchLetter.G, -1, octaveNumber);
    case 7:
      return new Pitch(PitchLetter.G, 0, octaveNumber);
    case 8:
      return useSharps ? new Pitch(PitchLetter.G, 1, octaveNumber) : new Pitch(PitchLetter.A, -1, octaveNumber);
    case 9:
      return new Pitch(PitchLetter.A, 0, octaveNumber);
    case 10:
      return useSharps ? new Pitch(PitchLetter.A, 1, octaveNumber) : new Pitch(PitchLetter.B, -1, octaveNumber);
    case 11:
      return new Pitch(PitchLetter.B, 0, octaveNumber);
    default:
      throw new Error(`Invalid pitch class: ${pitchClass}`);
  }
}

export function invertPitches(pitches: Array<Pitch>, inversion: number) {
  inversion = inversion % pitches.length;

  for (let i = 0; i < inversion; i++) {
    pitches[i].octaveNumber++;
  }
}

export class Pitch {
  public static createFromPitchClass(pitchClass: number, octaveNumber: number, useSharps: boolean = true): Pitch {
    return pitchFromClass(pitchClass, octaveNumber, useSharps);
  }

  public static createFromMidiNumber(midiNumber: number, useSharps: boolean = true): Pitch {
    const pitchClass = mod(midiNumber, 12);
    const octaveNumber = Math.floor(midiNumber / 12) - 1;
    return this.createFromPitchClass(pitchClass, octaveNumber, useSharps);
  }
  
  public static createFromLineOrSpaceOnStaffNumber(lineOrSpaceOnStaffNumber: number, signedAccidental: number): Pitch {
    const letter = mod(lineOrSpaceOnStaffNumber + 2, 7) as PitchLetter;
    const octaveNumber = Math.floor(lineOrSpaceOnStaffNumber / 7);
    return new Pitch(letter, signedAccidental, octaveNumber);
  }

  public static parseNoOctave(str: string, octaveNumber: number): Pitch | undefined {
    const pitchLetter = parsePitchLetter(str);
    if (pitchLetter === undefined) { return undefined; }

    const signedAccidentalStr = str.substring(1, 2);
    const signedAccidental = parseSignedAccidental(signedAccidentalStr);
    if (signedAccidental === undefined) { return undefined; }

    return new Pitch(pitchLetter, signedAccidental, octaveNumber);
  }

  public static addPitchLetters(pitch: Pitch, pitchLetterOffset: number): Pitch {
    return Pitch.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + pitchLetterOffset,
      pitch.signedAccidental
    );
  }

  public static isInRange(pitch: Pitch, minPitch?: Pitch, maxPitch?: Pitch): boolean {
    const minPitchMidiNumber = minPitch ? minPitch.midiNumber : undefined;
    const maxPitchMidiNumber = maxPitch ? maxPitch.midiNumber : undefined;

    precondition(
      (minPitchMidiNumber === undefined) ||
      (maxPitchMidiNumber === undefined) ||
      (minPitchMidiNumber <= maxPitchMidiNumber)
    );

    const pitchMidiNumber = pitch.midiNumber;

    if (minPitchMidiNumber && (pitchMidiNumber < minPitchMidiNumber)) {
      return false;
    }

    if (maxPitchMidiNumber && (pitchMidiNumber > maxPitchMidiNumber)) {
      return false;
    }

    return true;
  }

  public static addHalfSteps(pitch: Pitch, numHalfSteps: number): Pitch {
    return this.createFromMidiNumber(pitch.midiNumber + numHalfSteps);
  }

  public static addInterval(
    pitch: Pitch,
    direction: VerticalDirection,
    interval: Interval
  ): Pitch {
    const offsetSign = direction as number;
    
    const halfStepsOffset = offsetSign * interval.halfSteps;
    const newMidiNumber = pitch.midiNumber + halfStepsOffset;

    const result = Pitch.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + (offsetSign * (interval.type - 1)),
      pitch.signedAccidental
    );
    result.signedAccidental += newMidiNumber - result.midiNumber;

    return result;
  }

  public static addOctaves(
    pitch: Pitch, octaves: number
  ): Pitch {
    return new Pitch(pitch.letter, pitch.signedAccidental, pitch.octaveNumber + octaves);
  }

  public static min(a: Pitch, b: Pitch): Pitch {
    return (a.midiNumber <= b.midiNumber) ? a : b;
  }

  public static max(a: Pitch, b: Pitch): Pitch {
    return (a.midiNumber >= b.midiNumber) ? a : b;
  }

  public constructor(
    public letter: PitchLetter,
    public signedAccidental: number,
    public octaveNumber: number
  ) {}

  public get class(): PitchClass {
    return this.midiNumberNoOctave;
  }

  public get midiNumber(): number {
    const pitchLetterMidiNoteNumberOffset = getPitchLetterMidiNoteNumberOffset(this.letter);
    return (12 * (this.octaveNumber + 1)) + pitchLetterMidiNoteNumberOffset + this.signedAccidental;
  }

  public get midiNumberNoOctave(): number {
    return mod(this.midiNumber, 12);
  }

  public get lineOrSpaceOnStaffNumber(): number {
    return (7 * this.octaveNumber) + mod(this.letter - 2, 7);
  }

  public get isNatural(): boolean {
    return this.signedAccidental === 0;
  }

  // TODO: add tests
  public get isWhiteKey(): boolean {
    const positivePitchOffsetFromC = mod(this.midiNumber, 12);
    return arePitchOffsetsFromCWhiteKeys[positivePitchOffsetFromC];
  }

  // TODO: add tests
  public get isBlackKey(): boolean {
    return !this.isWhiteKey;
  }
  
  public equals(pitch: Pitch): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental) &&
      (this.octaveNumber === pitch.octaveNumber)
    );
  }

  public equalsNoOctave(pitch: Pitch): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental)
    );
  }

  public copy(): Pitch {
    return new Pitch(this.letter, this.signedAccidental, this.octaveNumber);
  }

  public isEnharmonic(pitch: Pitch): boolean {
    return this.midiNumber === pitch.midiNumber;
  }

  public getAccidentalString(useSymbols: boolean = false): string {
    return getAccidentalString(this.signedAccidental, useSymbols);
  }

  public toString(includeOctaveNumber: boolean = true, useSymbols: boolean = false): string {
    return PitchLetter[this.letter] + this.getAccidentalString(useSymbols) + (includeOctaveNumber ? this.octaveNumber.toString() : "");
  }

  // TODO: add tests
  public toOneAccidentalAmbiguousString(includeOctaveNumber: boolean = true, useSymbols: boolean = false): string {
    const positivePitchOffsetFromC = mod(this.midiNumber, 12);
    const ambiguousPitchString = !useSymbols
      ? ambiguousPitchStrings[positivePitchOffsetFromC]
      : ambiguousPitchStringsSymbols[positivePitchOffsetFromC];
    
    const octaveNumber = Math.floor(this.midiNumber / 12) - 1;
    const octaveNumberString = includeOctaveNumber ? octaveNumber.toString() : "";

    return ambiguousPitchString + octaveNumberString;
  }
  
  // TODO: add tests
  public toVexFlowString(includeOctaveNumber: boolean = true): string {
    return `${PitchLetter[this.letter].toLowerCase()}${this.getAccidentalString()}/${this.octaveNumber}`;
  }
  
  // TODO: add tests
  public toVexFlowKeySignatureString(): string {
    return `${PitchLetter[this.letter]}${this.getAccidentalString()}`;
  }
}