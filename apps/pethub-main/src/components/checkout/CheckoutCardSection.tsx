import { Card, Grid, Group, Input, Text, useMantineTheme } from "@mantine/core";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import {
  StripeCardCvcElementOptions,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementOptions,
} from "@stripe/stripe-js";
import { IconCreditCard } from "@tabler/icons-react";
import React from "react";

const elementStyle = {
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
};

const CARD_NUMBER_ELEMENT_OPTIONS = {
  style: elementStyle,
  showIcon: true,
  iconStyle: "solid",
} as StripeCardNumberElementOptions;

const CSV_ELEMENT_OPTIONS = {
  style: elementStyle,
} as StripeCardCvcElementOptions;

const EXPIRY_ELEMENT_OPTIONS = {
  style: elementStyle,
} as StripeCardExpiryElementOptions;

const CheckoutCardSection = () => {
  const theme = useMantineTheme();

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Group position="left" align="flex-start">
        <IconCreditCard color={theme.colors.indigo[5]} />
        <Text weight={500} size="lg" mb="md" ml={-5}>
          Card details
        </Text>
      </Group>
      <Grid columns={24}>
        <Grid.Col span={24}>
          <Input.Wrapper label="Card Number" required>
            <Input<any>
              component={CardNumberElement}
              options={CARD_NUMBER_ELEMENT_OPTIONS}
            />
          </Input.Wrapper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Input.Wrapper label="Expiry" required>
            <Input<any>
              component={CardExpiryElement}
              options={CSV_ELEMENT_OPTIONS}
            />
          </Input.Wrapper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Input.Wrapper label="CVC" required>
            <Input<any>
              component={CardCvcElement}
              options={EXPIRY_ELEMENT_OPTIONS}
            />
          </Input.Wrapper>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
export default CheckoutCardSection;
