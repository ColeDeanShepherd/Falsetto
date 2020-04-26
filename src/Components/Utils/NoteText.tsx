import * as React from "react";

export const NoteText: React.FunctionComponent<{}> = props => (
  <p style={{
    color: "#004085",
    backgroundColor: "#cce5ff",
    padding: "1em",
    border: "1px solid #b8daff",
    borderRadius: "4px"
  }}>
    NOTE: {props.children}
  </p>
);