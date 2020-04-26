import * as React from "react";
import { ActionBus } from './ActionBus';
import { NavigateAction } from './App/Actions';

export interface INavLinkViewProps {
  to: string;
  style?: any;
}
export class NavLinkView extends React.Component<INavLinkViewProps, {}> {
  public render(): JSX.Element | null {
    return <a href={this.props.to} onClick={event => this.onClick(event)} style={this.props.style}>{this.props.children}</a>;
  }

  private onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.stopPropagation();
    event.preventDefault();

    if (!event.ctrlKey) {
      ActionBus.instance.dispatch(new NavigateAction(this.props.to));
    } else {
      window.open(this.props.to, "_blank");
    }
  }
}