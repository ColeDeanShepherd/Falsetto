import * as React from "react";
import { Auth0Context } from '../react-auth0-wrapper';

import { ActionBus } from '../ActionBus';
import { Auth0UpdateAction } from './Actions';

export class Auth0InjectorView extends React.Component<{}, {}> {
  static instance: Auth0InjectorView;
  static contextType = Auth0Context;
  
  public constructor(props: {}) {
    super(props);

    Auth0InjectorView.instance = this;
  }

  public componentDidUpdate() {
    if (!this.context.loading) {
      ActionBus.instance.dispatch(new Auth0UpdateAction());
    }
  }

  public render(): JSX.Element | null {
    return null;
  }
}