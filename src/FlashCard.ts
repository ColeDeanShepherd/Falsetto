import { Size2D } from './lib/Core/Size2D';

export type FlashCardId = string;

export class FlashCard {
  public static fromRenderFns(
    id: FlashCardId,
    frontSideRenderFn: FlashCardSideRenderFn,
    backSideRenderFn: FlashCardSideRenderFn
  ): FlashCard {
    return new FlashCard(
      id,
      new FlashCardSide(frontSideRenderFn),
      new FlashCardSide(backSideRenderFn)
    );
  }

  public constructor(
    public id: FlashCardId,
    public frontSide: FlashCardSide,
    public backSide: FlashCardSide
  ) {}
}

export type FlashCardSideRenderFn = string | ((size: Size2D) => JSX.Element);

export class FlashCardSide {
  public constructor(
    public renderFn: FlashCardSideRenderFn,
    public data: any = null
  ) {}
}