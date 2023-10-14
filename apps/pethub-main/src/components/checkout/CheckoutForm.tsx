import { Button, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { IconLock } from "@tabler/icons-react";
import React from "react";
import { formatNumber2Decimals, getErrorMessageProps } from "shared-utils";
import { useCartOperations } from "@/hooks/cart";
import { useStripePaymentMethod } from "@/hooks/payment";
import { CartItem, CheckoutSummary } from "@/types/types";
import BillingDetailsSection from "./BillingDetailsSection";
import CheckoutCardSection from "./CheckoutCardSection";
import CheckoutItemsSection from "./CheckoutItemsSection";

interface CheckoutFormProps {
  userId: number;
  checkoutSummary: CheckoutSummary;
}

const CheckoutForm = ({ userId, checkoutSummary }: CheckoutFormProps) => {
  const theme = useMantineTheme();
  const stripe = useStripe();
  const elements = useElements();
  const stripePaymentMethodMutation = useStripePaymentMethod();

  const [isPaying, setIsPaying] = useToggle();

  const { getSelectedCartItems } = useCartOperations(userId);
  const cartItems: CartItem[] = getSelectedCartItems();

  const amount = formatNumber2Decimals(checkoutSummary.total);

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

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here which would refresh the page.
    event.preventDefault();

    const { hasErrors } = billingForm.validate();

    if (hasErrors || !stripe || !elements) {
      return;
    }

    try {
      setIsPaying(true);
      const billingDetails = billingForm.getTransformedValues();
      const cardNumber = elements.getElement(CardNumberElement);

      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: billingDetails.address,
        },
      });

      // console.log(result);
      const payload = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          payment_method_id: result.paymentMethod.id,
          userId,
          totalPrice: Number(checkoutSummary.total),
          cartItems: cartItems.map((cartItem) => {
            return {
              serviceListingId: cartItem.serviceListing.serviceListingId,
              quantity: cartItem.quantity ?? 1,
            };
          }),
        },
      };
      console.log(payload);
      const res = await stripePaymentMethodMutation.mutateAsync(payload);
      console.log(res);
      setIsPaying(false);
    } catch (error: any) {
      if (error instanceof TypeError) {
        notifications.show({
          title: "Error Checking Out",
          color: "red",
          message:
            "Please check that you have entered your billing and card details correctly!",
          autoClose: 5000,
        });
      } else {
        setIsPaying(false);
        notifications.show({
          ...getErrorMessageProps("Error Checking Out", error),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="lg">
        <CheckoutItemsSection
          cartItems={cartItems}
          checkoutSummary={checkoutSummary}
        />
        <BillingDetailsSection form={billingForm} />
        <CheckoutCardSection />
      </Stack>
      <Group position="right">
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!stripe || !elements}
          mt="xl"
          color="dark"
          className="gradient-hover"
          loading={isPaying}
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
