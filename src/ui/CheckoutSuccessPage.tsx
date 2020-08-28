import * as React from "react";
import { Card } from "./Card/Card";

export function CheckoutSuccessPage(): JSX.Element {
  return (
    <Card>
      <h1>Thanks for your order!</h1>
      <p>
        We appreciate your business!
        If you have any questions, please <a href="https://docs.google.com/forms/d/e/1FAIpQLSfHT8tJTdmW_hCjxMPUf14wchM6GBPQAaq8PSMW05C01gBW4g/viewform" target="_blank" className="button cursor-pointer no-select">contact us</a>.
      </p>
    </Card>
  );
}