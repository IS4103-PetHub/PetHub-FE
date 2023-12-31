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
  IconInfoCircle,
  IconShoppingCartExclamation,
  IconX,
} from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PLATFORM_FEE_PERCENT, formatNumber2Decimals } from "shared-utils";
import { PageTitle } from "web-ui";
import CustomPopover from "web-ui/shared/CustomPopover";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import CartItemCard from "@/components/cart/CartItemCard";
import { useCartOperations } from "@/hooks/cart";
import { GST_PERCENT, PLATFORM_FEE_MESSAGE } from "@/types/constants";

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
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  useEffect(() => {
    const updatedCartItems = getCartItems();
    setCartItems(updatedCartItems);
    const initialCheckedState = {};
    updatedCartItems.forEach((item) => {
      initialCheckedState[item.cartItemId] = item.isSelected;
    });
    setCheckedItems(initialCheckedState);
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

  function hasNoCheckedItems() {
    for (const cartItemId in checkedItems) {
      if (checkedItems[cartItemId]) {
        return false;
      }
    }
    return true;
  }

  const calculateTotalBuyables = () => {
    let totalBuyables = 0;
    cartItems.forEach((item) => {
      if (checkedItems[item.cartItemId]) {
        totalBuyables += item.quantity || 1;
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
      if (checkedItems[item.cartItemId]) {
        totalPrice += item.quantity * item.serviceListing.basePrice;
      }
    });
    return totalPrice;
  };

  function calculatePlatformFee() {
    return Math.round(calculateTotalPrice() * PLATFORM_FEE_PERCENT * 100) / 100;
  }

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
    const platformFee = calculatePlatformFee();
    router.push(
      {
        pathname: "/customer/checkout",
        query: {
          itemCount: calculateTotalBuyables(),
          subtotal: calculateTotalPrice() * (1 - GST_PERCENT),
          gst: calculateTotalPrice() * GST_PERCENT,
          platformFee,
          total: calculateTotalPrice() + platformFee,
        },
      },
      "/customer/checkout",
    );
    notifications.hide("checkout");
  }

  const areAllChecked = cartItems.every(
    (item) => checkedItems[item.cartItemId],
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
        .map((item) => {
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
              isDisabled={false}
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
            : formatNumber2Decimals(calculateTotalPrice() * (1 - GST_PERCENT))}
        </Text>
      </Group>
      {!hasNoCheckedItems() && (
        <>
          <Group position="apart" mb="xs">
            <Text size="sm" c="dimmed">
              {`GST (${GST_PERCENT * 100}%)`}
            </Text>
            <Text size="sm" fw={500} c="dimmed">
              ${formatNumber2Decimals(calculateTotalPrice() * GST_PERCENT)}
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
              ${formatNumber2Decimals(calculatePlatformFee())}
            </Text>
          </Group>
        </>
      )}
      <Divider mb="xs" />
      <Group position="apart" align="flex-end">
        <Text size="lg">Total</Text>
        <Text size="xl" fw={600}>
          $
          {formatNumber2Decimals(
            calculateTotalPrice() + calculatePlatformFee(),
          )}
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
      <Container mt={50} mb={50} size="75vw" sx={{ overflow: "hidden" }}>
        <Group position="apart">
          <PageTitle title={`My cart (${getItemCount()})`} mb="lg" />
        </Group>
        {cartItems.length === 0 ? (
          <>{emptyCartMessage}</>
        ) : (
          <Grid gutter="xl">
            <Grid.Col span={9}>
              <Alert
                icon={<IconInfoCircle size="1rem" />}
                variant="light"
                color={"indigo"}
                title={
                  "Checkout now to receive your voucher codes and make your bookings (if applicable)!"
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
                radius="md"
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
                    subtitle="Are you sure you want to clear all cart items?"
                    title="Clear cart"
                    overrideDeleteButtonText="Clear"
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
