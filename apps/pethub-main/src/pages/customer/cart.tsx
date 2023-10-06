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
  useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import CartItemCard from "@/components/cart/CartItemCard";
import { useCartOperations } from "@/hooks/cart";

interface CartProps {
  userId: number;
}

export default function Cart({ userId }: CartProps) {
  const {
    cart,
    addItemToCart,
    removeItemFromCart,
    getCartItems,
    getCartItem,
    clearCart,
    getCartSubtotal,
    getItemCount,
  } = useCartOperations(userId);
  const theme = useMantineTheme();
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    setCartItems(getCartItems());
    const initialCheckedState = {};
    cartItems.forEach((item) => {
      initialCheckedState[item.cartItemId] = true;
    });
    setCheckedItems(initialCheckedState);
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

  function checkout() {
    console.log("checkout");
  }

  const areAllChecked = Object.values(checkedItems).every(
    (isChecked) => isChecked,
  );

  return (
    <>
      <Head>
        <title>My Cart - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
        <Grid gutter="xl">
          <Grid.Col span={9}>
            <Group position="apart">
              <PageTitle title={`My Cart (${getItemCount()})`} mb="lg" />
            </Group>
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
                  color="cyan"
                  checked={areAllChecked}
                  onChange={(event) =>
                    handleAllCheckChange(event.currentTarget.checked)
                  }
                />
                <Button variant="subtle" onClick={() => clearCart()}>
                  Clear all items
                </Button>
              </Group>
            </Card>
            {cartItems.map((item) => (
              <CartItemCard
                key={item.cartItemId}
                serviceListing={item.serviceListing}
                bookingSelection={item.bookingSelection}
                checked={checkedItems[item.cartItemId] || false}
                onCheckedChange={(isChecked) =>
                  handleItemCheckChange(item.cartItemId, isChecked)
                }
              />
            ))}
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper radius="md" bg={theme.colors.gray[0]} p="lg" withBorder>
              <Group position="left">
                <Stack>
                  <Text size="md">Subtotal (2 items): </Text>
                  <Text size="xl" weight={500}>
                    ${100.79}
                  </Text>
                </Stack>
              </Group>
              <Button size="md" fullWidth mt="xs" onClick={checkout}>
                Book now
              </Button>
            </Paper>
          </Grid.Col>
        </Grid>
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
