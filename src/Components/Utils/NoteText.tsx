import * as React from "react";

export const NoteText: React.FunctionComponent<{}> = props => (
  <p className="alert alert-primary">
    NOTE: {props.children}
  </p>
);