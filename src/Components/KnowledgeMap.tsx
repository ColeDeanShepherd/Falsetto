import * as React from "react";

import { Rect2D } from '../Rect2D';
import App from './App';
import { renderMultiLineSvgText } from './SvgUtils';
import { Vector2D } from '../Vector2D';

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
            const nodeCenter = new Vector2D(nodeX + nodeRadius, nodeY + nodeRadius);
            const nameLines = s.name.split(' ');

            return (
              <g>
                <circle
                  cx={nodeCenter.x} cy={nodeCenter.y}
                  r={nodeRadius}
                  fill={nodeFillColor}
                  strokeWidth={nodeStrokeWidth}
                  stroke={nodeStrokeColor}
                />
                {renderMultiLineSvgText(nameLines, nodeCenter, 1, true, { style: textStyle }, null)}
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