export class Vector2D {
  public constructor(public x: number, public y: number) {}

  public plus(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }
  public minus(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }
  public times(s: number): Vector2D {
    return new Vector2D(this.x * s, this.y * s);
  }
  public dividedBy(s: number): Vector2D {
    return new Vector2D(this.x / s, this.y / s);
  }

  public length(): number {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }
  public normalized(): Vector2D {
    const length = this.length();
    return (length > 0)
      ? this.dividedBy(length)
      : new Vector2D(0, 0);
  }

  public plusLength(dl: number): Vector2D {
    const oldLength = this.length();
    const newLength = Math.max(oldLength + dl, 0);
    if ((oldLength <= 0) || (newLength <= 0)) {
      return new Vector2D(0, 0);
    }

    const normalized = this.dividedBy(oldLength);
    return normalized.times(newLength);
  }
}