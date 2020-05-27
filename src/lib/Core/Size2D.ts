export class Size2D {
  public constructor(
    public width: number,
    public height: number
  ) {}
  
  public times(s: number): Size2D {
    return new Size2D(this.width * s, this.height * s);
  }
  
  public dividedBy(s: number): Size2D {
    return new Size2D(this.width / s, this.height / s);
  }
}