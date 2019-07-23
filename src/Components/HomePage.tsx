import * as React from "react";
import { CardContent, Card } from "@material-ui/core";

import { MainMenu } from './MainMenu';

export class HomePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <p>Falsetto is a collection of free, interactive music theory lessons &amp; exercises. Get started by clicking a link below!</p>
          <MainMenu />
        </CardContent>
      </Card>
    );
  }
}