import * as React from 'react';
import * as Utils from "./Utils";

export type FlashCardSide = string | (() => JSX.Element);

export class FlashCard {
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
    const matchingOldFrontSideIndices = oldFrontSides
      .map((_, i) => (flashCards[i].backSide === oldBackSide) ? i : -1)
      .filter(i => i >= 0);
    const matchingOldFrontSides = matchingOldFrontSideIndices
      .map(i => oldFrontSides[i]);
    
    // invert and add the new flash card
    const newBackSideRenderFuncs = matchingOldFrontSides
      .map(frontSide => {
        if (typeof(frontSide) === 'string') {
          return () => React.createElement("span", null, frontSide);
        } else {
          return frontSide;
        }
      });
    const newBackSideRenderFunc = () => React.createElement(
      "span",
      null,
      Utils.arrayJoin(newBackSideRenderFuncs.map(rf => rf()), React.createElement("span", null, ", "))
    );

    result.invertedFlashCards.push(
      new FlashCard(
        oldBackSide,
        newBackSideRenderFunc, 
      )
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