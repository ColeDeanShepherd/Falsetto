import * as React from "react";
import LockIcon from '@material-ui/icons/Lock';

import "./Stylesheet.css";

import { premiumProducts } from '../../../Products';

export const PaywallOverlay: React.FunctionComponent<{ premiumProductId: number | undefined }> = props => {
  const premiumProduct = premiumProducts.find(p => p.id === props.premiumProductId);
  const premiumProductName = (premiumProduct !== undefined)
    ? premiumProduct.name
    : "Unknown";

  return (
    <div className="paywall-overlay">
      <p><LockIcon style={{ fontSize: "6em" }} /></p>
      <h3>You must purchase "{premiumProductName}" to view this content.</h3>
    </div>
  );
};