import * as React from "react";
import { ActionBus, ActionHandler } from '../ActionBus';
import { IAction } from '../IAction';
import { NavigateAction } from '../App/Actions';
//import { DependencyInjector } from '../DependencyInjector';
//import { IUserManager } from "../UserManager";
import { Paper } from '@material-ui/core';
import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from '../NavLinkView';
import { Settings } from '../SettingsView';

import "./Stylesheet.css";
import { AppModel } from '../App/Model';

export interface IAppBarViewProps {}

export interface IAppBarViewState {
  isMenuVisible: boolean;
  isSettingsVisible: boolean;
}

export class AppBarView extends React.Component<IAppBarViewProps, IAppBarViewState> {
  public constructor(props: IAppBarViewProps) {
    super(props);

    //this.userManager = DependencyInjector.instance.getRequiredService<IUserManager>("IUserManager");

    this.boundHandleAction = this.handleAction.bind(this);

    this.state = {
      isMenuVisible: false,
      isSettingsVisible: false
    };
  }

  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  public render(): JSX.Element | null {
    const appModel = AppModel.instance;

    const { isMenuVisible, isSettingsVisible } = this.state;

    // Account Stuff
    //const userProfile = this.userManager.getCurrentUser();
    //const isAuthenticated = userProfile !== null;

    //{!isAuthenticated ? <a href="/login" onClick={event => { this.userManager.loginWithRedirect(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log In</a> : null}
    //{(isAuthenticated && userProfile) ? <NavLinkView to="/profile" style={{ fontWeight: "normal" }}>{userProfile.fullName}</NavLinkView> : null}
    //{isAuthenticated ? <a href="/logout" onClick={event => { this.userManager.logout(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log Out</a> : null}
    
    return (
      <div className="app-bar">
        <NavLinkView to="/" className="button">
          <img src={!appModel.isDarkModeEnabled ? "/logo-black.svg" : "/logo-white.svg"} style={{height: "24px", verticalAlign: "sub"}} />
        </NavLinkView>
        <i onClick={event => this.toggleMenu()} className="material-icons button cursor-pointer no-select">menu</i>
        <i onClick={event => this.toggleSettings()} className="material-icons button cursor-pointer no-select">settings</i>

        {isMenuVisible
          ? (
            <div className="menu-container">
              <Paper style={{ padding: "1em" }}>
                <MainMenu collapseCategories={true} />
              </Paper>
            </div>
          )
          : null}

        {isSettingsVisible
          ? (
            <div className="menu-container">
              <Paper style={{ padding: "0 1em 1em 1em" }}>
                <Settings />
              </Paper>
            </div>
          ) : null}
      </div>
    );
  }

  //private userManager: IUserManager;
  private boundHandleAction: ActionHandler;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case NavigateAction.Id:
        this.setState({ isMenuVisible: false, isSettingsVisible: false });
    }
  }

  private toggleMenu() {
    const { isMenuVisible, isSettingsVisible } = this.state;

    const newIsMenuVisible = !isMenuVisible;

    this.setState({
      isMenuVisible: newIsMenuVisible,
      
      // hide settings if the menu is visible
      isSettingsVisible: newIsMenuVisible ? false : isSettingsVisible
    });
  }

  private toggleSettings() {
    const { isSettingsVisible, isMenuVisible } = this.state;

    const newIsSettingsVisible = !isSettingsVisible;

    this.setState({
      isSettingsVisible: newIsSettingsVisible,
      
      // hide menu if the settings are visible
      isMenuVisible: newIsSettingsVisible ? false : isMenuVisible
    });
  }
}