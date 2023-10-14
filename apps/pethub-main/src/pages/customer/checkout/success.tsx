import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronsRight, IconCircleCheck } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";

interface CheckoutSuccessfulProps {
  invoiceId: number;
}

export default function CheckoutSuccessful({
  invoiceId,
}: CheckoutSuccessfulProps) {
  const theme = useMantineTheme();
  const router = useRouter();

  // can only view this page after checkout
  if (!invoiceId) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Order Confirmed - PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid className="center-vertically">
        <Box>
          <Center mb={15}>
            <IconCircleCheck
              size={80}
              color={theme.colors.lime[5]}
              strokeWidth="1.5"
            />
          </Center>
          <Text
            size="xl"
            weight={500}
            color={theme.colors.dark[7]}
            align="center"
            mb={10}
          >
            Purrfect, your order has been confirmed!
          </Text>
          <Center mb="lg">
            <Badge color="gray" size="md">
              Invoice ID: {invoiceId}
            </Badge>
          </Center>
          <Text size="md" color="dimmed" align="center" w="42vw">
            {`Thank you for your purchase with PetHub! Your order has been
            pawsitively confirmed, and a tail-wagging confirmation email will
            soon land in your inbox. We appreciate your business and can't wait
            to fetch your order!`}
          </Text>
          <Group position="center" mt={35}>
            <Button
              size="md"
              color="dark"
              variant="default"
              onClick={() => router.push("/customer/orders")}
            >
              View my orders
            </Button>
            <Button
              size="md"
              color="dark"
              onClick={() => router.push("/service-listings?category=")}
              leftIcon={<IconChevronsRight />}
            >
              Continue shopping
            </Button>
          </Group>
        </Box>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const { invoiceId } = context.query;
  return { props: { invoiceId: Number(invoiceId) } };
}
