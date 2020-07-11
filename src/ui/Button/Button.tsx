import * as React from "react";
import { Button as MaterialUiButton } from "@material-ui/core";

export interface IButtonProps {
  onPointerDown?: ((event: React.PointerEvent<HTMLElement>) => void);
  onClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void);
  type?: "submit";
  disabled?: boolean;
  className?: string;
  color?: string;
  style?: any;
}

export const Button: React.FunctionComponent<IButtonProps> = props => {
  const color = (props.color !== undefined) // TODO: use
    ? props.color
    : "primary";
  const style = Object.assign({ textTransform: "none" }, props.style);
  
  return (
    <MaterialUiButton
      variant="contained"
      onPointerDown={props.onPointerDown}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
      className={props.className ? props.className : ""}
      style={style}
    >
      {props.children}
    </MaterialUiButton>
  );
};