import * as React from "react";
import * as Utils from "./Utils";

export type FlashCardSideRenderFn = string | ((width: number, height: number) => JSX.Element);

export class FlashCardSide {
  public constructor(
    public renderFn: FlashCardSideRenderFn,
    public data: any = null
  ) {}
}

export class FlashCard {
  public static fromRenderFns(
    frontSideRenderFn: FlashCardSideRenderFn,
    backSideRenderFn: FlashCardSideRenderFn
  ): FlashCard {
    return new FlashCard(
      new FlashCardSide(frontSideRenderFn),
      new FlashCardSide(backSideRenderFn)
    );
  }

  public constructor(
    public frontSide: FlashCardSide,
    public backSide: FlashCardSide
  ) {}
}

export function invertFlashCards(
  flashCards: Array<FlashCard>,
  enabledFlashCardIndices: Array<number> | undefined
): ({
  invertedFlashCards: Array<FlashCard>,
  invertedEnabledFlashCardIndices: Array<number> | undefined
}) {
  const oldFrontSides = flashCards.map(flashCard => flashCard.frontSide);
  const distinctOldBackSides = Utils.uniq(flashCards.map(flashCard => flashCard.backSide));

  const result = {
    invertedFlashCards: new Array<FlashCard>(),
    invertedEnabledFlashCardIndices: enabledFlashCardIndices ? new Array<number>() : undefined
  };

  for (const oldBackSide of distinctOldBackSides) {
    const newFrontSide = oldBackSide;

    const matchingOldFrontSideIndices = oldFrontSides
      .map((_, i) => (flashCards[i].backSide === oldBackSide) ? i : -1)
      .filter(i => i >= 0);
    const matchingOldFrontSides = matchingOldFrontSideIndices
      .map(i => oldFrontSides[i]);
    
    // invert and add the new flash card
    const newBackSideChildRenderFns = matchingOldFrontSides
      .map(frontSide => {
        if (typeof(frontSide.renderFn) === "string") {
          return (width: number, height: number) => React.createElement("span", null, frontSide.renderFn);
        } else {
          return frontSide.renderFn;
        }
      });
    const newBackSideRenderFn = (width: number, height: number) => {
      const spanChildren = Utils.arrayJoin(
        newBackSideChildRenderFns.map(rf => rf(width, height)),
        React.createElement("span", null, ", ")
      );

      return React.createElement(
        "span",
        null,
        spanChildren
      );
    };
    const newBackSideData = matchingOldFrontSides.map(fs => fs.data);
    const newBackSide = new FlashCardSide(
      newBackSideRenderFn,
      newBackSideData
    );

    result.invertedFlashCards.push(
      new FlashCard(newFrontSide, newBackSide)
    );

    // add new enabled flash card indices
    if (enabledFlashCardIndices && result.invertedEnabledFlashCardIndices) {
      if (matchingOldFrontSideIndices.some(i => Utils.arrayContains(enabledFlashCardIndices, i))) {
        const newInvertedFlashCardIndex = result.invertedFlashCards.length - 1;
        result.invertedEnabledFlashCardIndices.push(newInvertedFlashCardIndex);
      }
    }
  }

  return result;
}