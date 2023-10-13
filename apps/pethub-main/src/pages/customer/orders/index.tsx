import {
  Box,
  Container,
  Grid,
  Group,
  MultiSelect,
  Transition,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { OrderBarCounts, OrderItemStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import api from "@/api/axiosConfig";
import OrderItemCard from "@/components/order/OrderItemCard";
import OrderStatusBar from "@/components/order/OrderTabs";
import { ordersSortOptions } from "@/types/constants";
import sampleData from "./sampleData.json";

interface OrdersProps {
  userId: number;
}

export default function Orders({ userId }: OrdersProps) {
  const [activeTab, setActiveTab] = useState(OrderItemStatusEnum.All);
  const [sortStatus, setSortStatus] = useState<string>("recent");

  // stub data
  const orders = ["hello"];
  const isLoading = false;
  const hasNoFetchedRecords = false;
  const orderItems = sampleData.items;

  // ------------------ Placeholder - Change to a function that returns the count of each status ------------------ //

  function calculateOrderBarCounts() {
    const orderBarCounts: OrderBarCounts = {
      allCount: 0,
      toBookCount: 0,
      toFulfillCount: 0,
      fulfilledCount: 0,
      expiredCount: 0,
      refundedCount: 0,
    };
    orderItems.forEach((item) => {
      orderBarCounts.allCount++;
      switch (item.status) {
        case OrderItemStatusEnum.PendingBooking:
          orderBarCounts.toBookCount++;
          break;
        case OrderItemStatusEnum.PendingFulfillment:
          orderBarCounts.toFulfillCount++;
          break;
        case OrderItemStatusEnum.Fulfilled || OrderItemStatusEnum.PaidOut: // paid out means its fulfilled
          orderBarCounts.fulfilledCount++;
          break;
        case OrderItemStatusEnum.Expired:
          orderBarCounts.expiredCount++;
          break;
        case OrderItemStatusEnum.Refunded:
          orderBarCounts.refundedCount++;
          break;
        // Note: We don't need a case for 'All' or 'PaidOut' as they're not counted in 'OrderBarCounts'
      }
    });
    return orderBarCounts;
  }
  // ------------------ Placeholder - Change to a function that returns the count of each status ------------------ //

  const searchAndSortGroup = (
    <Group position="right" align="center" mb="lg">
      <SearchBar
        size="md"
        w="55%"
        text="Search by title or order ID"
        onSearch={() => {}}
      />
      <SortBySelect
        data={ordersSortOptions}
        value={sortStatus}
        onChange={setSortStatus}
        w="35%"
      />
    </Group>
  );

  const renderContent = () => {
    if (orders.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No orders found"
                subtitle="Order that you place in the future will appear here"
              />
            </div>
          )}
        </Transition>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Orders - Pet Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
          <Group position="apart">
            <PageTitle title={`My orders`} mb="lg" />
            <Box>{orders.length > 0 ? searchAndSortGroup : null}</Box>
          </Group>
          <OrderStatusBar
            setActiveTab={setActiveTab}
            orderBarCounts={calculateOrderBarCounts()}
          />
          <Grid>
            <Grid.Col mt="md">
              {orderItems.map((item) => (
                <OrderItemCard
                  key={item.orderItemId}
                  userId={userId}
                  itemId={item.orderItemId}
                  orderId={item.invoice.paymentId}
                  price={item.itemPrice}
                  quantity={item.quantity}
                  voucherCode={item.voucherCode}
                  serviceListing={item.serviceListing}
                  booking={item.booking}
                  status={item.status}
                />
              ))}
            </Grid.Col>
            <Grid.Col>{renderContent()}</Grid.Col>
          </Grid>
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return null;
  const userId = session.user["userId"];

  return { props: { userId } };
}
