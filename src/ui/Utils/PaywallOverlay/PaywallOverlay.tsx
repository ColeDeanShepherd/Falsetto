import * as React from "react";
import LockIcon from '@material-ui/icons/Lock';

import "./Stylesheet.css";

import { premiumProducts } from '../../../Products';
import { ActionBus } from "../../../ActionBus";
import { NavigateAction } from "../../../App/Actions";

export const PaywallOverlay: React.FunctionComponent<{ premiumProductId: number | undefined }> = props => {
  const premiumProduct = premiumProducts.find(p => p.id === props.premiumProductId);
  const premiumProductName = (premiumProduct !== undefined)
    ? premiumProduct.name
    : "Unknown";
  
  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ActionBus.instance.dispatch(new NavigateAction("/login"));
  };

  return (
    <div className="paywall-overlay cursor-pointer" onClick={onClick}>
      <p><LockIcon style={{ fontSize: "6em" }} /></p>
      <h3>Click to purchase "{premiumProductName}" and view this content.</h3>
    </div>
  );
};