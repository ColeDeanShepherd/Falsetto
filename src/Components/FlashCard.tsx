import * as React from 'react';
import { FlashCardSide } from "../FlashCard";

export function renderFlashCardSide(flashCardSide: FlashCardSide): JSX.Element {
  if (typeof(flashCardSide.renderFn) === 'string') {
    return <span>{flashCardSide.renderFn}</span>;
  } else {
    return flashCardSide.renderFn();
  }
}