import * as React from "react";

import { Rect2D } from '../Rect2D';
import { renderMultiLineSvgText } from './SvgUtils';
import { Vector2D } from '../Vector2D';
import { SvgPanZoom } from './SvgPanZoom';
import { groupedFlashCardSets } from '../FlashCardGraph';

export interface IKnowledgeMapProps {
  rect: Rect2D;
}
export class KnowledgeMap extends React.Component<IKnowledgeMapProps, {}> {
  public render(): JSX.Element {
    const { rect } = this.props;

    const nodeWidth = 100;
    const nodeHeight = 90;
    
    const baseX = 10;
    const baseY = 10;

    const nodeFillColor = "white";
    const nodeStrokeWidth = "1";
    const nodeStrokeColor = "black";
    const xMargin = 40;
    const yMargin = 20;
    const textStyle: any = {
      textAnchor: "middle"
    };

    const nodes = groupedFlashCardSets
      .map((g, gi) => {
        const nodeY = baseY + (gi * (nodeWidth + yMargin));

        const nodesInGroup = g.flashCardSets
          .map((s, si) => {
            const nodeX = baseX + (si * (nodeWidth + xMargin));
            const nodeCenter = new Vector2D(nodeX + (nodeWidth / 2), nodeY + (nodeHeight / 2));
            const nameLines = s.name.split(' ');

            return (
              <g>
                <rect
                  x={nodeX} y={nodeY}
                  width={nodeWidth} height={nodeHeight}
                  fill={nodeFillColor}
                  strokeWidth={nodeStrokeWidth}
                  stroke={nodeStrokeColor}
                  rx="10"
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
      <SvgPanZoom
        width={rect.size.width} height={rect.size.height}
        x={rect.position.x} y={rect.position.y}
        viewBox={`0 0 ${rect.size.width} ${rect.size.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg">
        {nodes}
      </SvgPanZoom>
    );
  }
}