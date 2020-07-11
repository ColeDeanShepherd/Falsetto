import * as React from "react";

import { Card } from "../../ui/Card/Card";

export class CheckoutPage extends React.Component<{}, {}> {
  public componentDidMount() {
  }

  public render(): JSX.Element {
    return (
      <Card>
        <h2 className="margin-bottom">
          Checkout
        </h2>
        <p>Test checkout page</p>

        <form id="payment-form">
          <div id="card-element"></div>
          <div id="card-errors" role="alert"></div>
          <button id="submit">Pay</button>
        </form>
      </Card>
    );
  }
}