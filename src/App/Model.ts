import { History } from "history";

import { precondition } from "../lib/Core/Dbc";
import { DependencyInjector } from "../DependencyInjector";

import { IDisposable } from "../lib/Core/IDisposable";
import { IAnalytics } from "../Analytics";

import { IAction } from "../IAction";
import { ActionBus, ActionHandler } from "../ActionBus";
import { NavigateAction, LoginAction, SignUpAction, LogoutAction } from './Actions';
import { AppMidiModel } from "../AppMidi/Model";
import { PianoAudio } from "../Audio/PianoAudio";
import { saveSessionToken, clearSessionToken } from '../Cookies';

export class AppModel implements IDisposable {
  public static instance: AppModel;
  
  public midiModel: AppMidiModel;
  public pianoAudio: PianoAudio;

  public constructor() {
    precondition(!AppModel.instance);
    
    AppModel.instance = this;

    this.analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");

    this.boundHandleAction = this.handleAction.bind(this);
    ActionBus.instance.subscribe(this.boundHandleAction);
    
    this.midiModel = new AppMidiModel();
    this.pianoAudio = new PianoAudio();
  }

  public dispose() {
    this.midiModel.dispose();

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
      case SignUpAction.Id:
        this.handleSignUpActionAsync(action as SignUpAction);
        break;
      case LoginAction.Id:
        this.handleLoginActionAsync(action as LoginAction);
        break;
      case LogoutAction.Id:
        this.handleLogoutActionAsync(action as LogoutAction);
        break;
    }
  }

  private async handleSignUpActionAsync(signUpAction: SignUpAction) {
    await saveSessionToken(signUpAction.sessionToken);
    ActionBus.instance.dispatch(new NavigateAction("/profile"));
  }

  private async handleLoginActionAsync(loginAction: LoginAction) {
    await saveSessionToken(loginAction.sessionToken);
    ActionBus.instance.dispatch(new NavigateAction("/profile"));
  }

  private async handleLogoutActionAsync(logoutAction: LogoutAction) {
    await clearSessionToken();
    ActionBus.instance.dispatch(new NavigateAction("/"));
  }
}
