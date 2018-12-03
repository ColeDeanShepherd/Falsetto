export type FlashCardSide = string | (() => JSX.Element);

export class FlashCard {
  public constructor(
    public frontSide: FlashCardSide,
    public backSide: FlashCardSide
  ) {}
}