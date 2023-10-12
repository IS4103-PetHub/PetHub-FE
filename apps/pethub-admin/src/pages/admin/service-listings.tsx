import { Container, Group, Transition, MultiSelect } from "@mantine/core";
import { useToggle, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  ServiceListing,
  TABLE_PAGE_SIZE,
  getErrorMessageProps,
  searchServiceListingsForPB,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import ServiceListingTable from "@/components/service-listings/ServiceListingTable";
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import {
  useDeleteServiceListingById,
  useGetAllServiceListings,
} from "@/hooks/service-listing";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface ServiceListingsProps {
  permissions: Permission[];
}

export default function ServiceListings({ permissions }: ServiceListingsProps) {
  const queryClient = useQueryClient();
  const isTablet = useMediaQuery("(max-width: 100em)");

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteServiceListings,
  );
  const canRead = permissionCodes.includes(
    PermissionsCodeEnum.ReadServiceListings,
  );

  //fetch data
  const {
    data: serviceListings = [],
    isLoading,
    isError,
  } = useGetAllServiceListings();
  const { data: petBusinesses = [] } = useGetAllPetBusinesses();

  //for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
  const [selectedPB, setSelectedPB] = useState<string[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "serviceListingId",
    direction: "asc",
  });
  const [filteredTotal, setFilteredTotal] = useState<number>(0);
  const [searchResults, setSearchResults] =
    useState<ServiceListing[]>(serviceListings);

  /*
   * Effect Hooks
   */
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;

    //let filteredServiceListings = isSearching ? searchResults : serviceListings;
    let filteredServiceListings = searchResults;

    // Filter by selected pet businesses
    if (selectedPB.length > 0) {
      filteredServiceListings = filteredServiceListings.filter(
        (serviceListing) =>
          serviceListing.petBusiness &&
          selectedPB.includes(serviceListing.petBusiness.companyName),
      );
    }

    const sortedServiceListings = sortBy(
      filteredServiceListings,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedServiceListings.reverse();
    }
    setFilteredTotal(sortedServiceListings.length);
    const newRecords = sortedServiceListings.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, serviceListings, selectedPB, searchResults]);

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
      //setRecords(serviceListings);
      setSearchResults(serviceListings); // reset search results
      setPage(1);
      return;
    }
    // search by id or name
    const formatEnumValue = (value: string) => {
      return value.replace(/_/g, " ").toLowerCase();
    };

    // Search by title or category
    setIsSearching(true);
    const results = searchServiceListingsForPB(serviceListings, searchStr);
    setSearchResults(results);
    //setRecords(results);
    setPage(1);
  };

  const searchAndSortGroup = (
    <Group position="apart" align="center">
      <SearchBar
        size="md"
        w="66.5%"
        text="Search by title, category, tags"
        onSearch={handleSearch}
      />
      <MultiSelect
        w={isTablet ? "30%" : "32%"}
        size="md"
        mt={-25}
        label="Filter by Pet Businesses"
        placeholder="Select Pet Businesses"
        maxSelectedValues={10}
        dropdownPosition="bottom"
        clearable
        data={petBusinesses.map((petBusinesses) => petBusinesses.companyName)}
        value={selectedPB}
        onChange={setSelectedPB}
      />
    </Group>
  );

  /*
   * Delete
   */
  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const handleDeleteServiceListing = async (id: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(id);
      notifications.show({
        title: "Service Listing Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Service Listing ID: ${id} deleted successfully.`,
      });
      // refetch();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

  if (isError) {
    return ErrorAlert("Service Listings");
  }

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const renderContent = () => {
    if (serviceListings.length === 0) {
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
              <SadDimmedMessage title="No service listings found" subtitle="" />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        {serviceListings.length > 0 ? searchAndSortGroup : null}
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <ServiceListingTable
            records={records}
            totalNumServiceListing={filteredTotal}
            onDelete={handleDeleteServiceListing}
            canWrite={canWrite}
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
    <>
      <Head>
        <title>Service Listings - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <PageTitle title="Service Listing Management" />
        {renderContent()}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { permissions } };
}
