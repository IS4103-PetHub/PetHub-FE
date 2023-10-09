import { Button, Group, Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { getSession } from "next-auth/react";
import React from "react";
import { getErrorMessageProps } from "shared-utils";
import { useCartOperations } from "@/hooks/cart";
import { useStripePaymentMethod } from "@/hooks/payment";
import BillingDetailsSection from "./BillingDetailsSection";
import CheckoutCardSection from "./CheckoutCardSection";

interface CheckoutFormProps {
  userId: number;
}

const CheckoutForm = ({ userId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const stripePaymentMethodMutation = useStripePaymentMethod();

  const { getCartItems, getItemCount } = useCartOperations(userId);

  const billingForm = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        postal_code: "",
      },
    },

    validate: {
      name: isNotEmpty("Name required."),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email."),
      phone: (value) =>
        /^[0-9]{8}$/.test(value)
          ? null
          : "Phone number should be 8 digits long.",
      address: {
        line1: isNotEmpty("Address Line 1 required."),
        postal_code: (value) =>
          /^\d{6}$/.test(value) ? null : "Postal code should be 6 digits long.",
      },
    },
  });

  const handleSubmit = async (event) => {
    const isValid = billingForm.validate();
    if (!isValid) {
      return;
    }
    // console.log(billingDetails);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    try {
      const billingDetails = billingForm.getTransformedValues();
      const cardNumber = elements.getElement(CardNumberElement);
      const cardCVC = elements.getElement(CardCvcElement);
      const cardExpiry = elements.getElement(CardExpiryElement);

      cardNumber.on("change", ({ error }) => {
        const displayError = document.getElementById("payment-errors");
        if (error) {
          displayError.textContent = error.message;
        }
      });

      const cartItems = getCartItems();
      console.log(cartItems);
      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          // Include any additional collected billing details.
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: billingDetails.address,
        },
      });

      console.log(result);
      const payload = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          payment_method_id: result.paymentMethod.id,
          userId,
          // amount:
          // itemCount:
          // cartItems: [{cartItemId, serviceListingId, quantity}, ...]
        },
      };

      // await stripePaymentMethodMutation.mutateAsync(payload);
    } catch (error: any) {
      notifications.show({
        title: "Error Checking Out",
        color: "red",
        message:
          "Please check that you have entered your billing and card details correctly!",
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="lg">
        <BillingDetailsSection form={billingForm} />
        <CheckoutCardSection />
      </Stack>
      <Group position="right">
        <Button type="submit" size="md" disabled={!stripe} mt="xl">
          Make payment
        </Button>
      </Group>
    </form>
  );
};

export default CheckoutForm;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];
  return { props: { userId } };
}
