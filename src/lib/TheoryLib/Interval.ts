import { Pitch } from './Pitch';
import { mod } from '../Core/MathUtils';
import { precondition, invariant } from '../Core/Dbc';

export const upDirectionSymbol = "↑";
export const downDirectionSymbol = "↓";

export class Interval {
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
    return 1 + mod((intervalType - 1), 7);
  }
  public static getSimpleIntervalTypeHalfSteps(simpleIntervalType: number): number {
    precondition((simpleIntervalType >= 1) && (simpleIntervalType <= 8));

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
    invariant(Number.isInteger(type) && (type > 0));
    invariant(Number.isInteger(quality));
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