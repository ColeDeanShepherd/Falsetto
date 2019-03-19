export class Rect {
  public static growAroundCenter(rect: Rect, units: number): Rect {
    return new Rect(
      rect.width + units,
      rect.height + units,
      rect.leftX - (units / 2),
      rect.topY - (units / 2)
    );
  }

  public constructor(
    public width: number,
    public height: number,
    public leftX: number,
    public topY: number
  ) {}
}