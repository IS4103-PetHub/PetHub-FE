import { Box, Radio, Text, Transition } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  PayoutInvoice,
  TABLE_PAGE_SIZE,
  formatISODateOnly,
  formatNumber2Decimals,
  getMinTableHeight,
} from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetPetBusinessPayoutInvoice } from "@/hooks/payoutInvoice";

interface CreateSupportPaymentItemTableProps {
  form: UseFormReturnType<any>;
  userId: number;
}

export default function CreateSupportPaymentItemTable({
  form,
  userId,
}: CreateSupportPaymentItemTableProps) {
  const { data: payoutInvoices = [], isLoading } =
    useGetPetBusinessPayoutInvoice(userId);

  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PayoutInvoice[]>(payoutInvoices);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "createdAt",
    direction: "desc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [searchResults, setSearchResults] = useState<PayoutInvoice[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedPayoutInvoices = sortBy(
      searchResults,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedPayoutInvoices.reverse();
    }
    const newRecords = sortedPayoutInvoices.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, payoutInvoices, searchResults]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (payoutInvoices.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [payoutInvoices]);

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(payoutInvoices);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchRefundsForPB(payoutInvoices, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchRefundsForPB(
    payoutInvoices: PayoutInvoice[],
    searchStr: string,
  ) {
    return payoutInvoices.filter((payoutInvoice: PayoutInvoice) => {
      return payoutInvoice.invoiceId
        .toString()
        .includes(searchStr.toLowerCase());
    });
  }

  const cols: any = [
    {
      accessor: "invoiceId",
      title: "ID",
      width: 80,
      sortable: true,
    },
    {
      accessor: "createdAt",
      title: "Payout Date",
      render: (record) => {
        return record.createdAt ? formatISODateOnly(record.createdAt) : "-";
      },
      sortable: true,
    },
    {
      accessor: "totalAmount",
      title: "Total Amount ($)",
      textAlignment: "left",
      render: (record) => {
        return `${formatNumber2Decimals(record.totalAmount)}`;
      },
      sortable: true,
    },
    {
      accessor: "commissionCharge",
      title: "Commission Amount ($)",
      textAlignment: "left",
      render: (record) => {
        return `${formatNumber2Decimals(record.commissionCharge)}`;
      },
      sortable: true,
    },
    {
      accessor: "paidOutAmount",
      title: "Payout Amount ($)",
      textAlignment: "left",
      render: (record) => {
        return `${formatNumber2Decimals(record.paidOutAmount)}`;
      },
      sortable: true,
    },
    {
      accessor: "action",
      title: "Select",
      textAlignment: "left",
      width: "6vw",
      render: (record) => (
        <Radio
          name="payoutInvoiceSelection"
          value={record.invoiceId}
          checked={form.values.payoutInvoiceId === record.invoiceId}
          onChange={() => handleRowClick(record)}
        />
      ),
    },
  ];

  const handleRowClick = (record) => {
    // Assuming serviceListingId is a string, adjust accordingly if it's a number, etc.
    form.setValues({
      ...form.values,
      payoutInvoiceId: record.invoiceId,
    });
  };

  const renderContent = () => {
    if (payoutInvoices.length === 0) {
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
              <SadDimmedMessage title="No Payout Invoices Found" subtitle="" />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>
            <DataTable
              minHeight={getMinTableHeight(records)}
              records={records}
              columns={cols}
              withBorder
              withColumnBorders
              striped
              verticalSpacing="sm"
              idAccessor="invoiceId"
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              totalRecords={searchResults.length}
              recordsPerPage={TABLE_PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              highlightOnHover
            />
          </>
        )}
      </>
    );
  };

  return (
    <Box mb="xl">
      <Text weight={500} mb={20}>
        Select Payout Invoice
      </Text>
      <SearchBar
        text="Search by Payout Invoice ID"
        onSearch={handleSearch}
        size="md"
      />
      {renderContent()}
    </Box>
  );
}
