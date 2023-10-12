import { Container, Grid, Group, MultiSelect, Transition } from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import { useToggle } from "@mantine/hooks";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useState } from "react";
import {
  AccountTypeEnum,
  OrderItemStatus,
  formatEnumValueToLowerCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import PBOrdersTable from "@/components/pb-orders/PBOrdersTable";
import { OrderItem } from "@/types/types";

interface OrdersProps {
  userId: number;
}

export default function Orders({ userId }: OrdersProps) {
  /*
   * Fetch data
   */
  const orderItemStatusValues = Object.values(OrderItemStatus).map((status) =>
    status.toString(),
  );
  // everytime there is a change in startdate, endate, status, sl call the endpoint to ge the new set of orders
  const orders = dummyOrderItems;

  /*
   * Component State
   */
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<OrderItem[]>(orders);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "orderItemId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  /*
   * Search Functions
   */
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(orders);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchOrdersForPB(orders, searchStr);
    setRecords(results);
    setPage(1);
  };

  function searchOrdersForPB(orderItems: OrderItem[], searchStr: string) {
    return orderItems.filter((orderItem: OrderItem) => {
      const formattedCategory = formatEnumValueToLowerCase(
        orderItem.orderItemStatus,
      );
      return (
        orderItem.itemName.toLowerCase().includes(searchStr.toLowerCase()) ||
        formattedCategory.includes(searchStr.toLowerCase())
      );
    });
  }

  const renderContent = () => {
    if (orders.length === 0) {
      // if(isLoading) {
      //     return <CenterLoader/>
      // }
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No service listings found"
                subtitle="Click 'Create Service Listing' to create a new service"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <Grid>
          <Grid.Col span={6}>
            <MultiSelect
              label="Service Listing"
              placeholder="Select service listing"
              data={orderItemStatusValues}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              label="Status"
              placeholder="Select status"
              data={orderItemStatusValues}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              valueFormat="YYYY MMM DD"
              label="Start Date"
              placeholder="Date input"
              defaultValue={
                new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              valueFormat="YYYY MMM DD"
              label="End Date"
              placeholder="Date input"
              defaultValue={
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <SearchBar
              text="Search by name and status"
              onSearch={handleSearch}
            />
          </Grid.Col>
        </Grid>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>
            <PBOrdersTable
              records={records}
              page={page}
              isSearching={isSearching}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              onPageChange={setPage}
              totalNumRecords={orders.length}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Orders - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Orders Management" />
        </Group>
        {renderContent()}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = session.user["userId"];

  return { props: { userId } };
}

const dummyOrderItems: OrderItem[] = [
  {
    orderItemId: 1,
    itemName: "Product A",
    itemPrice: 29.99,
    quantity: 2,
    expiryDate: "2023-12-31",
    voucherCode: "ABCD1234",
    orderItemStatus: OrderItemStatus.PENDING_BOOKING,
  },
  {
    orderItemId: 2,
    itemName: "Product B",
    itemPrice: 49.99,
    quantity: 1,
    expiryDate: "2023-11-30",
    voucherCode: "EFGH5678",
    orderItemStatus: OrderItemStatus.PENDING_FULFILLMENT,
  },
  {
    orderItemId: 3,
    itemName: "Product C",
    itemPrice: 19.99,
    quantity: 3,
    expiryDate: "2023-10-31",
    voucherCode: "IJKL9012",
    orderItemStatus: OrderItemStatus.FULFILLED,
  },
];
