import * as React from 'react';
import * as Utils from "./Utils";

export type FlashCardSide = string | (() => JSX.Element);

export class FlashCard {
  public constructor(
    public frontSide: FlashCardSide,
    public backSide: FlashCardSide
  ) {}
}

export function invertFlashCards(flashCards: Array<FlashCard>): Array<FlashCard> {
  const frontSides = flashCards.map(flashCard => flashCard.frontSide);
  const distinctBackSides = Utils.uniq(flashCards.map(flashCard => flashCard.backSide));
  return distinctBackSides
    .map(backSide => {
      const frontSideRenderFuncs = frontSides
        .filter((_, i) => backSide === flashCards[i].backSide)
        .map(frontSide => {
          if (typeof(frontSide) === 'string') {
            return () => React.createElement("span", null, frontSide);
          } else {
            return frontSide;
          }
        });
      const renderFunc = () => React.createElement(
        "span",
        null,
        Utils.arrayJoin(frontSideRenderFuncs.map(rf => rf()), React.createElement("span", null, ", "))
      );

      return new FlashCard(
        backSide,
        renderFunc, 
      );
    });
}