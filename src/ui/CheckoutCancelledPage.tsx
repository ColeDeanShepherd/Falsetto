import * as React from "react";
import { Card } from "./Card/Card";

export function CheckoutCancelledPage(): JSX.Element {
  return (
    <Card>
      <h1>Your order has been cancelled.</h1>
      <p>
        If you have any questions, please email
        <a href="mailto:orders@example.com">orders@example.com</a>.
        TODO
      </p>
    </Card>
  );
}