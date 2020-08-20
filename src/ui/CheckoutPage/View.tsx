import * as React from "react";
import { CardElement as StripeCardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { Card } from "../../ui/Card/Card";

import "./Stylesheet.css";
import { Button } from '../Button/Button';
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { DependencyInjector } from '../../DependencyInjector';
import { IServer } from "../../Server";
import { premiumProducts } from "../../Products";
import { usCentsToDollarsString } from '../../lib/Core/Currency';
import { useEffect, useState } from "react";
import { loadSessionToken } from "../../Cookies";
import { ActionBus } from "../../ActionBus";
import { NavigateAction } from "../../App/Actions";

const cardOptions = {
  style: {
    base: {
      color: "#424770",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#9e2146"
    }
  }
};

export const CheckoutPage = (props: { productId: number }) => {
  const [error, setError] = useState(undefined);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // redirect to login page if logged out
    const sessionToken = loadSessionToken();

    if (sessionToken === undefined) {
      ActionBus.instance.dispatch(new NavigateAction("/login"));
    }
  });

  const { productId } = props;

  const product = premiumProducts.find(p => p.id === productId);

  const PurchaseForm = () => (
    <form onSubmit={handleSubmit}>
      <StripeCardElement options={cardOptions} />
      <p><Button type="submit" disabled={!stripe}>Buy Now</Button></p>
    </form>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!product) { return; }
    
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(StripeCardElement);

    if (!cardElement) {
      console.error("Failed to find Stripe card element.");
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
      return;
    }

    const server = DependencyInjector.instance.getRequiredService<IServer>("IServer");

    try {
      const purchaseInfo = await server.startPurchase(productId, product.priceInUsCents);
  
      const {} = await stripe.confirmCardPayment(purchaseInfo.stripeClientSecret, {
        payment_method: unwrapValueOrUndefined(paymentMethod).id
      });
    } catch (ex) {
      setError(ex.toString());
    }
  }

  return (
    <Card>
      <h2 className="margin-bottom">
        Checkout
      </h2>

      {product
        ? (
          <div>
            <h3>{product.name} - {usCentsToDollarsString(product.priceInUsCents)}</h3>
            <PurchaseForm />
          </div>
        )
        : <p>Invalid product ID.</p>}

      {error
        ? <div className="alert alert-danger">{error}</div>
        : null}
    </Card>
  );
}