import * as React from "react";

export const LimitedWidthContentContainer: React.FunctionComponent<{ maxWidth?: number }> = props => {
  const maxWidth = (props.maxWidth !== undefined) ? props.maxWidth : 1200;

  return (
    <div style={{ margin: "0 auto", maxWidth: `${maxWidth}px`, width: "100%" }}>
      {props.children}
    </div>
  );
};