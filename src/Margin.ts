export class Margin {
  public constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}
  public get horizontal(): number {
    return this.left + this.right;
  }
  public get vertical(): number {
    return this.top + this.bottom;
  }
}