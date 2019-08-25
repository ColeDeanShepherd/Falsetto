import * as React from "react";

import * as Utils from "../Utils";
import { Size2D } from "../Size2D";
import { Vector2D } from "../Vector2D";
import { Rect2D } from "../Rect2D";

export interface IAudioSpectrumProps {
  spectrum: Uint8Array;
  rect: Rect2D;
  style?: any;
}
export class AudioSpectrum extends React.Component<IAudioSpectrumProps, {}> {
  public render(): JSX.Element {
    const { spectrum, style } = this.props;
    const svgRect = this.props.rect;

    const numBars = spectrum.length;
    const barMarginX = 1;
    const totalMarginX = barMarginX * (numBars - 1);
    const barWidth = (svgRect.size.width - totalMarginX) / numBars
    const maxValue = Utils.uint8ArrayMax(spectrum);

    const bars = Utils.uint8ArrayMap(
      spectrum,
      (v, i) => {
        const barHeight = svgRect.size.height * (v / maxValue);
        const rect = new Rect2D(
          new Size2D(barWidth, barHeight),
          new Vector2D(i * (barWidth + barMarginX), svgRect.size.height - barHeight)
        );
        
        return (
          <rect
            key={i}
            x={rect.position.x} y={rect.position.y}
            width={rect.size.width} height={rect.size.height}
            fill="black"
          />
        );
      });

    return (
      <svg
        width={svgRect.size.width} height={svgRect.size.height}
        x={svgRect.position.x} y={svgRect.position.y}
        viewBox={`0 0 ${svgRect.size.width} ${svgRect.size.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
        {bars}
      </svg>
    );
  }
}