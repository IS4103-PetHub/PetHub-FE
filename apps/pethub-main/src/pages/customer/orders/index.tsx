import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Text,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconExclamationCircle } from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  OrderBarCounts,
  OrderItem,
  OrderItemStatusEnum,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import OrderItemCard from "@/components/order/OrderItemCard";
import OrderStatusBar from "@/components/order/OrderTabs";
import { useGetorderItemsByPetOwnerId } from "@/hooks/order";
import { orderItemsSortOptions } from "@/types/constants";
import { searchOrderItemsForCustomer, sortRecords } from "@/util";

interface OrdersProps {
  userId: number;
}

export default function Orders({ userId }: OrdersProps) {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState(OrderItemStatusEnum.All);
  const [sortStatus, setSortStatus] = useState<string>("recent");
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [orderBarCounts, setOrderBarCounts] = useState<OrderBarCounts>();

  // States for infinite scroll and fake loading flag
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  const {
    data: orderItems = [],
    isLoading,
    refetch,
  } = useGetorderItemsByPetOwnerId(userId);
  const [records, setRecords] = useState<OrderItem[]>(orderItems);

  function resetRecordsSliced() {
    setRecords(getFilteredAndSortedRecords().slice(0, page * PAGE_SIZE));
  }

  useEffect(() => {
    document.body.style.background = theme.colors.gray[0];
    return () => {
      document.body.style.background = "";
    };
  }, []);

  // Reset infinite scroll to page 1 when I change tab
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    // The reason we slice the array is because we want to display the records in batches for infinite scrolling
    resetRecordsSliced();
    setOrderBarCounts(calculateOrderBarCounts());
  }, [orderItems, activeTab, sortStatus, page]);

  // Scroll listeners for infinite scrolling, hooks into window scroll event
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [records, orderItems, activeTab, sortStatus, isSearching]);

  const setSortStatusWithReset = (status: string) => {
    setPage(1); // reset page when sorting
    setSortStatus(status);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (orderItems.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [orderItems]);

  // Display more records when user scrolls to bottom of page
  const handleScroll = () => {
    if (isSearching) return; // DO NOT TRIGGER if user is searching
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 && // 100px before the bottom of the page
      records.length < getFilteredAndSortedRecords().length // until not all records displayed yet
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = (searchStr: string) => {
    setPage(1);
    if (searchStr.length === 0) {
      setIsSearching(false);
      resetRecordsSliced(); // Reset to sliced records upon emptied search bar
      return;
    }
    setIsSearching(true);
    const filteredAndSortedRecords = getFilteredAndSortedRecords();
    const results = searchOrderItemsForCustomer(
      filteredAndSortedRecords,
      searchStr,
    );
    setRecords(results);
  };

  function getFilteredAndSortedRecords() {
    // filter orderItems based on activeTab
    let filteredOrderItems = orderItems;
    if (activeTab !== OrderItemStatusEnum.All) {
      if (activeTab === OrderItemStatusEnum.Fulfilled) {
        filteredOrderItems = orderItems.filter(
          (item) =>
            item.status === OrderItemStatusEnum.Fulfilled ||
            item.status === OrderItemStatusEnum.PaidOut,
        );
      } else {
        filteredOrderItems = orderItems.filter(
          (item) => item.status === activeTab,
        );
      }
    }
    // then sort
    return sortRecords(orderItemsSortOptions, filteredOrderItems, sortStatus);
  }

  function calculateOrderBarCounts() {
    const orderBarCounts: OrderBarCounts = {
      allCount: 0,
      toBookCount: 0,
      toFulfillCount: 0,
      fulfilledCount: 0,
      expiredCount: 0,
      refundedCount: 0,
    };
    orderItems?.forEach((item) => {
      orderBarCounts.allCount++;
      switch (item.status) {
        case OrderItemStatusEnum.PendingBooking:
          orderBarCounts.toBookCount++;
          break;
        case OrderItemStatusEnum.PendingFulfillment:
          orderBarCounts.toFulfillCount++;
          break;
        case OrderItemStatusEnum.Fulfilled:
        case OrderItemStatusEnum.PaidOut: // paid out means its fulfilled
          orderBarCounts.fulfilledCount++;
          break;
        case OrderItemStatusEnum.Expired:
          orderBarCounts.expiredCount++;
          break;
        case OrderItemStatusEnum.Refunded:
          orderBarCounts.refundedCount++;
          break;
      }
    });
    return orderBarCounts;
  }

  const toBookAlert = (
    <Alert
      title="Booking(s) Not Scheduled"
      color="orange"
      icon={<IconExclamationCircle size="2rem" />}
      mb="lg"
    >
      <Text>
        Your furry friends have {orderBarCounts?.toBookCount} orders awaiting
        bookings. Please paw-ticipate by scheduling your time slots before their
        tail-wagging validity periods end.
      </Text>
      <Button
        mt="xs"
        onClick={() => setActiveTab(OrderItemStatusEnum.PendingBooking)}
      >
        View orders
      </Button>
    </Alert>
  );

  const searchAndSortGroup = (
    <Group position="right" align="center" mb="lg" w="75%">
      <SearchBar
        size="md"
        w="55%"
        text="Search for an order item here"
        onSearch={handleSearch}
      />
      <SortBySelect
        data={orderItemsSortOptions}
        value={sortStatus}
        onChange={setSortStatusWithReset}
        w="35%"
      />
    </Group>
  );

  const orderItemCards = records?.map((item) => (
    <Grid.Col key={item.orderItemId}>
      <OrderItemCard
        userId={userId}
        orderItemId={item.orderItemId}
        expiryDate={item.expiryDate}
        price={item.itemPrice}
        voucherCode={item.voucherCode}
        serviceListing={item.serviceListing}
        status={item.status}
        createdAt={item.invoice.createdAt}
        booking={item.booking as any}
      />
    </Grid.Col>
  ));

  const renderContent = () => {
    if (orderItems.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return (
        <SadDimmedMessage
          title="No orders found"
          subtitle="Order that you place in the future will appear here"
        />
      );
    }

    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <Grid>{orderItemCards}</Grid>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Orders - Pet Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
          {orderBarCounts?.toBookCount !== 0 && toBookAlert}
          <Group position="apart">
            <PageTitle title={`My orders`} mb="lg" />
            {orderItems.length > 0 && searchAndSortGroup}
          </Group>
          <OrderStatusBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            orderBarCounts={orderBarCounts && orderBarCounts}
          />
          {renderContent()}
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
