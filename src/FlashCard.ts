import * as React from "react";
import * as Utils from "./Utils";

export type FlashCardId = string;

// TODO: add non-unique friendly name
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

export type FlashCardSideRenderFn = string | ((width: number, height: number) => JSX.Element);

export class FlashCardSide {
  public constructor(
    public renderFn: FlashCardSideRenderFn,
    public data: any = null
  ) {}
}