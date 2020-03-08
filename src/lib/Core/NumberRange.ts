import { precondition } from './Dbc';

export class NumberRange {
  public constructor(
    public minValue: number,
    public maxValue: number
  ) {
    precondition(minValue <= maxValue);
  }
}