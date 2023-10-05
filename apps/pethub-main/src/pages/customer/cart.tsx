import { Button, Card, Container, Text } from "@mantine/core";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
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

  const cartItems = getCartItems();

  const toggleAction = () => {
    clearCart();
  };

  console.log("toggle thuing");

  return (
    <>
      <Head>
        <title>My Cart - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} mb={50}>
        <PageTitle title="My Cart" mb="lg" />
        Temporary page to display cart items
        <div>
          {cartItems.map((item) => (
            <Card key={item.cartItemId}>
              <Text>CartitemId: {item.cartItemId}</Text>
              <Text>service listing: {item.serviceListing.title}</Text>
              <Text>price: {item.serviceListing.basePrice}</Text>
              <Text>time slot id: {item.timeslot?.timeSlotId}</Text>
            </Card>
          ))}
        </div>
        <Button onClick={toggleAction}>Toggle action</Button>
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
