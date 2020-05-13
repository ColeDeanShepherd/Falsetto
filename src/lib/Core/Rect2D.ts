import { Vector2D } from './Vector2D';
import { Size2D } from './Size2D';

export class Rect2D {
  public constructor(public size: Size2D, public position: Vector2D) {}

  public get center(): Vector2D {
    return new Vector2D(
      this.position.x + (this.size.width / 2),
      this.position.y + (this.size.height / 2)
    );
  }

  public get left(): number {
    return this.position.x;
  }

  public get right(): number {
    return this.position.x + this.size.width;
  }

  public get top(): number {
    return this.position.y;
  }
  
  public get bottom(): number {
    return this.position.y + this.size.height;
  }
}