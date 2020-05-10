import * as React from "react";
import { ActionBus, ActionHandler } from '../ActionBus';
import { IAction } from '../IAction';
import { NavigateAction } from '../App/Actions';
import { DependencyInjector } from '../DependencyInjector';
import { IUserManager } from "../UserManager";
import { Paper } from '@material-ui/core';
import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from '../NavLinkView';
import { Settings } from '../SettingsView';

export interface INavBarViewProps {}
export interface INavBarViewState {
  isMenuVisible: boolean;
  isSettingsVisible: boolean;
}
export class NavBarView extends React.Component<INavBarViewProps, INavBarViewState> {
  public constructor(props: INavBarViewProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
    this.userManager = DependencyInjector.instance.getRequiredService<IUserManager>("IUserManager");

    this.state = {
      isMenuVisible: false,
      isSettingsVisible: false
    };
  }

  private boundHandleAction: ActionHandler;
  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }
  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  public render(): JSX.Element | null {
    const userProfile = this.userManager.getCurrentUser();
    const isAuthenticated = userProfile !== null;
    
    const menu = this.state.isMenuVisible ? (
      <div className="menu-container">
        <Paper style={{ padding: "0 1em 1em 1em" }}>
          <MainMenu collapseCategories={false} />
        </Paper>
      </div>
    ) : null;
    
    const settings = this.state.isSettingsVisible ? (
      <div className="menu-container">
        <Paper style={{ padding: "0 1em 1em 1em" }}>
          <Settings />
        </Paper>
      </div>
    ) : null;

    //{!isAuthenticated ? <a href="/login" onClick={event => { this.userManager.loginWithRedirect(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log In</a> : null}
    //{(isAuthenticated && userProfile) ? <NavLinkView to="/profile" style={{ fontWeight: "normal" }}>{userProfile.fullName}</NavLinkView> : null}
    //{isAuthenticated ? <a href="/logout" onClick={event => { this.userManager.logout(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log Out</a> : null}
    
    return (
      <div>
        <div className="nav-container">
          <div className="nav-bar">
            <NavLinkView to="/">
              <img src="/logo-white.svg" style={{height: "24px", verticalAlign: "sub"}} />
              <span style={{paddingLeft: "0.5em"}} className="hide-on-mobile">Falsetto</span>
            </NavLinkView>
            {false ? <i onClick={event => this.toggleMenu()} className="cursor-pointer material-icons no-select">menu</i> : null}
            <i onClick={event => this.toggleSettings()} className="cursor-pointer material-icons no-select">settings</i>
            <NavLinkView to="/contribute" style={{ fontWeight: "normal" }}>
              Contribute
            </NavLinkView>
          </div>
        </div>
        {menu}
        {settings}
      </div>
    );
  }

  private userManager: IUserManager;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case NavigateAction.Id:
        this.setState({ isMenuVisible: false, isSettingsVisible: false });
    }
  }

  private toggleMenu() {
    const newIsMenuVisible = !this.state.isMenuVisible;
    const newState: any = newIsMenuVisible
      // hide settings if the menu is visible
      ? { isMenuVisible: newIsMenuVisible, isSettingsVisible: false }
      : { isMenuVisible: newIsMenuVisible };
    this.setState(newState);
  }

  private toggleSettings() {
    const newIsSettingsVisible = !this.state.isSettingsVisible;
    const newState: any = newIsSettingsVisible
      // hide the menu if settings are visible
      ? { isMenuVisible: false, isSettingsVisible: newIsSettingsVisible }
      : { isSettingsVisible: newIsSettingsVisible };
    this.setState(newState);
  }

  // TODO: separate menu
}