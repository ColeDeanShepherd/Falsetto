import * as React from "react";
import { Redirect } from 'react-router';

export class LogoutPage extends React.Component<{}, {}> {
  public componentDidMount() {
    // TODO: logout
  }
  public render(): JSX.Element {
    return <Redirect to={{ pathname: '/' }} />;
  }
}