import * as React from "react";
import { Redirect } from 'react-router';
import { Card } from "../ui/Card/Card";

export class LoginPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    const isAuthenticated = false;

    return isAuthenticated
      ? <Redirect to={{ pathname: '/' }} />
      : (
      <Card>
      </Card>
    );
  }
}