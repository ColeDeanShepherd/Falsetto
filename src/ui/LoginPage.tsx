import * as React from "react";
import { Redirect } from 'react-router';
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { NavLinkView } from "./NavLinkView";
import { IServer } from "../Server";
import { DependencyInjector } from '../DependencyInjector';

export interface ILoginPageState {
  email: string;
  password: string;
  error?: string;
}

export class LoginPage extends React.Component<{}, ILoginPageState> {
  public constructor(props: {}) {
    super(props);

    this.server = DependencyInjector.instance.getRequiredService<IServer>("IServer");

    this.boundOnEmailChange = this.onEmailChange.bind(this);
    this.boundOnPasswordChange = this.onPasswordChange.bind(this);

    this.state = {
      email: "",
      password: "",
      error: undefined
    };
  }

  public render(): JSX.Element {
    const { email, password, error } = this.state;

    const isAuthenticated = false;
    
    // TODO: if logged out, redirect to login
    // TODO: if logged in, redirect to profile page

    return isAuthenticated
      ? <Redirect to={{ pathname: '/' }} />
      : (
        <Card>
          <h1 className="margin-bottom">Login</h1>

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
              <Button onClick={() => this.logIn()}>Log in</Button>
            </div>
          </div>

          <p><NavLinkView to="/reset-password">Forgot Password?</NavLinkView> or <NavLinkView to="/sign-up">Sign up</NavLinkView></p>

          {error
            ? <div className="alert alert-danger">{error}</div>
            : null}
        </Card>
    );
  }

  private server: IServer;

  private boundOnEmailChange: (e: any) => void;
  private boundOnPasswordChange: (e: any) => void;

  private onEmailChange(e: any) {
    this.setState({ email: e.target.value });
  }
  
  private onPasswordChange(e: any) {
    this.setState({ password: e.target.value });
  }

  private async logIn() {
    const { email, password } = this.state;

    try {
      await this.server.logIn(email, password);
    } catch (ex) {
      this.setState({ error: ex.message })
    }
  }
}