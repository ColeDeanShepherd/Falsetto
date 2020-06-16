import * as React from "react";
import { Redirect } from 'react-router';
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { NavLinkView } from "./NavLinkView";

export class SignUpPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    // TODO: if logged in, redirect to profile page

    return (
      <Card>
        <h1 className="margin-bottom">Sign Up</h1>

        <div>
          <div className="form-group">
            <TextField id="email" type="email" label="Email" className="full-width" aria-describedby="emailHelp" />
          </div>
          <div className="form-group">
            <TextField id="password" type="password" label="Password" className="full-width" />
          </div>
          <div className="form-group">
            <TextField id="confirm-password" type="password" label="Confirm Password" className="full-width" />
          </div>
          <div className="form-group">
            <Button onClick={() => this.signUp()}>Sign up</Button>
          </div>
        </div>
      </Card>
  );
  }

  private signUp() {
    // TODO: make request to server
  }
}