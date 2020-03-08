import { History } from "history";

import { DependencyInjector } from '../DependencyInjector';
import { ActionBus, ActionHandler } from '../ActionBus';
import { IAction } from '../IAction';
import { NavigateAction } from './Actions';
import { IDisposable } from '../IDisposable';
import { IAnalytics } from '../Analytics';

export class AppState {}
export class AppModel implements IDisposable {
  public state = new AppState();

  public constructor() {
    this.analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");
    this.boundHandleAction = this.handleAction.bind(this);

    ActionBus.instance.subscribe(this.boundHandleAction);
  }
  public dispose() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  private analytics: IAnalytics;
  private history: History<any>;
  private boundHandleAction: ActionHandler;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case NavigateAction.Id:
        this.history.push((action as NavigateAction).to);
        this.analytics.trackPageView();
        break;
    }
  }
}