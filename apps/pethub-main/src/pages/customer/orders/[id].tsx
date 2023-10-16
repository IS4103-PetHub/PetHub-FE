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
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import { MISC_CHARGE_PCT } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import OrderItemStepperContent from "@/components/order/OrderItemActionGroup";
import OrderItemBadge from "@/components/order/OrderItemBadge";
import OrderItemStepper from "@/components/order/OrderItemStepper";
import { useGetorderItemsByPetOwnerId } from "@/hooks/order";

interface OrderDetailsProps {
  userId: number;
  orderItem: OrderItem;
}

export default function OrderDetails({ userId, orderItem }: OrderDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [numberOfSteps, setNumberOfSteps] = useState(0);
  // used to refresh data on the index page upon return
  const {
    data: orderItems = [],
    isLoading,
    refetch,
  } = useGetorderItemsByPetOwnerId(userId);

  const PLATFORM_FEE =
    Math.round(orderItem.itemPrice * MISC_CHARGE_PCT * 100) / 100;

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
      if (orderItem.serviceListing.requiresBooking) {
        setNumberOfSteps(3);
      }
      setNumberOfSteps(2);
    }
    if (orderItem.status === OrderItemStatusEnum.Refunded) {
      if (orderItem.serviceListing.requiresBooking) {
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
          onClick={() => {
            router.push("/customer/orders");
            refetch();
          }}
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
        <OrderItemStepperContent orderItem={orderItem} userId={userId} />
      </Box>
    </Accordion.Item>
  );

  const orderItemDetailsAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS}>
      <Box m="lg">
        <Group position="apart" mb={5} mt={-5}>
          <Center>
            <Text fw={500} mr={2} size="sm">
              {orderItem.serviceListing?.petBusiness?.companyName}
            </Text>
            <Button
              size="xs"
              variant="subtle"
              leftIcon={
                <IconBuildingStore
                  size="1rem"
                  style={{ marginRight: "-5px" }}
                />
              }
              onClick={() =>
                router.push(
                  "/pet-businesses/" + orderItem.serviceListing?.petBusinessId,
                )
              }
            >
              Visit Shop
            </Button>
          </Center>
          <Center>
            <Box>
              <Badge
                radius="xl"
                c="dark"
                sx={{ fontWeight: 600 }}
                variant="dot"
              >
                Ordered on: {formatISODayDateTime(orderItem.invoice.createdAt)}
              </Badge>
            </Box>
          </Center>
        </Group>
        <Grid columns={24}>
          <Grid.Col span={4} mih={125}>
            {orderItem.serviceListing?.attachmentURLs?.length > 0 ? (
              <Image
                radius="md"
                src={orderItem.serviceListing.attachmentURLs[0]}
                fit="contain"
                w="auto"
                alt="Cart Item Photo"
              />
            ) : (
              <Image
                radius="md"
                src="/pethub-placeholder.png"
                fit="contain"
                w="auto"
                alt="Cart Item Photo"
              />
            )}
          </Grid.Col>

          <Grid.Col span={16}>
            <Box>
              <Link href={`/service-listings/${orderItem.serviceListingId}`}>
                <Text fw={600} size={16}>
                  {orderItem.serviceListing.title}
                </Text>
              </Link>
              <Text lineClamp={2} size="xs">
                {orderItem.serviceListing.description}
              </Text>
              {orderItem.serviceListing.duration && (
                <Badge variant="dot" radius="xs">
                  Duration:{" "}
                  {convertMinsToDurationString(
                    orderItem.serviceListing.duration,
                  )}
                </Badge>
              )}
            </Box>
          </Grid.Col>

          <Grid.Col
            span={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Text size="sm" fw={500} color="dimmed">
              ${formatNumber2Decimals(orderItem.itemPrice)}
            </Text>
          </Grid.Col>
        </Grid>
      </Box>
    </Accordion.Item>
  );

  const orderItemPaymentDetailsAccordionItem = (
    <Accordion.Item value="stepper" {...ACCORDION_ITEM_PROPS} mb={50}>
      <Box m="lg">
        <Grid>
          <Grid.Col span={9} {...FLEX_END_PROPS}>
            <Text size="sm">Subtotal</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={3} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              ${formatNumber2Decimals(orderItem.itemPrice)}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={9} {...FLEX_END_PROPS}>
            <Text size="sm">Platform Fee</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={3} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              ${formatNumber2Decimals(PLATFORM_FEE)}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={9} {...FLEX_END_PROPS}>
            <Text size="sm">Order Item Total</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={3} {...FLEX_END_PROPS}>
            <Text size="md" fw={600}>
              ${formatNumber2Decimals(orderItem.itemPrice + PLATFORM_FEE)}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={9} {...FLEX_END_PROPS}>
            <Text size="sm">Payment Method</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={3} {...FLEX_END_PROPS}>
            <IconBrandStripe size="1rem" style={{ marginTop: "3px" }} />
            &nbsp;
            <Text size="sm" fw={500}>
              Stripe
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={9} {...FLEX_END_PROPS}>
            <Text size="sm">Payment ID</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={3} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              {/* The first 2 sections of the payment ID */}
              {orderItem.invoice?.paymentId.split("-").slice(0, 2).join("-")}
            </Text>
          </Grid.Col>

          <Grid.Col>
            <Divider />
          </Grid.Col>
          <Grid.Col span={9} {...FLEX_END_PROPS}>
            <Text size="sm">Invoice ID</Text>
            <Divider orientation="vertical" ml="xl" />
          </Grid.Col>
          <Grid.Col span={3} {...FLEX_END_PROPS}>
            <Text size="sm" fw={500}>
              {orderItem.invoiceId}
            </Text>
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
          {actionGroupAccordionItem}
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
