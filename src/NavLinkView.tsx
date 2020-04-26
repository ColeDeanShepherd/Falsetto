import * as React from "react";
import { ActionBus } from './ActionBus';
import { NavigateAction } from './App/Actions';

export interface INavLinkViewProps {
  to: string;
  openNewTab?: boolean;
  style?: any;
}
export class NavLinkView extends React.Component<INavLinkViewProps, {}> {
  public render(): JSX.Element | null {
    const { to, style, children } = this.props;

    return <a href={to} onClick={event => this.onClick(event)} style={style}>{children}</a>;
  }

  private onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const { to } = this.props;
    const openNewTab = (this.props.openNewTab !== undefined)
      ? this.props.openNewTab
      : false;

    event.stopPropagation();
    event.preventDefault();

    if (!openNewTab && !event.ctrlKey) {
      ActionBus.instance.dispatch(new NavigateAction(to));
    } else {
      window.open(to, "_blank");
    }
  }
}