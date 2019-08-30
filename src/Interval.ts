import * as Utils from "./Utils";
import { Pitch } from './Pitch';

export class Interval {
  public static readonly upDirectionSymbol = "↑";
  public static readonly downDirectionSymbol = "↓";

  public static fromPitches(
    pitch1: Pitch,
    pitch2: Pitch
  ): Interval {
    let lowerPitch: Pitch;
    let higherPitch: Pitch;

    if (
      (pitch1.midiNumber < pitch2.midiNumber) ||
      (pitch1.lineOrSpaceOnStaffNumber < pitch2.lineOrSpaceOnStaffNumber)
    ) {
      lowerPitch = pitch1;
      higherPitch = pitch2;
    } else {
      lowerPitch = pitch2;
      higherPitch = pitch1;
    }

    const intervalType = higherPitch.lineOrSpaceOnStaffNumber - lowerPitch.lineOrSpaceOnStaffNumber + 1;
    const interval = new Interval(intervalType, 0);

    const halfSteps = (higherPitch.midiNumber - lowerPitch.midiNumber);
    interval.quality = halfSteps - interval.halfSteps;
    
    return interval;
  }
  public static fromHalfSteps(halfSteps: number): Interval {
    const numOctaves = Math.floor(halfSteps / 12);
    const baseType = 1 + (7 * numOctaves);
    const simpleIntervalHalfSteps = halfSteps % 12;

    switch (simpleIntervalHalfSteps) {
      case 0:
        return new Interval(baseType, 0);
      case 1:
        return new Interval(baseType + 1, -1);
      case 2:
        return new Interval(baseType + 1, 0);
      case 3:
        return new Interval(baseType + 2, -1);
      case 4:
        return new Interval(baseType + 2, 0);
      case 5:
        return new Interval(baseType + 3, 0);
      case 6:
        return new Interval(baseType + 4, -1);
      case 7:
        return new Interval(baseType + 4, 0);
      case 8:
        return new Interval(baseType + 5, -1);
      case 9:
        return new Interval(baseType + 5, 0);
      case 10:
        return new Interval(baseType + 6, -1);
      case 11:
        return new Interval(baseType + 6, 0);
      default:
        throw new Error();
    }
  }
  public static getSimpleIntervalType(intervalType: number): number {
    return 1 + Utils.mod((intervalType - 1), 7);
  }
  public static getSimpleIntervalTypeHalfSteps(simpleIntervalType: number): number {
    Utils.precondition((simpleIntervalType >= 1) && (simpleIntervalType <= 8));

    switch (simpleIntervalType) {
      case 1:
        return 0;
      case 2:
        return 2;
      case 3:
        return 4;
      case 4:
        return 5;
      case 5:
        return 7;
      case 6:
        return 9;
      case 7:
        return 11;
      case 8:
        return 12;
      default:
        throw new Error(`Invalid simple interval type: ${simpleIntervalType}`);
    }
  }

  public constructor(public type: number, public quality: number) {
    Utils.invariant(Number.isInteger(type) && (type > 0));
    Utils.invariant(Number.isInteger(quality));
  }

  public get simpleIntervalType(): number {
    return Interval.getSimpleIntervalType(this.type);
  }
  public get halfSteps(): number {
    const octaveCount = Math.floor(this.type / 8);
    const simpleIntervalHalfSteps = Interval.getSimpleIntervalTypeHalfSteps(this.simpleIntervalType);

    return (12 * octaveCount) + simpleIntervalHalfSteps + this.quality;
  }

  // TODO: add tests
  public get qualityString(): string {
    switch (this.simpleIntervalType) {
      case 1:
      case 4:
      case 5:
      case 8:
        if (this.quality === 0) {
          return "P";
        } else if (this.quality > 0) {
          return "A".repeat(this.quality);
        } else { // this.quality < 0
          return "d".repeat(-this.quality);
        }
      default:
        if (this.quality === 0) {
          return "M";
        } else if (this.quality >= 1) {
          return "A".repeat(this.quality - 1);
        } else if (this.quality === -1) {
          return "m";
        } else { // this.quality <= -2
          return "d".repeat(-(this.quality + 1));
        }
    }
  }

  // TODO: add tests
  public get invertedSimple(): Interval {
    const simpleIntervalType = this.simpleIntervalType;
    if ((simpleIntervalType === 1) || (simpleIntervalType === 8)) {
      return new Interval(this.type, this.quality);
    }

    const invertedSimpleIntervalType = 9 - simpleIntervalType;
    const invertedIntervalHalfSteps = 12 - this.halfSteps;
    const invertedQuality = invertedIntervalHalfSteps - Interval.getSimpleIntervalTypeHalfSteps(invertedSimpleIntervalType);
    return new Interval(invertedSimpleIntervalType, invertedQuality);
  }

  public equals(i: Interval): boolean {
    return (this.type === i.type) && (this.quality === i.quality);
  }
  public toString(): string {
    return `${this.qualityString}${this.type}`;
  }
}

export function intervalQualityStringToNumber(intervalQualityString: string): number {
  switch (intervalQualityString) {
    case "P":
    case "M":
      return 0;
    case "m":
    case "d":
      return -1;
    case "A":
      return 1;
    default:
      throw new Error(`Unknown interval quality: ${intervalQualityString}`);
  }
}

export function createIntervalLevels(includeUnison: boolean, separateA4D5: boolean) {
  const unisonIntervalStrings = includeUnison ? ["P1"] : [];
  const tritoneIntervalStrings = separateA4D5 ? ["A4", "d5"] : ["A4/d5"];

  return [
    {
      name: "Perfect Intervals",
      intervalStrings: unisonIntervalStrings
        .concat(["P4", "P5", "P8"])
    },
    {
      name: "m2, A4/d5, M7",
      intervalStrings: unisonIntervalStrings
        .concat(["m2", "P4"])
        .concat(tritoneIntervalStrings)
        .concat(["P5", "M7", "P8"])
    },
    {
      name: "M2, m7",
      intervalStrings: unisonIntervalStrings
        .concat(["m2", "M2", "P4"])
        .concat(tritoneIntervalStrings)
        .concat(["P5", "m7", "M7", "P8"])
    },
    {
      name: "3rds",
      intervalStrings: unisonIntervalStrings
        .concat(["m2", "M2", "m3", "M3", "P4"])
        .concat(tritoneIntervalStrings)
        .concat(["P5", "m7", "M7", "P8"])
    },
    {
      name: "6ths (All Intervals)",
      intervalStrings: unisonIntervalStrings
      .concat(["m2", "M2", "m3", "M3", "P4"])
      .concat(tritoneIntervalStrings)
      .concat(["P5", "m6", "M6", "m7", "M7", "P8"])
    }
  ];
}