import * as React from "react";
import { Button as MaterialUiButton } from "@material-ui/core";

export interface IButtonProps {
  onPointerDown?: ((event: React.PointerEvent<HTMLElement>) => void);
  onClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void);
  disabled?: boolean;
  className?: string;
  color?: string;
  style?: any;
}

export const Button: React.FunctionComponent<IButtonProps> = props => {
  const color = (props.color !== undefined)
    ? props.color
    : "primary";
  const style = Object.assign({ textTransform: "none" }, props.style);
  
  return (
    <MaterialUiButton
      variant="contained"
      onPointerDown={props.onPointerDown}
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className ? props.className : ""}
      style={style}
    >
      {props.children}
    </MaterialUiButton>
  );
};