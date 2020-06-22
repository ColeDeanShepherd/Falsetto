import * as React from "react";
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { DependencyInjector } from "../DependencyInjector";
import { IServer } from "../Server";

export interface IResetPasswordPageState {
  email: string;
  error?: string;
}

export class ResetPasswordPage extends React.Component<{}, IResetPasswordPageState> {
  public constructor(props: {}) {
    super(props);

    this.server = DependencyInjector.instance.getRequiredService<IServer>("IServer");

    this.boundOnEmailChange = this.onEmailChange.bind(this);

    this.state = {
      email: "",
      error: undefined
    };
  }
  
  public render(): JSX.Element {
    const { email, error } = this.state;

    return (
      <Card>
        <h1 className="margin-bottom">Reset Password</h1>

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
            <Button onClick={() => this.resetPassword()}>Reset password</Button>
          </div>
        </div>

        {error
          ? <div className="alert alert-danger">{error}</div>
          : null}
      </Card>
    );
  }

  private server: IServer;

  private boundOnEmailChange: (e: any) => void;
  
  private onEmailChange(e: any) {
    this.setState({ email: e.target.value });
  }

  private async resetPassword() {
    const { email } = this.state;

    try {
      await this.server.resetPassword(email);
    } catch (ex) {
      this.setState({ error: ex.message })
    }
  }
}