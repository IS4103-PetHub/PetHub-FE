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
import { useEffect, useState } from "react";
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
    updateItemInCart,
    removeItemFromCart,
    getCartItems,
    getCartItem,
    clearCart,
    getCartSubtotal,
    getItemCount,
  } = useCartOperations(userId);
  const theme = useMantineTheme();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, [cart]);

  function toggleAction() {
    clearCart();
  }

  function checkout() {
    console.log("checkout");
  }

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
              <PageTitle title="My Cart" mb="lg" />
            </Group>
          </Grid.Col>
          <Grid.Col span={9}>
            <Card
              withBorder
              mb="lg"
              sx={{ backgroundColor: theme.colors.gray[0] }}
              radius="lg"
            >
              <Checkbox defaultChecked label="Select all" color="cyan" />
            </Card>
            {cartItems.map((item) => (
              <CartItemCard
                key={item.cartItemId}
                serviceListing={item.serviceListing}
                bookingSelection={item.bookingSelection}
                checked={true}
              />
            ))}
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper radius="md" bg={theme.colors.gray[0]} p="lg" withBorder>
              <Group position="left">
                <Stack>
                  <Text size="md">Subtotal (2 items): </Text>
                  <Text size="xl" weight={500}>
                    ${100}
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
