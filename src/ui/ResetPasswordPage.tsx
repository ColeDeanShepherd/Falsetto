import * as React from "react";
import { TextField } from "@material-ui/core";

import { Card } from "../ui/Card/Card";
import { Button } from "./Button/Button";

export class ResetPasswordPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <h1 className="margin-bottom">Reset Password</h1>

        <div>
          <div className="form-group">
            <TextField id="email" type="email" label="Email" className="full-width" aria-describedby="emailHelp" />
          </div>
          <div className="form-group">
            <Button onClick={() => this.resetPassword()}>Reset password</Button>
          </div>
        </div>
      </Card>
    );
  }

  private resetPassword() {
    // TODO: make request to server
  }
}