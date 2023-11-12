import { Button, Group, Stack, useMantineTheme, Text } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { IconLock } from "@tabler/icons-react";
import React from "react";
import {
  COST_PER_SPOTLIGHT,
  formatNumber2Decimals,
  getErrorMessageProps,
} from "shared-utils";
import { useStripeBumpServiceListing } from "@/hooks/service-listing";
import { CheckoutSpotlightListingPayload } from "@/types/types";
import BillingDetailsSection from "../checkout/BillingDetailsSection";
import CheckoutCardSection from "../checkout/CheckoutCardSection";

interface SpotlightListingCheckoutFormProps {
  serviceListingId: number;
}

const SpotlightListingCheckoutForm = ({
  serviceListingId,
}: SpotlightListingCheckoutFormProps) => {
  const theme = useMantineTheme();
  const stripe = useStripe();
  const elements = useElements();
  const stripeBumpServiceListingMutation = useStripeBumpServiceListing();

  const [isPaying, setIsPaying] = useToggle();

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

      notifications.show({
        id: "payment",
        title: "Processing Payment...",
        color: "blue",
        loading: isPaying,
        message:
          "Please do not refresh the page or press Back as we process your payment.",
      });
      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: {
            ...billingDetails.address,
            city: "Singapore",
            country: "SG",
          },
        },
      });

      const payload: CheckoutSpotlightListingPayload = {
        paymentMethodId: result.paymentMethod.id,
        serviceListingId,
      };

      await stripeBumpServiceListingMutation.mutateAsync(payload);
      notifications.hide("payment");
      setIsPaying(false);
    } catch (error: any) {
      setIsPaying(false);
      notifications.hide("payment");
      if (error instanceof TypeError) {
        notifications.show({
          title: "Error Checking Out",
          color: "red",
          message:
            "Please check that you have entered your billing and card details correctly!",
          autoClose: 5000,
        });
      } else {
        notifications.show({
          ...getErrorMessageProps("Error Checking Out", error),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="lg">
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
          Pay ${formatNumber2Decimals(COST_PER_SPOTLIGHT)}
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

export default SpotlightListingCheckoutForm;
