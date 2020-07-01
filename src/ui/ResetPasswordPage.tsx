import { History } from "history";
import * as QueryString from "query-string";
import * as React from "react";
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { DependencyInjector } from "../DependencyInjector";
import { IServer } from "../Server";

export interface IResetPasswordPageState {
  password: string;
  reEnteredPassword: string;
  error?: string;
}

export class ResetPasswordPage extends React.Component<{}, IResetPasswordPageState> {
  public constructor(props: {}) {
    super(props);

    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");
    this.server = DependencyInjector.instance.getRequiredService<IServer>("IServer");

    this.boundOnPasswordChange = this.onPasswordChange.bind(this);
    this.boundOnReEnteredPasswordChange = this.onReEnteredPasswordChange.bind(this);
    this.boundResetPassword = this.resetPassword.bind(this);

    this.state = {
      password: "",
      reEnteredPassword: "",
      error: undefined
    };
  }
  
  public render(): JSX.Element {
    const { password, reEnteredPassword, error } = this.state;
    
    return (
      <Card>
        <h1 className="margin-bottom">Reset Password</h1>

        <p>Enter your new password below.</p>

        <div>
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
            <Button onClick={this.boundResetPassword}>Reset password</Button>
          </div>
        </div>

        {error
          ? <div className="alert alert-danger">{error}</div>
          : null}
      </Card>
    );
  }

  private history: History<any>;
  private server: IServer;

  private boundOnPasswordChange: (e: any) => void;
  private boundOnReEnteredPasswordChange: (e: any) => void;
  private boundResetPassword: (e: any) => void;

  private getResetPasswordToken(): string | undefined {
    const searchParams = QueryString.parse(this.history.location.search);

    return (searchParams.token !== undefined)
      ? (searchParams.token as string)
      : undefined;
  }
  
  private onPasswordChange(e: any) {
    this.setState({ password: e.target.value });
  }
  
  private onReEnteredPasswordChange(e: any) {
    this.setState({ reEnteredPassword: e.target.value });
  }

  private async resetPassword() {
    const { password, reEnteredPassword } = this.state;
    
    const resetPasswordToken = this.getResetPasswordToken();

    if (resetPasswordToken === undefined) {
      this.setState({ error: "Invalid or expired password reset link." });
      return;
    }

    if (reEnteredPassword != password) {
      this.setState({ error: "Passwords don't match." });
      return;
    }

    try {
      await this.server.resetPassword(resetPasswordToken, password);
    } catch (ex) {
      this.setState({ error: ex.toString() })
    }
  }
}