import * as React from "react";

import "./Stylesheet.css"; // TODO: use a CSS preprocessor and split this into multiple files

export const Card: React.FunctionComponent<{ className?: string, style?: any }> = props => (
  <div className={"card" + (props.className ? ` ${props.className}` : "")} style={props.style}>
    {props.children}
  </div>
);