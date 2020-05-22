import * as React from "react";
import { Router } from "react-router-dom";
import { History } from "history";

import { NavBarView } from '../NavBar/View';
import { DependencyInjector } from '../DependencyInjector';
import { IAction } from '../IAction';
import { ActionBus, ActionHandler } from '../ActionBus';
import { MainContainerView } from '../MainContainerView';
import { Auth0UpdateAction } from '../Auth0Injector/Actions';

import "./Stylesheet.css"; // TODO: use a CSS preprocessor and split this into multiple files
import { AppBarView } from "../AppBar/View";

export class AppView extends React.Component<{}, {}> {
  public constructor(props: {}) {
    super(props);

    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");

    this.boundHandleAction = this.handleAction.bind(this);
  }

  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }
  
  public render(): JSX.Element | null {
    return (
      <Router history={this.history}>
        <div className="app">
          <AppBarView />
          <MainContainerView />
        </div>
      </Router>
    );
  }

  private history: History<any>;
  
  private boundHandleAction: ActionHandler;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case Auth0UpdateAction.Id:
        this.forceUpdate();
    }
  }
}