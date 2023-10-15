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
import { useState } from "react";
import { OrderItem, OrderItemStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import api from "@/api/axiosConfig";
import OrderItemStepper from "@/components/order/OrderItemStepper";

const STEPPER_MAX_STEPS = 4;

interface OrderDetailsProps {
  userId: number;
  orderItem: OrderItem;
}

export default function OrderDetails({ userId, orderItem }: OrderDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const nextStep = () =>
    setActiveStep((current) =>
      current < STEPPER_MAX_STEPS ? current + 1 : current,
    );
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const OPEN_FOREVER = ["header", "stepper", "content", "footer"];
  const ACCORDION_ITEM_PROPS = {
    mb: 2,
    pl: 15,
    pr: 15,
    pt: 5,
    pb: 5,
  };

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
      <Box m="lg">
        <OrderItemStepper active={activeStep} setActive={setActiveStep} />
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

  // const orderItem = await (await api.get(`/order-items/${id}`)).data;
  const orderItem = {
    // sample data
    orderItemId: 4,
    itemName: "Routine Pet Health Checkup",
    itemPrice: 75,
    duration: 60,
    quantity: 1,
    status: "PAID_OUT",
    voucherCode: "PH945683",
    serviceListing: {
      serviceListingId: 2,
      title: "Routine Pet Health Checkup",
      description:
        "Dog Training Session provides expert dog training to teach your pet new tricks. Our dedicated trainers are skilled in working with dogs of all breeds and ages. Whether your dog needs basic obedience training or advanced trick training, we have a program that suits their needs. Our training sessions are designed to be fun and engaging for your pet while ensuring they learn valuable skills. We use positive reinforcement techniques to encourage good behavior and strengthen the bond between you and your furry friend. With Dog Training Session, you'll have a well-behaved and happy dog in no time. Join our training classes and watch your pet's confidence and abilities grow!",
      basePrice: 60,
      dateCreated: "2023-10-12T02:53:27.250Z",
      lastUpdated: null,
      duration: 60,
      category: "PET_BOARDING",
      petBusinessId: 1,
      calendarGroupId: 4,
      petBusiness: {
        companyName: "John's Company",
        userId: 1,
      },
      attachmentKeys: [
        "uploads/service-listing/img/77b6344d-eb63-4d91-8749-aab43ba9c874-dog_grooming_1",
      ],
      attachmentURLs: [
        "https://pethub-data-lake-default.s3.ap-southeast-1.amazonaws.com/uploads/service-listing/img/77b6344d-eb63-4d91-8749-aab43ba9c874-dog_grooming_1?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3X6HC7JLMRAUOW66%2F20231012%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231012T025326Z&X-Amz-Expires=604800&X-Amz-Signature=a6d4c9554f21b0f70ee12e356168926b65a9ee075bd656ae0749a1c4a8d1ef9d&X-Amz-SignedHeaders=host&x-id=GetObject",
      ],
      lastPossibleDate: "2023-10-25T02:53:27.250Z",
    },
    booking: {
      bookingId: 21,
      invoiceId: null,
      transactionId: null,
      petOwnerId: 11,
      dateCreated: "2023-10-12T02:53:27.415Z",
      lastUpdated: null,
      startTime: "2023-10-19T04:00:00.000Z",
      endTime: "2023-10-19T06:00:00.000Z",
      serviceListingId: 9,
      timeSlotId: 144,
      petId: 3,
    },
    invoice: {
      paymentId: "PH-123154",
    },
  };
  const session = await getSession(context);
  if (!session) return { props: { orderItem } };
  const userId = session.user["userId"];

  return { props: { userId, orderItem } };
}
