import * as React from "react";

export interface INavLinkViewProps {
  to: string;
  activeClassName?: string; // TODO: implement
  style?: any;
}
export class NavLinkView extends React.Component<INavLinkViewProps, {}> {
  public render(): JSX.Element | null {
    return <a href={this.props.to} style={this.props.style}>{this.props.children}</a>;
  }
}