import * as React from "react";
import LockIcon from '@material-ui/icons/Lock';

import "./Stylesheet.css";

export const PaywallOverlay: React.FunctionComponent<{}> = props => (
  <div className="paywall-overlay">
    <p><LockIcon style={{ fontSize: "6em" }} /></p>
    <h3>You must purchase the course to view this content.</h3>
  </div>
);