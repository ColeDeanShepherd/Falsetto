import * as Utils from "../../Utils";

export class Interval {
  public constructor(public type: number, public quality: number) {}

  public get simpleIntervalType(): number {
    return 1 + Utils.mod((this.type - 1), 7);
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