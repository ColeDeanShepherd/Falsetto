import * as React from "react";
import { Card } from "./Card/Card";

export function CheckoutCancelledPage(): JSX.Element {
  return (
    <Card>
      <h1>Your order has been cancelled.</h1>
      <p>
        If you have any questions, please <a href="https://docs.google.com/forms/d/e/1FAIpQLSfHT8tJTdmW_hCjxMPUf14wchM6GBPQAaq8PSMW05C01gBW4g/viewform" target="_blank" className="button cursor-pointer no-select">contact us</a>.
      </p>
    </Card>
  );
}