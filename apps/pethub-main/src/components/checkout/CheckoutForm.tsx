import { Button, Stack } from "@mantine/core";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import React from "react";
import { useStripePaymentMethod } from "@/hooks/payment";
import BillingDetailsSection from "./BillingDetailsSection";
import CheckoutCardSection from "./CheckoutCardSection";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const stripePaymentMethodMutation = useStripePaymentMethod();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        // Include any additional collected billing details.
        name: "Jenny Rosen",
        email: "jenny@example.com",
        phone: "91345678",
        address: {
          city: "Nairobi",
          country: "KE",
          line1: "St 1",
          line2: null,
          postal_code: "00100",
          state: null,
        },
      },
      metadata: {
        userId: 1,
        // cart items
      },
    });

    const payload = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_method_id: result.paymentMethod.id,
        //cart items
      }),
    };

    await stripePaymentMethodMutation.mutateAsync(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="lg">
        <BillingDetailsSection />
        <CheckoutCardSection />
      </Stack>
      <Button type="submit" size="md" disabled={!stripe} mt="xl">
        Make Payment
      </Button>
    </form>
  );
};

export default CheckoutForm;
