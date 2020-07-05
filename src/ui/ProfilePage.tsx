import * as React from "react";

import { Card } from "../ui/Card/Card";
import { loadSessionToken } from '../Cookies';
import { ActionBus } from '../ActionBus';
import { NavigateAction } from '../App/Actions';
import { NavLinkView } from './NavLinkView';
import { IServer } from "../Server";
import { DependencyInjector } from "../DependencyInjector";
import { UserProfile } from '../UserProfile';
import { Button } from "./Button/Button";

export interface IProfilePageState {
  userProfile: UserProfile | undefined
}

export class ProfilePage extends React.Component<{}, IProfilePageState> {
  public constructor(props: {}) {
    super(props);

    this.server = DependencyInjector.instance.getRequiredService<IServer>("IServer");

    this.boundLogout = this.logout.bind(this);

    this.state = {
      userProfile: undefined
    };
  }

  public componentDidMount() {
    // TODO: get profile info & validate session token

    // redirect to login page if logged out
    const sessionToken = loadSessionToken();

    if (sessionToken === undefined) {
      ActionBus.instance.dispatch(new NavigateAction("/login"));
    }

    // get profile info
    this.loadProfile();
  }

  public render(): JSX.Element {
    const { userProfile } = this.state;

    return (
      <Card>
        {(userProfile !== undefined)
          ? (
            <div>
              <h1>Welcome, {userProfile.email}</h1>
              <p><Button onClick={this.boundLogout}>Logout</Button></p>
              <p>{this.getBoughtProductsString(userProfile)}</p>
            </div>
          )
          : <p>Loading...</p>}
      </Card>
    );
  }

  private server: IServer;
  private boundLogout: () => void;
  
  private async loadProfile() {
    // TODO: error handling
    const userProfile = await this.server.getProfile();
    this.setState({ userProfile: userProfile });
  }

  private getBoughtProductsString(userProfile: UserProfile): string {
    if (userProfile.boughtProductIds.length === 0) {
      return "You have not bought any products from Falsetto.";
    } else {
      return "TODO";
    }
  }

  private logout() {
    ActionBus.instance.dispatch(new NavigateAction("/logout"));
  }
}