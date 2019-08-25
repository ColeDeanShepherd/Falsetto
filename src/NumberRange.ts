import * as Utils from "./Utils";

export class NumberRange {
  public constructor(
    public minValue: number,
    public maxValue: number
  ) {
    Utils.precondition(minValue <= maxValue);
  }
}