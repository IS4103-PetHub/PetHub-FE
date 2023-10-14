import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import React from "react";
import { formatNumber2Decimals } from "shared-utils";
import CustomPopover from "web-ui/shared/CustomPopover";
import { PLATFORM_FEE_MESSAGE } from "@/types/constants";
import { CartItem, CheckoutSummary } from "@/types/types";

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
          <Box mb="xs" key={cartItem.cartItemId}>
            <Group position="apart">
              <Text size="sm">{cartItem.serviceListing.title}</Text>

              <Text size="sm" weight={500}>
                $
                {formatNumber2Decimals(
                  cartItem.quantity
                    ? cartItem.serviceListing.basePrice * cartItem.quantity
                    : cartItem.serviceListing.basePrice,
                )}{" "}
              </Text>
            </Group>
            <Group position="apart">
              <Text size="sm" color="gray">
                Qty: {cartItem.quantity ?? 1}
              </Text>
              {cartItem.quantity && cartItem.quantity > 1 && (
                <Text size={13} color="gray">
                  ${formatNumber2Decimals(cartItem.serviceListing.basePrice)}{" "}
                  each
                </Text>
              )}
            </Group>
          </Box>
        ))}
      </Stack>
      <Divider mb="xs" />
      <Stack spacing={2}>
        <Group position="apart">
          <Text color="dimmed" size="sm">
            Subtotal ({checkoutSummary.itemCount}{" "}
            {Number(checkoutSummary.itemCount) === 1 ? "item" : "items"})
          </Text>
          <Text color="dimmed" size="sm">
            ${formatNumber2Decimals(checkoutSummary.subtotal)}
          </Text>
        </Group>
        <Group position="apart">
          <Text color="dimmed" size="sm">{`GST (8%)`}</Text>
          <Text color="dimmed" size="sm">
            ${formatNumber2Decimals(checkoutSummary.gst)}
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
            ${formatNumber2Decimals(checkoutSummary.platformFee)}
          </Text>
        </Group>
        <Divider mt="xs" mb="xs" />
        <Group position="apart">
          <Text size="md">Total</Text>
          <Text weight={600} size="lg">
            ${formatNumber2Decimals(checkoutSummary.total)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default CheckoutItemsSection;
