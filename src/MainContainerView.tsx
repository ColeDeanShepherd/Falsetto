import * as React from "react";

import * as Utils from "./Utils";
import { RoutesView } from './Routes/View';
import { FooterView } from "./Footer/View";
import { MAX_MAIN_CARD_WIDTH } from './Components/Style';
import { flashCardSets } from './FlashCardGraph';
import { ActionHandler, ActionBus } from './ActionBus';
import { IAction } from './IAction';
import { NavigateAction } from './App/Actions';

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
          <div style={{ maxWidth: MAX_MAIN_CARD_WIDTH, margin: "0 auto" }}>
            <RoutesView />
            {false ? <textarea value={Utils.flattenArrays(flashCardSets.map(fcs => fcs.createFlashCards().map(fc => fc.id))).join("\n")} readOnly /> : null}
          </div>
          <FooterView />
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