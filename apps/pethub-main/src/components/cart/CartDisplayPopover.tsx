import { Popover, Text, Button, Card, ScrollArea, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useCartOperations } from "@/hooks/cart";
import { formatPriceForDisplay } from "@/util";
import CartIcon from "./CartIcon";
import MiniCartItemCard from "./MiniCartItemCard";

interface CartDisplayPopoverProps {
  size: number;
  userId: number;
}

const CartDisplayPopover = ({ size, userId }: CartDisplayPopoverProps) => {
  const router = useRouter();
  const [opened, { close, open }] = useDisclosure(false);
  const { getCartItems, removeItemFromCart, getCartSubtotal, getItemCount } =
    useCartOperations(userId);

  const cartItems = getCartItems();

  return (
    <Popover
      width={500}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
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
          Recently added items
        </Text>
        <ScrollArea.Autosize mah={300} type="auto">
          {cartItems.length === 0 ? (
            <Text color="dark" mb="xs" align="center">
              The cart is currently empty
            </Text>
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
        <Group position="apart">
          <Text c="dark" size="sm">
            Subtotal (
            {getItemCount() === 1 ? "1 item" : `${getItemCount()} items`}): $
            {formatPriceForDisplay(getCartSubtotal())}
          </Text>

          <Button
            onClick={() => {
              router.push("/customer/cart");
              close();
            }}
            variant="gradient"
            mt={2}
          >
            View my shopping cart
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default CartDisplayPopover;