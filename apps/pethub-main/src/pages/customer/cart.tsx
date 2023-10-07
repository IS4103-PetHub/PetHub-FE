import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconShoppingCartExclamation,
  IconX,
} from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import CartItemBadge from "@/components/cart/CartItemBadge";
import CartItemCard from "@/components/cart/CartItemCard";
import { useCartOperations } from "@/hooks/cart";
import { formatPriceForDisplay } from "@/util";

interface CartProps {
  userId: number;
}

export default function Cart({ userId }: CartProps) {
  const {
    cart,
    addItemToCart,
    removeItemFromCart,
    getCartItems,
    setItemQuantity,
    getCartItem,
    clearCart,
    getItemCount,
  } = useCartOperations(userId);
  const theme = useMantineTheme();
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [expiredItems, setExpiredItems] = useState({});
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  useEffect(() => {
    const updatedCartItems = getCartItems();
    setCartItems(updatedCartItems);
    const initialCheckedState = {};
    const initialExpiredState = {};
    updatedCartItems.forEach((item) => {
      initialCheckedState[item.cartItemId] = true; // default is all boxes checked
      initialExpiredState[item.cartItemId] = false; // default is all items not expired
    });
    setCheckedItems(initialCheckedState);
    setExpiredItems(initialExpiredState);
    if (cartItems.length === 0) {
      setHasNoFetchedRecords(true);
    }
  }, [cart]);

  function handleItemCheckChange(cartItemId, isChecked) {
    setCheckedItems((prev) => ({
      ...prev,
      [cartItemId]: isChecked,
    }));
  }

  function handleAllCheckChange(isChecked) {
    const newState = {};
    cartItems.forEach((item) => {
      newState[item.cartItemId] = isChecked;
    });
    setCheckedItems(newState);
  }

  function setCardExpired(cartItemId, isExpired) {
    setExpiredItems((prev) => ({
      ...prev,
      [cartItemId]: isExpired,
    }));
  }

  const calculateTotalBuyables = () => {
    let totalBuyables = 0;
    cartItems.forEach((item) => {
      if (!expiredItems[item.cartItemId] && checkedItems[item.cartItemId]) {
        // Check if item is not expired and is checked
        totalBuyables += item.quantity || 1; // Rmr some items got quantity
      }
    });
    return totalBuyables;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      if (!expiredItems[item.cartItemId] && checkedItems[item.cartItemId]) {
        // Check if item is not expired and is checked
        if (item.quantity) {
          totalPrice += item.quantity * item.serviceListing.basePrice;
        } else {
          totalPrice += item.serviceListing.basePrice;
        }
      }
    });
    return totalPrice;
  };

  const clearAllCartItems = () => {
    clearCart();
    notifications.show({
      title: "Cart Cleared",
      color: "green",
      message: "All items have been removed from your cart",
    });
  };

  function checkout() {
    notifications.show({
      title: "Checking out cart placeholder",
      color: "orange",
      message: "TODO: implement checkout and book",
    });
  }

  // As long as all non-expired items are checked, this will be true
  const areAllChecked = cartItems.every((item) =>
    expiredItems[item.cartItemId] ? true : checkedItems[item.cartItemId],
  );

  const emptyCartMessage = (
    <Transition mounted={hasNoFetchedRecords} transition="fade" duration={100}>
      {(styles) => (
        <div style={styles}>
          <SadDimmedMessage
            title="Your cart is empty"
            subtitle="Add items from the available service listings to the cart before proceeding to checkout"
            replaceIcon={
              <IconShoppingCartExclamation
                size={80}
                color={
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[6]
                    : theme.colors.gray[4]
                }
                strokeWidth="1.5"
              />
            }
          />
        </div>
      )}
    </Transition>
  );

  return (
    <>
      <Head>
        <title>My Cart - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
        <Group position="apart">
          <PageTitle title={`My Cart (${getItemCount()})`} mb="lg" />
        </Group>
        {cartItems.length === 0 ? (
          <>{emptyCartMessage}</>
        ) : (
          <Grid gutter="xl">
            <Grid.Col span={9}>
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                variant="light"
                color={"indigo"}
                title={
                  "Checkout now to make your bookings and receive your redemption vouchers!"
                }
                radius="md"
                pb={0}
              >
                {}
              </Alert>
            </Grid.Col>
            <Grid.Col span={9}>
              <Card
                withBorder
                mb="lg"
                sx={{ backgroundColor: theme.colors.gray[0] }}
                radius="lg"
              >
                <Group position="apart">
                  <Checkbox
                    label="Select all"
                    checked={areAllChecked}
                    onChange={(event) =>
                      handleAllCheckChange(event.currentTarget.checked)
                    }
                  />
                  {/* <Button
                  variant="subtle"
                  onClick={clearAllCartItems}
                  leftIcon={<IconX size="1rem" />}
                  color="red"
                >
                  Clear cart
                </Button> */}
                  <DeleteActionButtonModal
                    large
                    largeText="Clear cart"
                    onDelete={clearAllCartItems}
                    leftIcon={<IconX size="1rem" />}
                    color="red"
                    variant="subtle"
                    subtitle="Are you sure you want to clear all cart items? All existing chosen appointment time slots will be removed."
                    title="Clear cart"
                  />
                </Group>
              </Card>
              {cartItems
                .sort((a, b) => (expiredItems[a.cartItemId] ? 1 : -1))
                .map((item) => (
                  <CartItemCard
                    key={item.cartItemId}
                    itemId={item.cartItemId}
                    serviceListing={item.serviceListing}
                    bookingSelection={item.bookingSelection}
                    checked={checkedItems[item.cartItemId] || false}
                    onCheckedChange={(isChecked) =>
                      handleItemCheckChange(item.cartItemId, isChecked)
                    }
                    quantity={item.quantity}
                    setItemQuantity={setItemQuantity}
                    removeItem={async () =>
                      await removeItemFromCart(item.cartItemId)
                    }
                    isExpired={expiredItems[item.cartItemId] || false}
                    setCardExpired={(isExpired) =>
                      setCardExpired(item.cartItemId, isExpired)
                    }
                  />
                ))}
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper radius="md" bg={theme.colors.gray[0]} p="lg" withBorder>
                <Group position="right">
                  <Stack>
                    <Text size="xl" weight={600} mb={-10}>
                      Subtotal ({calculateTotalBuyables()}{" "}
                      {calculateTotalBuyables() === 1 ? "item" : "items"})
                    </Text>
                    <Text size={40} weight={700} align="right">
                      ${formatPriceForDisplay(calculateTotalPrice())}
                    </Text>
                  </Stack>
                </Group>
                <Button
                  size="md"
                  fullWidth
                  mt="xs"
                  onClick={checkout}
                  variant="gradient"
                >
                  Checkout
                </Button>
              </Paper>
            </Grid.Col>
          </Grid>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };
  const userId = session.user["userId"];

  return { props: { userId } };
}
