import * as React from "react";
import { Card, CardContent } from '@material-ui/core';
import { KnowledgeMap } from './KnowledgeMap';
import { Rect2D } from '../Rect2D';
import { Size2D } from '../Size2D';
import { Vector2D } from '../Vector2D';

export class KnowledgeMapPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <KnowledgeMap rect={new Rect2D(new Size2D(1024, 640), new Vector2D(0, 0))} />
        </CardContent>
      </Card>
    );
  }
}