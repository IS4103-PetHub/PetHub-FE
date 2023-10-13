import { Button, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { IconLock } from "@tabler/icons-react";
import React from "react";
import { useCartOperations } from "@/hooks/cart";
import { useStripePaymentMethod } from "@/hooks/payment";
import { formatPriceForDisplay } from "@/util";
import BillingDetailsSection from "./BillingDetailsSection";
import CheckoutCardSection from "./CheckoutCardSection";
import CheckoutItemsSection from "./CheckoutItemsSection";

interface CheckoutFormProps {
  userId: number;
}

const CheckoutForm = ({ userId }: CheckoutFormProps) => {
  const theme = useMantineTheme();
  const stripe = useStripe();
  const elements = useElements();

  const stripePaymentMethodMutation = useStripePaymentMethod();

  const { getCurrentCart } = useCartOperations(userId);
  const cart = getCurrentCart();
  console.log(cart);

  const amount = formatPriceForDisplay(19);

  console.log(
    cart.cartItems.map((cartItem) => {
      return {
        cartItemId: cartItem.cartItemId,
        serviceListingId: cartItem.serviceListing.serviceListingId,
        quantity: cartItem.quantity ?? 1,
      };
    }),
  );

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
          itemCount: cart.itemCount,
          cartItems: cart.cartItems.map((cartItem) => {
            return {
              cartItemId: cartItem.cartItemId,
              serviceListingId: cartItem.serviceListing.serviceListingId,
              quantity: cartItem.quantity ?? 1,
            };
          }),
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
        <CheckoutItemsSection cart={cart} />
        <BillingDetailsSection form={billingForm} />
        <CheckoutCardSection />
      </Stack>
      <Group position="right">
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!stripe}
          mt="xl"
          color="dark"
          className="gradient-hover"
        >
          Pay ${amount}
        </Button>
      </Group>
      <Group position="center" mt="sm">
        <IconLock color={theme.colors.gray[5]} size="1.2rem" />
        <Text color="dimmed" size="sm" align="center" mb={-2} ml={-10}>
          Payments are secure and encrypted via Stripe
        </Text>
      </Group>
    </form>
  );
};

export default CheckoutForm;
