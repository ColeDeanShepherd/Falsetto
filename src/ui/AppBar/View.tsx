import * as React from "react";

import Close from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';

import { ActionBus, ActionHandler } from '../../ActionBus';
import { IAction } from '../../IAction';
import { NavigateAction } from '../../App/Actions';
import { MainMenu } from '../../ui/MainMenu';
import { NavLinkView } from '../../ui/NavLinkView';
import { Settings } from '../../ui/SettingsView';

import "./Stylesheet.css";
import { Card } from "../../ui/Card/Card";

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
    const { isMenuVisible, isSettingsVisible } = this.state;

    const isMenuContainerVisible = isMenuVisible || isSettingsVisible;

    // Account Stuff
    //const userProfile = this.userManager.getCurrentUser();
    //const isAuthenticated = userProfile !== null;

    //{!isAuthenticated ? <a href="/login" onClick={event => { this.userManager.loginWithRedirect(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log In</a> : null}
    //{(isAuthenticated && userProfile) ? <NavLinkView to="/profile" style={{ fontWeight: "normal" }}>{userProfile.fullName}</NavLinkView> : null}
    //{isAuthenticated ? <a href="/logout" onClick={event => { this.userManager.logout(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log Out</a> : null}
    
    return (
      <div>
        <div className="app-bar">
          <NavLinkView to="/" className="button">
            <img src="/logo-black.svg" style={{height: "24px", verticalAlign: "sub"}} />
          </NavLinkView>
          <span onClick={event => this.toggleMenu()} className="button cursor-pointer no-select"><MenuIcon /></span>
          <span onClick={event => this.toggleSettings()} className="button cursor-pointer no-select"><SettingsIcon /></span>
          <span onClick={event => this.onUserPress()} className="button cursor-pointer no-select"><PersonIcon /></span>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfHT8tJTdmW_hCjxMPUf14wchM6GBPQAaq8PSMW05C01gBW4g/viewform" target="_blank" className="button cursor-pointer no-select"><MailIcon /></a>
        </div>
        {isMenuContainerVisible
          ? (
            <div className="menu-container">
              {isMenuVisible
                  ? (
                    <Card className="menu-card">
                      <Close
                        onClick={event => this.toggleMenu()}
                        className="menu-close-button"
                      />
                      <MainMenu collapseCategories={false} />
                    </Card>
                  )
                  : null}

              {isSettingsVisible
                ? (
                  <Card className="menu-card" style={{ padding: "0 1em 1em 1em" }}>
                      <Close
                        onClick={event => this.toggleSettings()}
                        className="menu-close-button"
                      />
                    <Settings />
                  </Card>
                ) : null}
            </div>
          )
          : null}
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

  private onUserPress() {
    ActionBus.instance.dispatch(new NavigateAction("/login"));
  }
}