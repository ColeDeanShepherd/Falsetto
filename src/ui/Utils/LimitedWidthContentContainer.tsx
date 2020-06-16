import * as React from "react";

export const LimitedWidthContentContainer: React.FunctionComponent<{ maxWidth?: number, style?: any }> = props => {
  const maxWidth = (props.maxWidth !== undefined) ? props.maxWidth : 1200;
  const style = { margin: "0 auto", maxWidth: `${maxWidth}px`, width: "100%", ...props.style };

  return (
    <div style={style}>
      {props.children}
    </div>
  );
};