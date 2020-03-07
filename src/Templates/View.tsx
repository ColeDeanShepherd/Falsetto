import * as React from "react";

import { TemplateState } from "./Model";

import "./Stylesheet.css";

export interface ITemplateViewProps {}
export interface ITemplateViewState {}
export class TemplateView extends React.Component<ITemplateViewProps, ITemplateViewState> {
  public constructor(props: ITemplateViewProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element | null {
    return null;
  }
}