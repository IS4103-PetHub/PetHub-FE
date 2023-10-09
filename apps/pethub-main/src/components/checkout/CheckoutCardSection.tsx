import { Card, Grid, Input, Text, TextInput } from "@mantine/core";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeCardNumberElementOptions } from "@stripe/stripe-js";
import React from "react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "var(--font-inter)",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      lineHeight: "32px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },

  showIcon: true,
  iconStyle: "solid",
} as StripeCardNumberElementOptions;

const CheckoutCardSection = () => {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Text weight={500} size="lg" mb="md">
        Card details
      </Text>
      <Grid columns={24}>
        <Grid.Col span={24}>
          <Input.Wrapper label="Card Number" required>
            <Input<any>
              component={CardNumberElement}
              options={CARD_ELEMENT_OPTIONS}
            />
          </Input.Wrapper>
          {/* <Text weight={500} size="sm">
                Card Number
              </Text> */}
          {/* <CardNumberElement options={CARD_ELEMENT_OPTIONS} /> */}
        </Grid.Col>

        <Grid.Col span={3}>
          <Input.Wrapper label="Expiry" required>
            <Input<any>
              component={CardExpiryElement}
              options={CARD_ELEMENT_OPTIONS}
            />
          </Input.Wrapper>
          {/* <Text weight={500} size="sm">
            Expiry
          </Text>
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} /> */}
        </Grid.Col>

        <Grid.Col span={3}>
          <Input.Wrapper label="CVC" required>
            <Input<any>
              component={CardCvcElement}
              options={CARD_ELEMENT_OPTIONS}
            />
          </Input.Wrapper>
          {/* <Text weight={500} size="sm">
            CVC
          </Text>
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} /> */}
        </Grid.Col>
      </Grid>
      {/* <CardElement options={CARD_ELEMENT_OPTIONS} /> */}
    </Card>
  );
};
export default CheckoutCardSection;
