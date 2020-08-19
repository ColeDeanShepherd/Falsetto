import * as React from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { Card } from "../../ui/Card/Card";

import "./Stylesheet.css";
import { Button } from '../Button/Button';
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { DependencyInjector } from '../../DependencyInjector';
import { IServer } from "../../Server";
import { premiumProducts } from "../../Products";

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
  const stripe = useStripe();
  const elements = useElements();

  const { productId } = props;

  const product = premiumProducts.find(p => p.id === productId);

  const PurchaseForm = () => (
    <form onSubmit={handleSubmit}>
      <CardElement options={cardOptions} />
      <Button type="submit" disabled={!stripe}>Pay</Button>
    </form>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    const cardElement = elements.getElement(CardElement);

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
    const purchaseInfo = await server.startPurchase(productId);

    const {} = await stripe.confirmCardPayment(purchaseInfo.stripeClientSecret, {
      payment_method: unwrapValueOrUndefined(paymentMethod).id
    });
  }

  return (
    <Card>
      <h2 className="margin-bottom">
        Checkout
      </h2>

      {product
        ? <PurchaseForm />
        : <p>Invalid product ID.</p>}
    </Card>
  );
}