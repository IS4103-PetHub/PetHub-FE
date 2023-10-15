import {
  Accordion,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { set } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { OrderItem, OrderItemStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
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

  const OPEN_FOREVER = ["header", "stepper", "content", "footer"];

  const ACCORDION_ITEM_PROPS = {
    mb: 5,
    pl: 15,
    pr: 15,
    pt: 5,
    pb: 5,
  };

  const FLEX_END_PROPS = {
    sx: {
      display: "flex",
      justifyContent: "flex-end",
    },
  };

  useEffect(() => {
    setStepperCount();
  }, [orderItem]);

  function setStepperCount() {
    if (
      orderItem.status === OrderItemStatusEnum.PaidOut ||
      orderItem.status === OrderItemStatusEnum.PendingFulfillment ||
      orderItem.status === OrderItemStatusEnum.Fulfilled ||
      orderItem.status === OrderItemStatusEnum.PendingBooking
    ) {
      if (orderItem.serviceListing.requiresBooking) {
        setNumberOfSteps(4);
      } else {
        setNumberOfSteps(3);
      }
    }
    if (orderItem.status === OrderItemStatusEnum.Expired) {
      if (orderItem.booking) {
        setNumberOfSteps(3);
      }
      setNumberOfSteps(2);
    }
    if (orderItem.status === OrderItemStatusEnum.Refunded) {
      if (orderItem.booking) {
        setNumberOfSteps(4);
      }
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
          <Text size="sm">ORDER ITEM ID.</Text>
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
          numberOfSteps={numberOfSteps}
        />
      </Box>
    </Accordion.Item>
  );

  const orderItemDetailsAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS}>
      <Box m="lg">
        <Grid>
          <Grid.Col span={8}>Shop info and order description</Grid.Col>
        </Grid>
      </Box>
    </Accordion.Item>
  );

  const orderItemPaymentDetailsAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS}>
      <Box m="lg">
        <Grid>
          <Grid.Col span={8} {...FLEX_END_PROPS}>
            pos 1
          </Grid.Col>
          <Grid.Col span={4} {...FLEX_END_PROPS}>
            text 1
          </Grid.Col>
          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={8} {...FLEX_END_PROPS}>
            pos 2
          </Grid.Col>
          <Grid.Col span={4} {...FLEX_END_PROPS}>
            text 2
          </Grid.Col>
          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={8} {...FLEX_END_PROPS}>
            pos 3
          </Grid.Col>
          <Grid.Col span={4} {...FLEX_END_PROPS}>
            text 3
          </Grid.Col>
          <Grid.Col>
            <Divider />
          </Grid.Col>
        </Grid>
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
        <Accordion
          multiple
          variant="filled"
          value={OPEN_FOREVER}
          onChange={() => {}}
          chevronSize={0}
        >
          {headerAccordionItem}
          {stepperAccordionItem}
          {orderItemDetailsAccordionItem}
          {orderItemPaymentDetailsAccordionItem}
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
