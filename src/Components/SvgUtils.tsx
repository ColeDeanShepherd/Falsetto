import * as React from "react";
import { Vector2D } from '../Vector2D';
import { Size2D } from '../Size2D';

export function renderMultiLineSvgText(
  lines: Array<string>, position: Vector2D, lineHeightEms: number, isVerticallyAligned: boolean, textProps: any, tspanProps: any
): JSX.Element {
  const startDyEms = isVerticallyAligned
    ? ((-Math.floor((lines.length - 1) / 2) * lineHeightEms) + (0.35 * (lines.length % 2))) // TODO: fix
    : 0;

  return (
    <text x={position.x} y={position.y} {...textProps}>
      {lines.map((l, i) => <tspan x={position.x} dy={(i > 0) ? `${lineHeightEms}em` : `${startDyEms}em`} {...tspanProps}>{l}</tspan>)}
    </text>
  );
}
export function getRectRoundedBottomPathDefString(
  topLeftPos: Vector2D,
  size: Size2D,
  radius: number
): string {
  return `M ${topLeftPos.x} ${topLeftPos.y} h ${size.width} v ${size.height - radius} a ${radius} ${radius} 0 0 1 ${-radius} ${radius} h ${-(size.width - (2 * radius))} a ${radius} ${radius} 0 0 1 ${-radius} ${-radius} Z`;
}