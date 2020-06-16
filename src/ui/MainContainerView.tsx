import * as React from "react";

import { RoutesView } from './Routes/View';
import { ActionHandler, ActionBus } from '../ActionBus';
import { IAction } from '../IAction';
import { NavigateAction } from '../App/Actions';

export class MainContainerView extends React.Component<{}, {}> {
  public constructor(props: {}) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
    this.mainContainerRef = React.createRef();
  }
  
  private boundHandleAction: ActionHandler;
  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }
  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  public render() {
    return (
      <div className="main-container" ref={this.mainContainerRef}>
        <div className="main">
          <RoutesView />
        </div>
      </div>
    );
  }

  private mainContainerRef: React.Ref<HTMLDivElement>;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case NavigateAction.Id:
        this.scrollBodyToTop();
    }
  }
  private scrollBodyToTop() {
    (this.mainContainerRef as any).current.scrollTo(0, 0);
    window.scrollTo(0, 0); // Needed for mobile devices.
  }
}