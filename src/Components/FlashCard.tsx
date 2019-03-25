import * as React from "react";
import { FlashCardSide, FlashCardSideRenderFn } from "../FlashCard";

export function renderFlashCardSide(width: number, height: number, flashCardSide: FlashCardSide): JSX.Element {
  return callFlashCardSideRenderFn(width, height, flashCardSide.renderFn);
}
export function callFlashCardSideRenderFn(
  width: number, height: number,
  renderFn: FlashCardSideRenderFn
): JSX.Element {
  if (typeof(renderFn) === "string") {
    return <span>{renderFn}</span>;
  } else {
    return renderFn(width, height);
  }
}