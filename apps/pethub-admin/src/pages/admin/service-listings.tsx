import { Container, Group, Transition, MultiSelect } from "@mantine/core";
import { useToggle, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  ServiceListing,
  TABLE_PAGE_SIZE,
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

  /*
   * Effect Hooks
   */
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;

    let filteredServiceListings = serviceListings;

    // Filter by selected pet businesses
    if (selectedPB.length > 0) {
      filteredServiceListings = filteredServiceListings.filter(
        (serviceListing) =>
          serviceListing.petBusiness &&
          selectedPB.includes(serviceListing.petBusiness.companyName),
      );
    }

    const sortedServiceListing = sortBy(
      filteredServiceListings,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedServiceListing.reverse();
    }
    const newRecords = sortedServiceListing.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, serviceListings, selectedPB]);

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
    const results = searchServiceListingsForPB(serviceListings, searchStr);
    setRecords(results);
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
        maxSelectedValues={3}
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
            totalNumServiceListing={serviceListings.length}
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
    <Container fluid>
      <PageTitle title="Service Listings Management" />
      {renderContent()}
    </Container>
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
