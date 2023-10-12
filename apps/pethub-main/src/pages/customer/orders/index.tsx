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
import { useState } from "react";
import { OrderBarCounts, OrderItemStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import OrderItemCard from "@/components/order/OrderItemCard";
import OrderStatusBar from "@/components/order/OrderTabs";
import { ordersSortOptions } from "@/types/constants";
import sampleData from "./sampleData.json";

export default function Orders() {
  const [activeTab, setActiveTab] = useState(OrderItemStatusEnum.All);
  const [sortStatus, setSortStatus] = useState<string>("recent");

  // stub data
  const orders = ["hello"];
  const isLoading = false;
  const hasNoFetchedRecords = false;
  const orderItems = sampleData.items;

  // ------------------ Placeholder - Change to a function that returns the count of each status ------------------ //
  const orderBarCountsPlaceholder: OrderBarCounts = {
    allCount: 20,
    toBookCount: 3,
    toFulfillCount: 4,
    fulfilledCount: 3,
    expiredCount: 5,
    refundedCount: 5,
  };
  // ------------------ Placeholder - Change to a function that returns the count of each status ------------------ //

  const searchAndSortGroup = (
    <Group position="right" align="center" mb="lg">
      <SearchBar
        size="md"
        w="50%"
        text="Search by item name"
        onSearch={() => {}}
      />
      <SortBySelect
        data={ordersSortOptions}
        value={sortStatus}
        onChange={setSortStatus}
        w="40%"
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
            orderBarCounts={orderBarCountsPlaceholder}
          />
          <Grid>
            <Grid.Col mt="md">
              {orderItems.map((item) => (
                <OrderItemCard
                  key={item.orderItemId}
                  itemId={item.orderItemId}
                  title={item.itemName}
                  price={item.itemPrice}
                  quantity={item.quantity}
                  voucherCode={item.voucherCode}
                  companyName={item.petBusiness.companyName}
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
