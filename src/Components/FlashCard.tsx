import * as React from 'react';
import { FlashCardSide } from "../FlashCard";

export function renderFlashCardSide(flashCardSide: FlashCardSide): JSX.Element {
  if (typeof(flashCardSide) === 'string') {
    return <span>{flashCardSide}</span>;
  } else {
    return flashCardSide();
  }
}