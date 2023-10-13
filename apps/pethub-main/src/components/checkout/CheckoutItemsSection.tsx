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
import CustomPopover from "web-ui/shared/CustomPopover";
import { PLATFORM_FEE, PLATFORM_FEE_MESSAGE } from "@/types/constants";
import { CartItem, CheckoutSummary } from "@/types/types";
import { formatPriceForDisplay } from "@/util";

interface CheckoutItemsSectionProps {
  cartItems: CartItem[];
  checkoutSummary: CheckoutSummary;
}

const CheckoutItemsSection = ({
  cartItems,
  checkoutSummary,
}: CheckoutItemsSectionProps) => {
  const theme = useMantineTheme();
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Group position="left" align="flex-start">
        <IconShoppingCart color={theme.colors.indigo[5]} />
        <Text weight={500} size="lg" mb="md" ml={-5}>
          Checkout items
        </Text>
      </Group>
      <Stack spacing={2}>
        {cartItems.map((cartItem) => (
          <Group position="apart" key={cartItem.cartItemId}>
            <Text size="sm">{cartItem.serviceListing.title}</Text>
            <Text size="sm">
              ${formatPriceForDisplay(cartItem.serviceListing.basePrice)}
            </Text>
          </Group>
        ))}
      </Stack>
      <Divider mt="xs" mb="xs" />
      <Stack spacing={2}>
        <Group position="apart">
          <Text color="dimmed" size="sm">
            Subtotal ({checkoutSummary.itemCount}{" "}
            {Number(checkoutSummary.itemCount) === 1 ? "item" : "items"})
          </Text>
          <Text color="dimmed" size="sm">
            ${formatPriceForDisplay(checkoutSummary.subtotal)}
          </Text>
        </Group>
        <Group position="apart">
          <Text color="dimmed" size="sm">{`GST (8%)`}</Text>
          <Text color="dimmed" size="sm">
            ${formatPriceForDisplay(checkoutSummary.gst)}
          </Text>
        </Group>
        <Group position="apart">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text size="sm" c="dimmed">
              Platform fee
            </Text>
            <CustomPopover text={PLATFORM_FEE_MESSAGE}>{}</CustomPopover>
          </div>
          <Text color="dimmed" size="sm">
            ${formatPriceForDisplay(PLATFORM_FEE)}
          </Text>
        </Group>
        <Divider mt="xs" mb="xs" />
        <Group position="apart">
          <Text size="md">Total</Text>
          <Text weight={600} size="lg">
            ${formatPriceForDisplay(checkoutSummary.total)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default CheckoutItemsSection;
