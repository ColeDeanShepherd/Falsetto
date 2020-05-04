import * as React from "react";

export const LimitedWidthContentContainer: React.FunctionComponent<{}> = props => (
  <div style={{ margin: "0 auto", maxWidth: "1200px", width: "100%" }}>
    {props.children}
  </div>
);