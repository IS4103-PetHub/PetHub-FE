import { Box, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
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
import { useGetorderItemsByPetOwnerId } from "@/hooks/order";
import { searchOrderItemsForCustomer } from "@/util";

interface SelectRefundRequestsProps {
  form: UseFormReturnType<any>;
  userId: number;
}

export default function SelectRefundRequests({
  form,
  userId,
}: SelectRefundRequestsProps) {
  const {
    data: orderItems = [],
    isLoading,
    refetch,
  } = useGetorderItemsByPetOwnerId(userId);
  const [isSearching, setIsSearching] = useToggle();
  const [searchString, setSearchString] = useState<string>("");
  const [records, setRecords] = useState<OrderItem[]>(orderItems);
  const [visibleRows, setVisibleRows] = useState<number>(2);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);

  useEffect(() => {
    if (isSearching) {
      handleSearch(searchString);
      return;
    }
    setRecords(getFilteredRefund());
  }, [orderItems, isSearching, searchString]);

  function getFilteredRefund() {
    const filteredOrderItems = orderItems.filter(
      (item) =>
        item.status === OrderItemStatusEnum.Refunded ||
        (item.RefundRequest &&
          item.RefundRequest.status === RefundStatusEnum.Pending),
    );
    return filteredOrderItems;
  }

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    setVisibleRows(2);
    if (searchStr.length === 0) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const filteredAndSortedRecords = getFilteredRefund();
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

  const handleRowClick = (refundRequestId: number) => {
    form.setValues({
      ...form.values,
      refundRequestId: refundRequestId,
    });
    setSelectedBooking(refundRequestId);
  };

  const orderItemCards = visibleListings.map((orderItem) => (
    <Grid.Col span={6} key={orderItem.RefundRequest.refundRequestId}>
      <Card
        radius="md"
        withBorder
        onClick={() => handleRowClick(orderItem.RefundRequest?.refundRequestId)}
        style={{
          backgroundColor:
            selectedBooking === orderItem.RefundRequest?.refundRequestId
              ? "#f0f0f0"
              : "white",
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
              Refund Status:{" "}
              {formatStringToLetterCase(orderItem?.RefundRequest?.status)}
            </Text>
            <Text size="xs" color="dimmed">
              Order Created Date:{" "}
              {formatISODateOnly(orderItem.invoice.createdAt)}
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
      return (
        <SadDimmedMessage title="No Refund Order Item found" subtitle="" />
      );
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
