import { Container, Group, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import ServiceListingTable from "@/components/service-listings/ServiceListingTable";
import {
  useDeleteServiceListingById,
  useGetAllServiceListings,
} from "@/hooks/service-listing";
import { useGetAllTags } from "@/hooks/tag";
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "@/types/constants";
import { ServiceListing } from "@/types/types";

// https://zumvet.com/blog/wp-content/uploads/2023/06/Pet-Angel-Blog-2022-14-1080x648-1.png

export default function ServiceListings() {
  const queryClient = useQueryClient();

  //fetch data
  const {
    data: serviceListings = [],
    isLoading,
    refetch,
  } = useGetAllServiceListings();

  //for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "serviceListingId",
    direction: "asc",
  });

  /*
   * Effect Hooks
   */
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedServiceListing = sortBy(
      serviceListings,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedServiceListing.reverse();
    }
    const newRecords = sortedServiceListing.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, serviceListings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (serviceListings.length === 0) {
        sethasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  /*
   * Search Functions
   */
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(serviceListings);
      setPage(1);
      return;
    }
    // search by id or name
    const formatEnumValue = (value: string) => {
      return value.replace(/_/g, " ").toLowerCase();
    };

    // Search by title or category
    setIsSearching(true);
    const results = serviceListings.filter((serviceListing: ServiceListing) => {
      const formattedCategory = formatEnumValue(serviceListing.category);
      const formattedTags = serviceListing.tags.map((tag) =>
        tag.name.toLowerCase(),
      );
      return (
        serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()) ||
        formattedCategory.includes(searchStr.toLowerCase()) ||
        formattedTags.some((tag) => tag.includes(searchStr.toLowerCase()))
      );
    });
    setRecords(results);
    setPage(1);
  };

  /*
   * Delete
   */
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const handleDeleteServiceListing = async (id: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(id);
      notifications.show({
        title: "ServiceListing Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `ServiceListing ID: ${id} deleted successfully.`,
      });
      // refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error Deleting ServiceListing",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const renderContent = () => {
    if (serviceListings.length === 0) {
      if (isLoading) {
        <CenterLoader />;
      }
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage title="No service listings found" subtitle="" />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar
          text="Search by title, category, tags"
          onSearch={handleSearch}
        />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <ServiceListingTable
            records={records}
            totalNumServiceListing={serviceListings.length}
            onDelete={handleDeleteServiceListing}
            isSearching={isSearching}
            page={page}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <Container fluid>
      <PageTitle title="Service Listings Management" />
      {renderContent()}
    </Container>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session) return null;

//   const userId = session.user["userId"];
//   const accountType = session.user["accountType"];

//   return { props: { userId, accountType } };
// }
