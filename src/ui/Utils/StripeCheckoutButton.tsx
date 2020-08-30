import * as React from "react";
import { useStripe } from "@stripe/react-stripe-js";

import { DependencyInjector } from '../../DependencyInjector';
import { IApiClient } from "../../ApiClient";
import { Button } from "../Button/Button";
import { PremiumProduct } from '../../Products';

export function StripeCheckoutButton(props: { product: PremiumProduct }): JSX.Element {
  const stripe = useStripe();

  const handleClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!stripe) { return; }

    const { product } = props;
    const apiClient = DependencyInjector.instance.getRequiredService<IApiClient>("IApiClient");
    
    const createSessionResult = await apiClient.createStripeCheckoutSession(product.id, product.priceInUsCents);

    const result = await stripe.redirectToCheckout({
      sessionId: createSessionResult.checkoutSessionId
    });

    if (result.error) {
      // TODO: improve
      console.error(result.error.message);
    }
  };

  return (
    <Button onClick={handleClick}>Purchase</Button>
  );
}