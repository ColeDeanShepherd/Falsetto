import { PitchLetter, pitchLetterToMidiNumberOffset, parsePitchLetter } from './PitchLetter';
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";
import { precondition } from '../Core/Dbc';
import { mod } from '../Core/MathUtils';
import { numMatchingCharsAtStart, numSubstringOccurrences } from '../Core/StringUtils';
import { parseSignedAccidental, PitchClassName } from './PitchClassName';
import { parseEnglishSignedAccidental, PitchClass } from './PitchClass';

export function pitchClassNameToPitch(pitchClassName: PitchClassName, octaveNumber: number): PitchName {
  return new PitchName(pitchClassName.letter, pitchClassName.signedAccidental, octaveNumber);
}

export function* getPitchesInRange(minPitch: PitchName, maxPitch: PitchName) {
  const minMidiNumber = minPitch.midiNumber;
  const maxMidiNumber = maxPitch.midiNumber;

  for (let midiNumber = minMidiNumber; midiNumber <= maxMidiNumber; midiNumber++) {
    yield PitchName.createFromMidiNumber(midiNumber);
  }
}

export function getAmbiguousPitchRange(
  minPitch: PitchName, maxPitch: PitchName,
  minSignedAccidental: number, maxSignedAccidental: number
): Array<PitchName> {
  precondition(minSignedAccidental <= maxSignedAccidental);

  const minLineOrSpaceOnStaffNumber = minPitch.lineOrSpaceOnStaffNumber;
  const maxLineOrSpaceOnStaffNumber = maxPitch.lineOrSpaceOnStaffNumber;
  const possibleNotes = new Array<PitchName>();

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
      possibleNotes.push(PitchName.createFromLineOrSpaceOnStaffNumber(
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

export function expandPitchRangeToIncludePitch(pitchRange: [PitchName, PitchName], pitch: PitchName): [PitchName, PitchName] {
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

export function getNumPitchesInRange(pitchRange: [PitchName, PitchName]): number {
  return pitchRange[1].midiNumber - pitchRange[0].midiNumber + 1;
}

export function tryWrapPitchOctave(
  pitch: PitchName,
  lowestPitch: PitchName,
  highestPitch: PitchName
): PitchName | undefined {
  const lowestPitchMidiNumber = lowestPitch.midiNumber;
  const highestPitchMidiNumber = highestPitch.midiNumber;
  
  const pitchCountInRange = (highestPitchMidiNumber - lowestPitchMidiNumber) + 1;
  const pitchOctaveSpan = Math.ceil(pitchCountInRange / 12);
  
  // If the pitch is below the pitch range, shift it up by octaves until it isn't.
  if (pitch.midiNumber < lowestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitch = PitchName.addOctaves(pitch, pitchOctaveSpan);
    } while (pitch.midiNumber < lowestPitchMidiNumber);
  }
  // Otherwise, if the pitch is above the pitch range, shift it down by octaves until it isn't.
  else if (pitch.midiNumber > highestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitch = PitchName.addOctaves(pitch, -pitchOctaveSpan);
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

export function getUriComponent(pitch: PitchName, includeOctaveNumber: boolean = false): string {
  return PitchLetter[pitch.letter] + getEnglishAccidentalString(pitch.signedAccidental) + (includeOctaveNumber ? pitch.octaveNumber.toString() : "");
}

export function parseFromUriComponent(uriComponent: string, octaveNumber: number): PitchName | undefined {
  const pitchLetter = parsePitchLetter(uriComponent);
  if (pitchLetter === undefined) { return undefined; }

  const signedAccidentalStr = uriComponent.substring(1);
  const signedAccidental = parseEnglishSignedAccidental(signedAccidentalStr);
  if (signedAccidental === undefined) { return undefined; }

  return new PitchName(pitchLetter, signedAccidental, octaveNumber);
}

export function isPitchLessThan(a: PitchName, b: PitchName): boolean {
  return a.midiNumber < b.midiNumber;
}

export function isPitchGreaterThan(a: PitchName, b: PitchName): boolean {
  return a.midiNumber > b.midiNumber;
}

export function areMidiNumbersSamePitchClass(a: number, b: number): boolean {
  return (Math.abs(a - b)) % 12 === 0
}

export class PitchName {
  public static createFromPitchClass(pitchClass: number, octaveNumber: number, useSharps: boolean = true): PitchName {
    switch (pitchClass) {
      case 0:
        return new PitchName(PitchLetter.C, 0, octaveNumber);
      case 1:
        return useSharps ? new PitchName(PitchLetter.C, 1, octaveNumber) : new PitchName(PitchLetter.D, -1, octaveNumber);
      case 2:
        return new PitchName(PitchLetter.D, 0, octaveNumber);
      case 3:
        return useSharps ? new PitchName(PitchLetter.D, 1, octaveNumber) : new PitchName(PitchLetter.E, -1, octaveNumber);
      case 4:
        return new PitchName(PitchLetter.E, 0, octaveNumber);
      case 5:
        return new PitchName(PitchLetter.F, 0, octaveNumber);
      case 6:
        return useSharps ? new PitchName(PitchLetter.F, 1, octaveNumber) : new PitchName(PitchLetter.G, -1, octaveNumber);
      case 7:
        return new PitchName(PitchLetter.G, 0, octaveNumber);
      case 8:
        return useSharps ? new PitchName(PitchLetter.G, 1, octaveNumber) : new PitchName(PitchLetter.A, -1, octaveNumber);
      case 9:
        return new PitchName(PitchLetter.A, 0, octaveNumber);
      case 10:
        return useSharps ? new PitchName(PitchLetter.A, 1, octaveNumber) : new PitchName(PitchLetter.B, -1, octaveNumber);
      case 11:
        return new PitchName(PitchLetter.B, 0, octaveNumber);
      default:
        throw new Error(`Invalid pitch class: ${pitchClass}`);
    }
  }

  public static createFromMidiNumber(midiNumber: number, useSharps: boolean = true): PitchName {
    const pitchClass = mod(midiNumber, 12);
    const octaveNumber = Math.floor(midiNumber / 12) - 1;
    return this.createFromPitchClass(pitchClass, octaveNumber, useSharps);
  }
  
  public static createFromLineOrSpaceOnStaffNumber(lineOrSpaceOnStaffNumber: number, signedAccidental: number): PitchName {
    const letter = mod(lineOrSpaceOnStaffNumber + 2, 7) as PitchLetter;
    const octaveNumber = Math.floor(lineOrSpaceOnStaffNumber / 7);
    return new PitchName(letter, signedAccidental, octaveNumber);
  }

  // TODO: remove
  public static parseNoOctave(str: string, octaveNumber: number): PitchName | undefined {
    const pitchLetter = parsePitchLetter(str);
    if (pitchLetter === undefined) { return undefined; }

    const signedAccidentalStr = str.substring(1, 2);
    const signedAccidental = parseSignedAccidental(signedAccidentalStr);
    if (signedAccidental === undefined) { return undefined; }

    return new PitchName(pitchLetter, signedAccidental, octaveNumber);
  }

  public static addPitchLetters(pitch: PitchName, pitchLetterOffset: number): PitchName {
    return PitchName.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + pitchLetterOffset,
      pitch.signedAccidental
    );
  }

  public static isInRange(pitch: PitchName, minPitch?: PitchName, maxPitch?: PitchName): boolean {
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

  public static addHalfSteps(pitch: PitchName, numHalfSteps: number): PitchName {
    return this.createFromMidiNumber(pitch.midiNumber + numHalfSteps);
  }

  public static addInterval(
    pitch: PitchName,
    direction: VerticalDirection,
    interval: Interval
  ): PitchName {
    const offsetSign = direction as number;
    
    const halfStepsOffset = offsetSign * interval.halfSteps;
    const newMidiNumber = pitch.midiNumber + halfStepsOffset;

    const result = PitchName.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + (offsetSign * (interval.type - 1)),
      pitch.signedAccidental
    );
    result.signedAccidental += newMidiNumber - result.midiNumber;

    return result;
  }

  public static addOctaves(
    pitch: PitchName, octaves: number
  ): PitchName {
    return new PitchName(pitch.letter, pitch.signedAccidental, pitch.octaveNumber + octaves);
  }

  public static min(a: PitchName, b: PitchName): PitchName {
    return (a.midiNumber <= b.midiNumber) ? a : b;
  }

  public static max(a: PitchName, b: PitchName): PitchName {
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
    const pitchLetterMidiNoteNumberOffset = pitchLetterToMidiNumberOffset(this.letter);
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
  
  public equals(pitch: PitchName): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental) &&
      (this.octaveNumber === pitch.octaveNumber)
    );
  }

  public equalsNoOctave(pitch: PitchName): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental)
    );
  }

  public copy(): PitchName {
    return new PitchName(this.letter, this.signedAccidental, this.octaveNumber);
  }

  public isEnharmonic(pitch: PitchName): boolean {
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