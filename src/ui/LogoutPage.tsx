import * as React from "react";
import { ActionBus } from "../ActionBus";
import { LogoutAction } from '../App/Actions';

export class LogoutPage extends React.Component<{}, {}> {
  public componentDidMount() {
    ActionBus.instance.dispatch(new LogoutAction());
  }

  public render(): JSX.Element | null {
    return null;
  }
}