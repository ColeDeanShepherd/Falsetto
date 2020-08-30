import * as React from "react";
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";
import { DependencyInjector } from "../DependencyInjector";
import { IApiClient } from "../ApiClient";

export interface IForgotPasswordPageState {
  email: string;
  succeeded: boolean;
  error?: string;
}

export class ForgotPasswordPage extends React.Component<{}, IForgotPasswordPageState> {
  public constructor(props: {}) {
    super(props);

    this.apiClient = DependencyInjector.instance.getRequiredService<IApiClient>("IApiClient");

    this.boundOnEmailChange = this.onEmailChange.bind(this);

    this.state = {
      email: "",
      succeeded: false,
      error: undefined
    };
  }
  
  public render(): JSX.Element {
    const { email, succeeded, error } = this.state;

    return (
      <Card>
        <h1 className="margin-bottom">Forgot Password</h1>

        {!succeeded
          ? (
            <div>
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
                  <Button onClick={() => this.emailPasswordResetLink()}>Email password reset link</Button>
                </div>
              </div>

              {error
                ? <div className="alert alert-danger">{error}</div>
                : null}
            </div>
          )
          : (
            <p>If the email address above is registered with Falsetto, it has been sent a password recovery email which should arrive within 15 minutes.</p>
          )}
      </Card>
    );
  }

  private apiClient: IApiClient;

  private boundOnEmailChange: (e: any) => void;
  
  private onEmailChange(e: any) {
    this.setState({ email: e.target.value });
  }

  private async emailPasswordResetLink() {
    const { email } = this.state;

    try {
      await this.apiClient.emailResetPasswordLinkAsync(email);
      this.setState({ succeeded: true });
    } catch (ex) {
      this.setState({ error: ex.toString() })
    }
  }
}