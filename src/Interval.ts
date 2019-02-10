import * as Utils from "./Utils";

export class Interval {
  public static getSimpleIntervalType(intervalType: number): number {
    return 1 + Utils.mod((intervalType - 1), 7);
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
          return "A".repeat(this.quality);
        } else if (this.quality === -1) {
          return "m";
        } else { // this.quality <= -2
          return "d".repeat(-this.quality);
        }
    }
  }

  public toString(): string {
    return `${this.qualityString}${this.type}`;
  }

  private static getSimpleIntervalTypeHalfSteps(simpleIntervalType: number): number {
    Utils.precondition((simpleIntervalType >= 1) && (simpleIntervalType <= 7));

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
      default:
        throw new Error(`Invalid simple interval type: ${simpleIntervalType}`);
    }
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