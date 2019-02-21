import * as Utils from "./Utils";

export class Rational {
  public constructor(
    public numerator: number,
    public denominator: number
  ) {
    Utils.invariant(denominator !== 0);
  }

  public get reciprocal(): Rational {
    Utils.precondition(this.numerator !== 0);

    return new Rational(this.denominator, this.numerator);
  }
  public get negated(): Rational {
    return new Rational(-this.numerator, this.denominator);
  }
  public get reduced(): Rational {
    // TODO: actually reduce
    return new Rational(this.numerator, this.denominator);
  }
  public get asReal(): number {
    return this.numerator / this.denominator;
  }

  public add(other: Rational): Rational {
    // TODO: use LCM of denominator
    return new Rational(
      (this.numerator * other.denominator) + (other.numerator * this.denominator),
      (this.denominator * other.denominator)
    );
  }
  public subtract(other: Rational): Rational {
    // TODO: optimize
    return this.add(other.negated);
  }
  public multiply(other: Rational): Rational {
    return new Rational(
      (this.numerator * other.numerator),
      (this.denominator * other.denominator)
    );
  }
  public divide(other: Rational): Rational {
    // TODO: optimize
    return this.multiply(other.reciprocal);
  }
  public exponentiate(exponent: number) {
    return new Rational(
      Math.pow(this.numerator, exponent),
      Math.pow(this.denominator, exponent)
    );
  }

  public isGreaterThan(other: Rational): boolean {
    // TODO: optimize
    return this.asReal > other.asReal;
  }
  public isGreaterThanOrEqualTo(other: Rational): boolean {
    // TODO: optimize
    return this.asReal >= other.asReal;
  }
  public isLessThan(other: Rational): boolean {
    // TODO: optimize
    return this.asReal < other.asReal;
  }
  public isLessThanOrEqualTo(other: Rational): boolean {
    // TODO: optimize
    return this.asReal <= other.asReal;
  }

  // TODO: fix
  public equals(other: Rational): boolean {
    return Math.abs(this.asReal - other.asReal) < 0.001;
  }

  public toString(): string {
    return `${this.numerator} / ${this.denominator}`;
  }
}