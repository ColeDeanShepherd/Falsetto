import * as React from "react";
import { Card } from "./Card/Card";

export function CheckoutSuccessPage(): JSX.Element {
  return (
    <Card>
      <h1>Thanks for your order!</h1>
      <p>
        We appreciate your business!
        If you have any questions, please email
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </p>
    </Card>
  );
}