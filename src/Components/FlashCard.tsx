import * as React from 'react';
import { FlashCardSide } from "../FlashCard";

export function renderFlashCardSide(flashCardSide: FlashCardSide): JSX.Element {
  return callFlashCardSideRenderFn(flashCardSide.renderFn);
}
export function callFlashCardSideRenderFn(renderFn: string | (() => JSX.Element)): JSX.Element {
  if (typeof(renderFn) === 'string') {
    return <span>{renderFn}</span>;
  } else {
    return renderFn();
  }
}