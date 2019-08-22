import * as React from "react";
import { FlashCardSide, FlashCardSideRenderFn } from "../FlashCard";
import { Size2D } from '../Size2D';

export function renderFlashCardSide(size: Size2D, flashCardSide: FlashCardSide): JSX.Element {
  return callFlashCardSideRenderFn(size, flashCardSide.renderFn);
}
export function callFlashCardSideRenderFn(
  size: Size2D,
  renderFn: FlashCardSideRenderFn
): JSX.Element {
  if (typeof(renderFn) === "string") {
    return <span>{renderFn}</span>;
  } else {
    return renderFn(size);
  }
}