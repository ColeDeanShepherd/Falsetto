import * as React from "react";
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { NavLinkView } from "./NavLinkView";
import { DependencyInjector } from "../DependencyInjector";
import { IApiClient } from "../ApiClient";
import { ActionBus } from '../ActionBus';
import { SignUpAction, NavigateAction } from '../App/Actions';
import { loadSessionToken } from "../Cookies";

export interface ISignUpPageState {
  email: string;
  password: string;
  reEnteredPassword: string;
  error?: string;
}

export class SignUpPage extends React.Component<{}, ISignUpPageState> {
  public constructor(props: {}) {
    super(props);

    this.apiClient = DependencyInjector.instance.getRequiredService<IApiClient>("IApiClient");

    this.boundOnEmailChange = this.onEmailChange.bind(this);
    this.boundOnPasswordChange = this.onPasswordChange.bind(this);
    this.boundOnReEnteredPasswordChange = this.onReEnteredPasswordChange.bind(this);

    this.state = {
      email: "",
      password: "",
      reEnteredPassword: "",
      error: undefined
    };
  }
  
  
  public componentDidMount() {
    const sessionToken = loadSessionToken();

    if (sessionToken !== undefined) {
      ActionBus.instance.dispatch(new NavigateAction("/profile"));
    }
  }
  
  public render(): JSX.Element {
    const { email, password, reEnteredPassword, error } = this.state;

    // TODO: if logged in, redirect to profile page

    return (
      <Card>
        <h1 className="margin-bottom">Sign Up</h1>

        <div>
          <div className="form-group">
            <TextField
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={this.boundOnEmailChange}
              className="full-width"
              aria-describedby="emailHelp" />
          </div>
          <div className="form-group">
            <TextField
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={this.boundOnPasswordChange}
              className="full-width" />
          </div>
          <div className="form-group">
            <TextField
              id="confirm-password"
              type="password"
              label="Confirm Password"
              value={reEnteredPassword}
              onChange={this.boundOnReEnteredPasswordChange}
              className="full-width" />
          </div>
          <div className="form-group">
            <Button onClick={() => this.signUp()}>Sign up</Button>
          </div>
        </div>
        
        {error
          ? <div className="alert alert-danger">{error}</div>
          : null}
      </Card>
    );
  }

  private apiClient: IApiClient;

  private boundOnEmailChange: (e: any) => void;
  private boundOnPasswordChange: (e: any) => void;
  private boundOnReEnteredPasswordChange: (e: any) => void;

  private onEmailChange(e: any) {
    this.setState({ email: e.target.value });
  }
  
  private onPasswordChange(e: any) {
    this.setState({ password: e.target.value });
  }
  
  private onReEnteredPasswordChange(e: any) {
    this.setState({ reEnteredPassword: e.target.value });
  }
  
  private async signUp() {
    const { email, password, reEnteredPassword } = this.state;

    if (reEnteredPassword != password) {
      this.setState({ error: "Passwords don't match." });
      return;
    }

    try {
      const sessionToken = await this.apiClient.signUpAsync(email, password);
      
      ActionBus.instance.dispatch(new SignUpAction(sessionToken));
    } catch (ex) {
      this.setState({ error: (ex as Error).toString() })
    }
  }
}