import * as React from "react";

import { Rect2D } from '../Rect2D';

export interface IKnowledgeMapProps {
  rect: Rect2D;
}
export class KnowledgeMap extends React.Component<IKnowledgeMapProps, {}> {
  public render(): JSX.Element {
    const { rect } = this.props;

    return (
      <svg
        width={rect.size.width} height={rect.size.height}
        x={rect.position.x} y={rect.position.y}
        viewBox={`0 0 ${rect.size.width} ${rect.size.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg">
      </svg>
    );
  }
}