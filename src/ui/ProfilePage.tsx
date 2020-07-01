import * as React from "react";

import { Card } from "../ui/Card/Card";
import { loadSessionToken } from '../Cookies';
import { ActionBus } from '../ActionBus';
import { NavigateAction } from '../App/Actions';
import { NavLinkView } from './NavLinkView';

export class ProfilePage extends React.Component<{}, {}> {
  public componentDidMount() {
    // TODO: get profile info & validate session token

    const sessionToken = loadSessionToken();

    if (sessionToken === undefined) {
      ActionBus.instance.dispatch(new NavigateAction("/login"));
    }
  }

  public render(): JSX.Element {
    return (
      <Card>
        <h1>My Profile</h1>
        <p><NavLinkView to="/logout">Logout</NavLinkView></p>
      </Card>
    );
  }
}