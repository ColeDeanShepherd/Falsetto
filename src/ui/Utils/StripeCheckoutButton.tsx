import * as React from "react";
import { useStripe } from "@stripe/react-stripe-js";

import { DependencyInjector } from '../../DependencyInjector';
import { IServer } from "../../Server";
import { Product } from '../../../../server/src/Products';

export function StripeCheckoutButton(props: { product: Product }): JSX.Element {
  const stripe = useStripe();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!stripe) { return; }

    const { product } = props;
    const server = DependencyInjector.instance.getRequiredService<IServer>("IServer");
    
    const createSessionResult = await server.createStripeCheckoutSession(product.id, product.priceInUsCents);

    const result = await stripe.redirectToCheckout({
      sessionId: createSessionResult.checkoutSessionId
    });

    if (result.error) {
      // TODO: improve
      console.error(result.error.message);
    }
  };

  return (
    <button role="link" onClick={handleClick}>
      Checkout
    </button>
  );
}