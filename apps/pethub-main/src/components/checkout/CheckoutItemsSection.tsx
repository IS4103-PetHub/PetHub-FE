import {
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCoins, IconShoppingCart } from "@tabler/icons-react";
import { formatNumber2Decimals } from "shared-utils";
import CustomPopover from "web-ui/shared/CustomPopover";
import { PLATFORM_FEE_MESSAGE } from "@/types/constants";
import { CartItem, CheckoutSummary } from "@/types/types";

interface CheckoutItemsSectionProps {
  cartItems: CartItem[];
  checkoutSummary: CheckoutSummary;
  userAvailablePoints: number;
  pointsToUse: number | "";
  onChangePoints(points: number): void;
}

const CheckoutItemsSection = ({
  cartItems,
  checkoutSummary,
  userAvailablePoints,
  pointsToUse,
  onChangePoints,
}: CheckoutItemsSectionProps) => {
  const theme = useMantineTheme();
  // const [pointsToUse, setPointsToUse] = useState<number | "">(0);

  function calculateMaxPointsCanUse() {
    const platformFeeToPoints = checkoutSummary.platformFee * 100;
    if (userAvailablePoints > platformFeeToPoints) {
      return platformFeeToPoints;
    }
    return userAvailablePoints;
  }
  const maxPoints = calculateMaxPointsCanUse();

  return (
    <>
      <Card shadow="sm" radius="md" withBorder>
        <Group position="left" align="flex-start">
          <IconCoins color={theme.colors.indigo[5]} />
          <Text weight={500} size="lg" mb="md" ml={-5}>
            Use points
          </Text>
        </Group>
        <Text size="sm" mb="xs">
          You have a total of <strong>{userAvailablePoints}</strong> points.
          <br />
          You may use up to <strong>{maxPoints}</strong> points for this
          purchase.{" "}
        </Text>
        <Group align="flex-end">
          <NumberInput
            label="Points to use"
            placeholder="Points"
            value={pointsToUse}
            onChange={onChangePoints}
            w={200}
            min={0}
            max={maxPoints}
            step={10}
          />
          <Button
            compact
            variant="light"
            mb={5}
            onClick={() => onChangePoints(maxPoints)}
          >
            Use max
          </Button>
          <Button
            compact
            variant="light"
            color="gray"
            mb={5}
            ml={-5}
            display={Number(pointsToUse) > 0 ? "flex" : "none"}
            onClick={() => onChangePoints(0)}
          >
            Clear
          </Button>
        </Group>
        {Number(pointsToUse) > 0 && (
          <Text color="dimmed" size="sm" mt="xs">
            ${formatNumber2Decimals(Number(pointsToUse) / 100)} will be deducted
            from the total cost.
          </Text>
        )}
      </Card>
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
                    cartItem.serviceListing.basePrice * cartItem.quantity,
                  )}{" "}
                </Text>
              </Group>
              <Group position="apart">
                <Text size="sm" color="gray">
                  Qty: {cartItem.quantity}
                </Text>
                {cartItem.quantity > 1 && (
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
            <Text color="dimmed" size="sm">
              Points offset
            </Text>
            <Text color="dimmed" size="sm">
              - ${formatNumber2Decimals(Number(pointsToUse) / 100)}
            </Text>
          </Group>
          <Divider mt="xs" mb="xs" />
          <Group position="apart">
            <Text size="md">Total</Text>
            <Text weight={600} size="lg">
              $
              {formatNumber2Decimals(
                pointsToUse
                  ? checkoutSummary.total - Number(pointsToUse) / 100
                  : checkoutSummary.total,
              )}
            </Text>
          </Group>
        </Stack>
      </Card>
    </>
  );
};

export default CheckoutItemsSection;
