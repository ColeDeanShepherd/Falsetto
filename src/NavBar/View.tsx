import * as React from "react";
import { ActionBus, ActionHandler } from '../ActionBus';
import { IAction } from '../IAction';
import { NavigateAction } from '../App/Actions';
import { DependencyInjector } from '../DependencyInjector';
import { IUserManager } from "../UserManager";
import { Paper } from '@material-ui/core';
import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from '../NavLinkView';

export interface INavBarViewProps {}
export interface INavBarViewState {
  isMenuVisible: boolean;
}
export class NavBarView extends React.Component<INavBarViewProps, INavBarViewState> {
  public constructor(props: INavBarViewProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
    this.userManager = DependencyInjector.instance.getRequiredService<IUserManager>("IUserManager");

    this.state = {
      isMenuVisible: false
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
          <MainMenu />
        </Paper>
      </div>
    ) : null;

    //{!isAuthenticated ? <a href="/login" onClick={event => { this.userManager.loginWithRedirect(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log In</a> : null}
    //{(isAuthenticated && userProfile) ? <NavLinkView to="/profile" activeClassName="" style={{ fontWeight: "normal" }}>{userProfile.fullName}</NavLinkView> : null}
    //{isAuthenticated ? <a href="/logout" onClick={event => { this.userManager.logout(); event.preventDefault(); event.stopPropagation(); }} style={{ fontWeight: "normal" }}>Log Out</a> : null}
    
    return (
      <div>
        <div className="nav-container">
          <div className="nav-bar">
            <NavLinkView to="/" activeClassName="">
              <img src="/logo-white.svg" style={{height: "24px", verticalAlign: "sub"}} />
              <span style={{paddingLeft: "0.5em"}} className="hide-on-mobile">Falsetto</span>
            </NavLinkView>
            <NavLinkView to="/support-us" activeClassName="" style={{ fontWeight: "normal" }}>
              Support Us
            </NavLinkView>
            <a
              href="https://github.com/ColeDeanShepherd/Falsetto-Client"
              target="_blank"
              className="menu-link"
              style={{ fontWeight: "normal" }}
            >
              <img src="/github-logo.png" alt="GitHub" style={{display: "block", width: "32px", height: "32px", padding: "5px 0"}} />
            </a>
            <i onClick={event => this.toggleMenu()} className="cursor-pointer material-icons no-select">menu</i>
          </div>
        </div>
        {menu}
      </div>
    );
  }

  private userManager: IUserManager;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case NavigateAction.Id:
        this.setState({ isMenuVisible: false });
    }
  }
  private toggleMenu() {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  }

  // TODO: separate menu
}