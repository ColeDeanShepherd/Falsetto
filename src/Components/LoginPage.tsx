import * as React from "react";
import { Redirect } from 'react-router';
import { CardContent, Card } from "@material-ui/core";

export class LoginPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    const isAuthenticated = false;

    return isAuthenticated
      ? <Redirect to={{ pathname: '/' }} />
      : (
      <Card>
        <CardContent>
        </CardContent>
      </Card>
    );
  }
}