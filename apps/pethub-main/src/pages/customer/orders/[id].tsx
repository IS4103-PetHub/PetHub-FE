import {
  Accordion,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandStripe,
  IconBuildingStore,
  IconChevronLeft,
} from "@tabler/icons-react";
import { set } from "lodash";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  OrderItem,
  OrderItemStatusEnum,
  PLATFORM_FEE_PERCENT,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import OrderItemActionGroup from "@/components/order/OrderItemActionGroup";
import OrderItemBadge from "@/components/order/OrderItemBadge";
import OrderItemCardMini from "@/components/order/OrderItemCardMini";
import OrderItemStepper from "@/components/order/OrderItemStepper";
import {
  useGetOrderItemByOrderId,
  useGetorderItemsByPetOwnerId,
} from "@/hooks/order";

interface OrderDetailsProps {
  userId: number;
}

export default function OrderDetails({ userId }: OrderDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [numberOfSteps, setNumberOfSteps] = useState(0);
  const [backButtonLoading, setBackButtonLoading] = useState(false);

  const orderItemId = Number(router.query.id);

  const {
    data: orderItem,
    refetch: refetchOrderItem,
    isLoading: isFetchOrderItemLoading,
  } = useGetOrderItemByOrderId(orderItemId);

  console.log("orderItem", orderItem);

  // used to refresh data on the index page upon return
  const {
    data: orderItems = [],
    isLoading,
    refetch,
  } = useGetorderItemsByPetOwnerId(userId);

  const PLATFORM_FEE =
    Math.round(orderItem?.itemPrice * PLATFORM_FEE_PERCENT * 100) / 100;

  const OPEN_FOREVER = [
    "header",
    "stepper",
    "actionGroup",
    "content",
    "footer",
  ];

  const ACCORDION_ITEM_PROPS = {
    mb: 5,
    pl: 15,
    pr: 15,
    pt: 5,
    pb: 5,
  };

  const ORDER_ITEM_DETAILS_GRID_LEFT = 9;
  const ORDER_ITEM_DETAILS_GRID_RIGHT = 3;

  const FLEX_END_PROPS = {
    sx: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "-4px",
    },
  };

  useEffect(() => {
    setStepperCount();
  }, [orderItem]);

  function goBack() {
    setBackButtonLoading(true);
    window.location.href = "/customer/orders";
  }

  function setStepperCount() {
    if (
      orderItem?.status === OrderItemStatusEnum.PaidOut ||
      orderItem?.status === OrderItemStatusEnum.PendingFulfillment ||
      orderItem?.status === OrderItemStatusEnum.Fulfilled ||
      orderItem?.status === OrderItemStatusEnum.PendingBooking
    ) {
      if (orderItem?.serviceListing.requiresBooking) {
        setNumberOfSteps(4);
      } else {
        setNumberOfSteps(3);
      }
    }
    if (orderItem?.status === OrderItemStatusEnum.Expired) {
      if (orderItem?.serviceListing.requiresBooking) {
        setNumberOfSteps(3);
      }
      setNumberOfSteps(2);
    }
    if (orderItem?.status === OrderItemStatusEnum.Refunded) {
      if (orderItem?.serviceListing.requiresBooking) {
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
          loading={backButtonLoading}
          loaderPosition="right"
          loaderProps={{ color: "dark" }}
          onClick={goBack}
        >
          Back
        </Button>
        <Center>
          <Text size="sm">ORDER ITEM ID.</Text>
          &nbsp;
          <Text size="sm">{orderItem?.orderItemId}</Text>
          <Text ml="md" mr="md" size="sm">
            |
          </Text>
          <Text
            size="sm"
            color={orderStatusColorMap.get(orderItem?.status)}
            tt="uppercase"
          >
            {orderStatusTextMap.get(orderItem?.status)}
          </Text>
        </Center>
      </Group>
    </Accordion.Item>
  );

  const stepperAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS}>
      <Box m="lg" mt={30}>
        <OrderItemStepper
          userId={userId}
          active={activeStep}
          setActive={setActiveStep}
          orderItem={orderItem}
          numberOfSteps={numberOfSteps}
        />
      </Box>
    </Accordion.Item>
  );

  const actionGroupAccordionItem = (
    <Accordion.Item value="actionGroup" {...ACCORDION_ITEM_PROPS}>
      <Box m="lg">
        <OrderItemActionGroup
          orderItem={orderItem}
          userId={userId}
          refetch={refetchOrderItem}
        />
      </Box>
    </Accordion.Item>
  );

  const orderItemDetailsAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS}>
      <OrderItemCardMini orderItem={orderItem} />
    </Accordion.Item>
  );

  const orderItemPaymentDetailsAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS} mb={50}>
      <Box m="lg">
        <Grid>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_LEFT} {...FLEX_END_PROPS}>
            <Text size="sm">Subtotal</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_RIGHT} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              ${formatNumber2Decimals(orderItem?.itemPrice)}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_LEFT} {...FLEX_END_PROPS}>
            <Text size="sm">Platform Fee</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_RIGHT} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              ${formatNumber2Decimals(PLATFORM_FEE)}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_LEFT} {...FLEX_END_PROPS}>
            <Text size="sm">Order Item Total</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_RIGHT} {...FLEX_END_PROPS}>
            <Text size="md" fw={600}>
              ${formatNumber2Decimals(orderItem?.itemPrice + PLATFORM_FEE)}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_LEFT} {...FLEX_END_PROPS}>
            <Text size="sm">Payment Method</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_RIGHT} {...FLEX_END_PROPS}>
            <IconBrandStripe size="1rem" style={{ marginTop: "3px" }} />
            &nbsp;
            <Text size="sm" fw={500}>
              Stripe
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_LEFT} {...FLEX_END_PROPS}>
            <Text size="sm">Payment ID</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_RIGHT} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              {/* The first 2 sections of the payment ID */}
              {orderItem?.invoice?.paymentId.split("-").slice(0, 2).join("-")}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_LEFT} {...FLEX_END_PROPS}>
            <Text size="sm">Invoice ID</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={ORDER_ITEM_DETAILS_GRID_RIGHT} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              {orderItem?.invoiceId}
            </Text>
          </Grid.Col>
        </Grid>
      </Box>
    </Accordion.Item>
  );

  return (
    <div>
      <Head>
        <title>View Order Details - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
        {orderItem && (
          <Accordion
            multiple
            variant="filled"
            value={OPEN_FOREVER}
            onChange={() => {}}
            chevronSize={0}
          >
            {headerAccordionItem}
            {stepperAccordionItem}
            {actionGroupAccordionItem}
            {orderItemDetailsAccordionItem}
            {orderItemPaymentDetailsAccordionItem}
          </Accordion>
        )}
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return;
  const userId = session.user["userId"];

  return { props: { userId } };
}
