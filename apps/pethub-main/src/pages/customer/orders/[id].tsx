import {
  Accordion,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Paper,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { OrderItem, OrderItemStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import api from "@/api/axiosConfig";
import OrderItemStepper from "@/components/order/OrderItemStepper";

interface OrderDetailsProps {
  userId: number;
  orderItem: OrderItem;
}

export default function OrderDetails({ userId, orderItem }: OrderDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [numberOfSteps, setNumberOfSteps] = useState(0);
  const nextStep = () =>
    setActiveStep((current) =>
      current < numberOfSteps ? current + 1 : current,
    );
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  console.log("ORDERITEM", orderItem);

  const OPEN_FOREVER = ["header", "stepper", "content", "footer"];
  const ACCORDION_ITEM_PROPS = {
    mb: 2,
    pl: 15,
    pr: 15,
    pt: 5,
    pb: 5,
  };

  useEffect(() => {
    setStepperCount();
  }, [orderItem]);

  function setStepperCount() {
    if (
      orderItem.status === OrderItemStatusEnum.Fulfilled ||
      orderItem.status === OrderItemStatusEnum.PendingBooking ||
      (orderItem.status === OrderItemStatusEnum.PendingFulfillment &&
        orderItem.serviceListing.requiresBooking) ||
      orderItem.status === OrderItemStatusEnum.Refunded
    ) {
      setNumberOfSteps(4); // The above statuses have 4 steps, see OrderItemStepper for clarification
    } else {
      setNumberOfSteps(3);
    }
  }

  const orderStatusTextMap = new Map([
    ["PENDING_BOOKING", "Order Incomplete"],
    ["PENDING_FULFILLMENT", "Order Incomplete"],
    ["FULFILLED", "Order Completed"],
    ["PAID_OUT", "Order Completed"],
    ["REFUNDED", "Order Refunded"],
    ["EXPIRED", "Order Expired"],
  ]);

  const orderStatusColorMap = new Map([
    ["PENDING_BOOKING", "indigo"],
    ["PENDING_FULFILLMENT", "violet"],
    ["FULFILLED", "green"],
    ["PAID_OUT", "green"],
    ["REFUNDED", "orange"],
    ["EXPIRED", "red"],
  ]);

  const headerAccordionItem = (
    <Accordion.Item value="header" {...ACCORDION_ITEM_PROPS}>
      <Group position="apart">
        <Button
          variant=""
          leftIcon={
            <IconChevronLeft size="1rem" style={{ marginRight: -10 }} />
          }
          ml={-15}
          c="dimmed"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Center>
          <Text size="sm">ORDER ID.</Text>
          &nbsp;
          <Text size="sm">{orderItem.orderItemId}</Text>
          <Text ml="md" mr="md" size="sm">
            |
          </Text>
          <Text
            size="sm"
            color={orderStatusColorMap.get(orderItem.status)}
            tt="uppercase"
          >
            {orderStatusTextMap.get(orderItem.status)}
          </Text>
        </Center>
      </Group>
    </Accordion.Item>
  );

  const stepperAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS}>
      <Box m="lg" mt={30}>
        <OrderItemStepper
          active={activeStep}
          setActive={setActiveStep}
          orderItem={orderItem}
        />
      </Box>
    </Accordion.Item>
  );

  return (
    <div>
      <Head>
        <title>{orderItem.orderItemId} - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
        <Group position="apart">
          <PageTitle title={`Order ${orderItem.orderItemId}`} mb="lg" />
        </Group>
        <Accordion
          multiple
          variant="filled"
          value={OPEN_FOREVER}
          onChange={() => {}}
          chevronSize={0}
        >
          {headerAccordionItem}
          {stepperAccordionItem}
        </Accordion>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;

  const orderItem = await (await api.get(`/order-items/${id}`)).data;
  const session = await getSession(context);
  if (!session) return { props: { orderItem } };
  const userId = session.user["userId"];

  return { props: { userId, orderItem } };
}
