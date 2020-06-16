import * as React from "react";
import { Redirect } from 'react-router';
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { NavLinkView } from "./NavLinkView";

export class LoginPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
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
              <TextField id="email" type="email" label="Email" className="full-width" aria-describedby="emailHelp" />
            </div>
            <div className="form-group">
              <TextField id="password" type="password" label="Password" className="full-width" />
            </div>
            <div className="form-group">
              <Button onClick={() => this.logIn()}>Log in</Button>
            </div>
          </div>

          <p><NavLinkView to="/reset-password">Forgot Password?</NavLinkView> or <NavLinkView to="/sign-up">Sign up</NavLinkView></p>
        </Card>
    );
  }

  private logIn() {
    // TODO: make request to server
  }
}