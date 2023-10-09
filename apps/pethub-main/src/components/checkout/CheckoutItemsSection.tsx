import {
  Card,
  Divider,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import React from "react";
import { Cart } from "@/types/types";
import { formatPriceForDisplay } from "@/util";

interface CheckoutItemsSectionProps {
  cart: Cart;
}

const CheckoutItemsSection = ({ cart }: CheckoutItemsSectionProps) => {
  const theme = useMantineTheme();
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Group position="left" align="flex-start">
        <IconShoppingCart color={theme.colors.indigo[5]} />
        <Text weight={500} size="lg" mb="md" ml={-5}>
          Checkout items ({cart.itemCount})
        </Text>
      </Group>
      <Stack spacing="xs">
        {cart.cartItems.map((cartItem) => (
          <Group position="apart" key={cartItem.cartItemId}>
            <Text color="dimmed">{cartItem.serviceListing.title}</Text>
            <Text color="dimmed">
              ${formatPriceForDisplay(cartItem.serviceListing.basePrice)}
            </Text>
          </Group>
        ))}
      </Stack>
      <Divider mt="md" mb="md" />
      <Group position="apart">
        <Text>Total</Text>
        <Text weight={600}>${formatPriceForDisplay(120.0)}</Text>
      </Group>
    </Card>
  );
};

export default CheckoutItemsSection;
