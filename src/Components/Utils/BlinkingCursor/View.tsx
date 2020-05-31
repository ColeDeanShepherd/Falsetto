import * as React from "react";

import "./Stylesheet.css"; // TODO: use a CSS preprocessor and split this into multiple files

export class BlinkingCursorView extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return<span className="blinking-cursor">|</span>;
  }
}