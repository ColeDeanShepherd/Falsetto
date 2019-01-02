import * as Utils from "./Utils";

export class Interval {
  public constructor(public type: number, public quality: number) {
    Utils.invariant(Number.isInteger(type) && (type > 0));
    Utils.invariant(Number.isInteger(quality));
  }

  public get simpleIntervalType(): number {
    return 1 + Utils.mod((this.type - 1), 7);
  }
  public get halfSteps(): number {
    const octaveCount = Math.floor(this.type / 8);
    const simpleIntervalType = 1 + Utils.mod((this.type - 1), 7);

    let simpleIntervalHalfSteps: number;
    switch (simpleIntervalType) {
      case 1:
        simpleIntervalHalfSteps = 0;
        break;
      case 2:
        simpleIntervalHalfSteps = 2;
        break;
      case 3:
        simpleIntervalHalfSteps = 4;
        break;
      case 4:
        simpleIntervalHalfSteps = 5;
        break;
      case 5:
        simpleIntervalHalfSteps = 7;
        break;
      case 6:
        simpleIntervalHalfSteps = 9;
        break;
      case 7:
        simpleIntervalHalfSteps = 11;
        break;
      default:
        throw new Error(`Invalid simple interval type: ${simpleIntervalType}`);
    }

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