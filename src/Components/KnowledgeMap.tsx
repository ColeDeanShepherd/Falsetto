import * as React from "react";

import { Rect2D } from '../Rect2D';
import App from './App';

export interface IKnowledgeMapProps {
  rect: Rect2D;
}
export class KnowledgeMap extends React.Component<IKnowledgeMapProps, {}> {
  public render(): JSX.Element {
    const { rect } = this.props;

    const nodeRadius = 30;
    const nodeDiameter = 2 * nodeRadius;
    
    const baseX = nodeRadius;
    const baseY = nodeRadius;

    const nodeFillColor = "white";
    const nodeStrokeWidth = "1";
    const nodeStrokeColor = "black";
    const xMargin = 40;
    const yMargin = 20;
    const textStyle: any = {
      textAnchor: "middle"
    };

    const nodes = App.instance.groupedFlashCardSets
      .map((g, gi) => {
        const nodeY = baseY + (gi * (nodeDiameter + yMargin));

        const nodesInGroup = g.flashCardSets
          .map((s, si) => {
            const nodeX = baseX + (si * (nodeDiameter + xMargin));
            const cx = nodeX + nodeRadius;
            const cy = nodeY + nodeRadius;

            return (
              <g>
                <circle
                  cx={cx} cy={cy}
                  r={nodeRadius}
                  fill={nodeFillColor}
                  strokeWidth={nodeStrokeWidth}
                  stroke={nodeStrokeColor}
                />
                <text x={cx} y={cy} style={textStyle}>{s.name}</text>
              </g>
            );
          });

        return (
          <g>
            {nodesInGroup}
          </g>
        );
      });

    return (
      <svg
        width={rect.size.width} height={rect.size.height}
        x={rect.position.x} y={rect.position.y}
        viewBox={`0 0 ${rect.size.width} ${rect.size.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg">
        {nodes}
      </svg>
    );
  }
}