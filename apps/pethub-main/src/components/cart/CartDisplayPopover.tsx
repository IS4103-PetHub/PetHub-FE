import {
  Popover,
  Text,
  Button,
  Card,
  ScrollArea,
  Group,
  useMantineTheme,
  Box,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoodSad } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { formatNumber2Decimals } from "shared-utils";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import { useCartOperations } from "@/hooks/cart";
import { useCart } from "./CartContext";
import CartIcon from "./CartIcon";
import MiniCartItemCard from "./MiniCartItemCard";

interface CartDisplayPopoverProps {
  size: number;
  userId: number;
}

const CartDisplayPopover = ({ size, userId }: CartDisplayPopoverProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, { close, open }] = useDisclosure(false);
  const { removeItemFromCart, getCartSubtotal, getItemCount, getCurrentCart } =
    useCartOperations(userId);

  const cartItems = getCurrentCart().cartItems;

  return (
    <Popover
      width={500}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      radius="sm"
    >
      <Popover.Target>
        <Button
          onMouseEnter={open}
          onMouseLeave={close}
          variant="subtle"
          sx={{ color: "white", ":hover": { backgroundColor: "transparent" } }}
        >
          <CartIcon size={size} />
        </Button>
      </Popover.Target>
      <Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
        <Text size="lg" weight={700} color="dark" mb="xs">
          Recently added
        </Text>
        <ScrollArea.Autosize mah={300} type="auto">
          {cartItems.length === 0 ? (
            <Box>
              <Center>
                <IconMoodSad
                  size={50}
                  color={theme.colors.gray[4]}
                  strokeWidth="1.5"
                />
              </Center>
              <Text color="dimmed" mb="xs" align="center">
                Your cart is empty
              </Text>
            </Box>
          ) : (
            cartItems
              .slice()
              .reverse()
              .map((item) => (
                <MiniCartItemCard
                  key={item.cartItemId}
                  serviceListing={item.serviceListing}
                  closePopup={close}
                  quantity={item.quantity}
                  removeItem={async () => removeItemFromCart(item.cartItemId)}
                />
              ))
          )}
        </ScrollArea.Autosize>
        <Group position="apart" align="flex-end">
          <Text c="dark" size="md" mb={5}>
            <b>
              Subtotal (
              {getItemCount() === 1 ? "1 item" : `${getItemCount()} items`}):
            </b>{" "}
            ${formatNumber2Decimals(getCartSubtotal())}
          </Text>

          <Button
            onClick={() => {
              router.push("/customer/cart");
              close();
            }}
            color="dark"
            className="gradient-hover"
            mt="xs"
          >
            View shopping cart
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default CartDisplayPopover;
