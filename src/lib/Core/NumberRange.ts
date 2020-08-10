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
}