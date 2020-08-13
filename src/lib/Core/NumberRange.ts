import { precondition } from './Dbc';

export class NumberRange {
  public constructor(
    public minValue: number,
    public maxValue: number
  ) {
    precondition(minValue <= maxValue);
  }

  public contains(value: number): boolean {
    return (value >= this.minValue) && (value <= this.maxValue);
  }

  public containsExclusiveMax(value: number): boolean {
    return (value >= this.minValue) && (value < this.maxValue);
  }

  public intersectsRangeExclusiveMax(other: NumberRange): boolean {
    if (this.minValue >= other.maxValue) { return false; }
    if (this.maxValue <= other.minValue) { return false; }

    return true;
  }

  public fullyContainsRangeExclusiveMax(other: NumberRange): boolean {
    return (this.minValue <= other.minValue) && (this.maxValue >= other.maxValue);
  }

  public isEmptyExclusiveMax(): boolean {
    return this.maxValue <= this.minValue;
  }
}