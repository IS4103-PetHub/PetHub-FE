import { Box, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  OrderBarCounts,
  OrderItem,
  OrderItemStatusEnum,
  RefundStatusEnum,
  formatISODateOnly,
  formatNumber2Decimals,
  formatStringToLetterCase,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import OrderStatusBar from "@/components/order/OrderTabs";
import { useGetorderItemsByPetOwnerId } from "@/hooks/order";
import { searchOrderItemsForCustomer } from "@/util";

interface SelectOrderItemProps {
  form: UseFormReturnType<any>;
  userId: number;
}

export default function SelectOrderItem({
  form,
  userId,
}: SelectOrderItemProps) {
  const {
    data: orderItems = [],
    isLoading,
    refetch,
  } = useGetorderItemsByPetOwnerId(userId);
  const [activeTab, setActiveTab] = useState(OrderItemStatusEnum.All);
  const [isSearching, setIsSearching] = useToggle();
  const [searchString, setSearchString] = useState<string>("");
  const [records, setRecords] = useState<OrderItem[]>(orderItems);
  const [visibleRows, setVisibleRows] = useState<number>(2);
  const [selectedOrderItem, setSelectedOrderItem] = useState<number | null>(
    null,
  );
  const [orderBarCounts, setOrderBarCounts] = useState<OrderBarCounts>();

  useEffect(() => {
    if (isSearching) {
      handleSearch(searchString);
      return;
    }
    setRecords(getFilteredAndSortedRecords());
    setOrderBarCounts(calculateOrderBarCounts());
  }, [orderItems, isSearching, searchString, activeTab]);

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    setVisibleRows(2);
    if (searchStr.length === 0) {
      setIsSearching(false);
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

  const handleShowMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 2);
  };

  const handleShowLess = () => {
    setVisibleRows((prevVisibleRows) =>
      prevVisibleRows > 4 ? prevVisibleRows - 2 : 2,
    );
  };

  const visibleListings = records.slice(0, visibleRows * 3);

  function getFilteredAndSortedRecords() {
    let filteredOrderItems;
    // 'ALL' tab shows all items without any additional filtering
    if (activeTab === OrderItemStatusEnum.All) {
      filteredOrderItems = orderItems;
    } else if (activeTab === OrderItemStatusEnum.Refunded) {
      // 'REFUNDED' tab shows items that are 'REFUNDED' or pending refund
      filteredOrderItems = orderItems.filter(
        (item) =>
          item.status === OrderItemStatusEnum.Refunded ||
          (item.RefundRequest &&
            item.RefundRequest.status === RefundStatusEnum.Pending),
      );
    } else if (
      activeTab === OrderItemStatusEnum.PendingBooking ||
      activeTab === OrderItemStatusEnum.PendingFulfillment ||
      activeTab === OrderItemStatusEnum.Fulfilled
    ) {
      filteredOrderItems = orderItems.filter(
        (item) =>
          item.status === activeTab &&
          (!item.RefundRequest ||
            (item.RefundRequest &&
              item.RefundRequest.status !== RefundStatusEnum.Pending)), // filter out pending refund items
      );
    } else {
      // PAID_OUT or EXPIRED tabs show items with the respective statuses only
      filteredOrderItems = orderItems.filter(
        (item) => item.status === activeTab,
      );
    }

    // Apply sorting to the filtered list
    return filteredOrderItems;
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
          if (
            item.RefundRequest &&
            item.RefundRequest.status === RefundStatusEnum.Pending
          ) {
            orderBarCounts.refundedCount++;
            break;
          }
          orderBarCounts.toBookCount++;
          break;
        case OrderItemStatusEnum.PendingFulfillment:
          if (
            item.RefundRequest &&
            item.RefundRequest.status === RefundStatusEnum.Pending
          ) {
            orderBarCounts.refundedCount++;
            break;
          }
          orderBarCounts.toFulfillCount++;
          break;
        case OrderItemStatusEnum.Fulfilled:
          if (
            item.RefundRequest &&
            item.RefundRequest.status === RefundStatusEnum.Pending
          ) {
            orderBarCounts.refundedCount++;
            break;
          }
          orderBarCounts.fulfilledCount++;
          break;
        case OrderItemStatusEnum.PaidOut: // paid out means its fulfilled, paid out items cannot be refunded or pending refund
          orderBarCounts.fulfilledCount++;
          break;
        case OrderItemStatusEnum.Expired: // expired items cannot be refunded or pending refund
          orderBarCounts.expiredCount++;
          break;
        case OrderItemStatusEnum.Refunded:
          orderBarCounts.refundedCount++;
          break;
      }
    });
    return orderBarCounts;
  }

  const handleRowClick = (orderItemId: number) => {
    form.setValues({
      ...form.values,
      orderItemId: orderItemId,
    });
    setSelectedOrderItem(orderItemId);
  };

  const orderItemCards = visibleListings.map((orderItem) => (
    <Grid.Col span={6} key={orderItem.orderItemId}>
      <Card
        radius="md"
        withBorder
        onClick={() => handleRowClick(orderItem.orderItemId)}
        style={{
          backgroundColor:
            selectedOrderItem === orderItem.orderItemId ? "#f0f0f0" : "white",
        }}
      >
        <Group>
          <Box>
            <Image
              src={
                orderItem.serviceListing.attachmentURLs &&
                orderItem.serviceListing.attachmentURLs.length > 0
                  ? orderItem.serviceListing.attachmentURLs[0]
                  : "/pethub-placeholder.png"
              }
              height={70}
              width={70}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text
              weight={600}
              size="sm"
              sx={{ lineHeight: 1.4, wordWrap: "break-word" }}
            >
              {orderItem.serviceListing.title} ID: {orderItem.orderItemId}
            </Text>
            <Text size="xs" color="dimmed">
              Status: {formatStringToLetterCase(orderItem.status)}
            </Text>
            <Text size="xs" color="dimmed">
              Date Created: {formatISODateOnly(orderItem.invoice.createdAt)}
            </Text>
            <Text size="xs" color="dimmed">
              Price: ${" "}
              {formatNumber2Decimals(orderItem.serviceListing.basePrice)}
            </Text>
          </Box>
        </Group>
      </Card>
    </Grid.Col>
  ));

  const renderContent = () => {
    if (orderItems.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return <SadDimmedMessage title="No Order Item found" subtitle="" />;
    }

    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>{orderItemCards}</>
        )}
      </>
    );
  };

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <SearchBar
            text="Search by title, business or ID"
            onSearch={handleSearch}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <OrderStatusBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            orderBarCounts={orderBarCounts && orderBarCounts}
          />
        </Grid.Col>
        {renderContent()}
      </Grid>
      <Box mt="xl">
        {visibleListings.length < records.length && (
          <Button onClick={handleShowMore} style={{ marginRight: 8 }}>
            Show More Items
          </Button>
        )}
        {visibleRows > 2 && <Button onClick={handleShowLess}>Show Less</Button>}
      </Box>
    </>
  );
}
