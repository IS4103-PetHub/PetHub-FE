import { Card, Grid, Text } from "@mantine/core";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import React from "react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "var(--font-inter)",
      fontSmoothing: "antialiased",
      fontSize: "17px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutCardSection = () => {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Text weight={500} size="lg" mb="md">
        Card details
      </Text>
      <Grid columns={20}>
        <Grid.Col span={20}>
          <Text weight={500} size="sm">
            Card Number
          </Text>
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </Grid.Col>

        <Grid.Col span={2}>
          <Text weight={500} size="sm">
            Expiry
          </Text>
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
        </Grid.Col>

        <Grid.Col span={2}>
          <Text weight={500} size="sm">
            CVC
          </Text>
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
        </Grid.Col>
      </Grid>
      {/* <CardElement options={CARD_ELEMENT_OPTIONS} /> */}
    </Card>
  );
};
export default CheckoutCardSection;
