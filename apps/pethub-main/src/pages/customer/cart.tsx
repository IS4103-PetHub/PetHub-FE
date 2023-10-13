import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
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
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import CustomPopover from "web-ui/shared/CustomPopover";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import CartItemBookingAlert from "@/components/cart/CartItemBookingAlert";
import CartItemCard from "@/components/cart/CartItemCard";
import { useCartOperations } from "@/hooks/cart";
import {
  GST_PERCENT,
  PLATFORM_FEE,
  PLATFORM_FEE_MESSAGE,
} from "@/types/constants";
import { formatPriceForDisplay } from "@/util";

interface CartProps {
  userId: number;
}

export default function Cart({ userId }: CartProps) {
  const {
    getCurrentCart,
    removeItemFromCart,
    getCartItems,
    setItemQuantity,
    clearCart,
    getItemCount,
    setCartItemIsSelected,
    setAllCartItemsIsSelected,
  } = useCartOperations(userId);
  const router = useRouter();
  const theme = useMantineTheme();
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [expiredItems, setExpiredItems] = useState({}); // This might not be needed anymore as per PH-264
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  useEffect(() => {
    const updatedCartItems = getCartItems();
    setCartItems(updatedCartItems);
    const initialCheckedState = {};
    const initialExpiredState = {};
    updatedCartItems.forEach((item) => {
      initialCheckedState[item.cartItemId] = item.isSelected;
      initialExpiredState[item.cartItemId] = false; // default is all items not expired
    });
    setCheckedItems(initialCheckedState);
    setExpiredItems(initialExpiredState);
    if (cartItems.length === 0) {
      setHasNoFetchedRecords(true);
    }
  }, [getCurrentCart()]);

  function handleItemCheckChange(cartItemId, isChecked) {
    setCheckedItems((prev) => ({
      ...prev,
      [cartItemId]: isChecked,
    }));
    setCartItemIsSelected(cartItemId, isChecked);
  }

  function handleAllCheckChange(isChecked) {
    const newState = {};
    cartItems.forEach((item) => {
      newState[item.cartItemId] = isChecked;
    });
    setCheckedItems(newState);
    setAllCartItemsIsSelected(isChecked);
  }

  function setCardExpired(cartItemId, isExpired) {
    setExpiredItems((prev) => ({
      ...prev,
      [cartItemId]: isExpired,
    }));
  }

  function hasNoCheckedItems() {
    for (const cartItemId in checkedItems) {
      if (checkedItems[cartItemId] && !expiredItems[cartItemId]) {
        return false;
      }
    }
    return true;
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
    if (hasNoCheckedItems()) {
      return totalPrice;
    }
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
      message: "All items have been removed from your cart.",
    });
  };

  function checkout() {
    if (hasNoCheckedItems()) {
      notifications.show({
        title: "Cannot Checkout",
        color: "red",
        message: "Please select at least one item to checkout.",
      });
      return;
    }
    notifications.show({
      id: "checkout",
      title: "Redirecting to Checkout...",
      color: "blue",
      loading: true,
      message: "",
    });

    // redirect to checkout page with checkout items information
    router.push(
      {
        pathname: "/customer/checkout",
        query: {
          itemCount: calculateTotalBuyables(),
          subtotal: calculateTotalPrice() * (1 - GST_PERCENT) + PLATFORM_FEE,
          gst: calculateTotalPrice() * GST_PERCENT,
          total: calculateTotalPrice() + PLATFORM_FEE,
        },
      },
      "/customer/checkout",
    );
    notifications.hide("checkout");
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

  const displayCartItems = (
    <>
      {cartItems
        .slice()
        .reverse()
        .sort((a, b) => (expiredItems[a.cartItemId] ? 1 : -1)) // Sort expired items to the back
        .map((item) => {
          /*
            - No checking for expired bookings atm as per PH-264
          */

          // let shouldFetch = item.bookingSelection && item.serviceListing.calendarGroupId;
          // let isDisabled = false;
          // getAvailableTimeSlotsByCGIdNoCache(
          //   shouldFetch ? item.serviceListing.calendarGroupId : null,
          //   shouldFetch ? item.bookingSelection.startTime : null,
          //   shouldFetch ? item.bookingSelection.endTime : null,
          //   shouldFetch ? item.serviceListing.duration : null
          // ).then((availTimeslots) => {
          //   isDisabled = shouldFetch && availTimeslots.length === 0 ? true : false;
          //   setCardExpired(item.cartItemId, isDisabled);
          // });

          let isDisabled = false; // Stub

          return (
            <CartItemCard
              key={item.cartItemId}
              itemId={item.cartItemId}
              serviceListing={item.serviceListing}
              checked={checkedItems[item.cartItemId] || false}
              onCheckedChange={(isChecked) =>
                handleItemCheckChange(item.cartItemId, isChecked)
              }
              quantity={item.quantity}
              setItemQuantity={setItemQuantity}
              removeItem={() => removeItemFromCart(item.cartItemId)}
              isExpired={expiredItems[item.cartItemId] || false}
              isDisabled={isDisabled}
              bookingAlert={
                isDisabled ? (
                  <CartItemBookingAlert
                    isValid={!isDisabled}
                    bookingSelection={item.bookingSelection}
                  >
                    {}
                  </CartItemBookingAlert>
                ) : null
              }
            />
          );
        })}
    </>
  );

  const displayCheckoutSummary = (
    <Paper radius="md" bg={theme.colors.gray[0]} p="lg" withBorder>
      <Text size="xl" weight={600} mb="md">
        Summary
      </Text>
      <Group position="apart" mb="xs">
        <Text size="sm" align="left" c="dimmed">
          Subtotal ({calculateTotalBuyables()}{" "}
          {calculateTotalBuyables() === 1 ? "item" : "items"})
        </Text>
        <Text size="sm" fw={500} c="dimmed">
          $
          {calculateTotalPrice() === 0
            ? "0.00"
            : formatPriceForDisplay(
                calculateTotalPrice() * (1 - GST_PERCENT) + PLATFORM_FEE,
              )}
        </Text>
      </Group>
      {!hasNoCheckedItems() && (
        <>
          <Group position="apart" mb="xs">
            <Text size="sm" c="dimmed">
              {`GST (${GST_PERCENT * 100}%)`}
            </Text>
            <Text size="sm" fw={500} c="dimmed">
              ${formatPriceForDisplay(calculateTotalPrice() * GST_PERCENT)}
            </Text>
          </Group>
          <Group position="apart" mb="xs">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text size="sm" c="dimmed">
                Platform fee
              </Text>
              <CustomPopover text={PLATFORM_FEE_MESSAGE}>{}</CustomPopover>
            </div>
            <Text size="sm" fw={500} c="dimmed">
              ${formatPriceForDisplay(PLATFORM_FEE)}
            </Text>
          </Group>
        </>
      )}
      <Divider mb="xs" />
      <Group position="apart">
        <Text size="lg">Total</Text>
        <Text size="lg" fw={700}>
          ${formatPriceForDisplay(calculateTotalPrice() + PLATFORM_FEE)}
        </Text>
      </Group>
      <Button
        size="md"
        fullWidth
        mt="xs"
        onClick={checkout}
        color="dark"
        className="gradient-hover"
      >
        Checkout
      </Button>
    </Paper>
  );

  return (
    <>
      <Head>
        <title>My Cart - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="75vw" sx={{ overflow: "hidden" }}>
        <Group position="apart">
          <PageTitle title={`My cart (${getItemCount()})`} mb="lg" />
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
              {displayCartItems}
            </Grid.Col>
            <Grid.Col span={3}>{displayCheckoutSummary}</Grid.Col>
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
