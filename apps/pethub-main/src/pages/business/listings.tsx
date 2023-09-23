import { Container, Group, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import ServiceListingModal from "@/components/service-listing-management/ServiceListingModal";
import ServiceListTable from "@/components/service-listing-management/ServiceListingTable";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";
import { useGetAllTags } from "@/hooks/tags";
import {
  AccountTypeEnum,
  EMPTY_STATE_DELAY_MS,
  TABLE_PAGE_SIZE,
} from "@/types/constants";
import { ServiceListing } from "@/types/types";
import { searchServiceListingsForPB } from "@/util";
interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function Listings({ userId, accountType }: MyAccountProps) {
  /*
   * Fetch data
   */
  const {
    data: serviceListings = [],
    isLoading,
    refetch: refetchServiceListings,
  } = useGetServiceListingByPetBusinessId(userId);

  /*
   * Component State
   */
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] =
    useState(false);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "serviceListingId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const { data: tags } = useGetAllTags();
  const [petBusiness, setPetBusiness] = useState(null);
  const { data: petBusinessData } = useGetPetBusinessByIdAndAccountType(
    userId,
    accountType,
  );

  useEffect(() => {
    if (petBusinessData) {
      setPetBusiness(petBusinessData);
    }
  }, [petBusinessData]);

  /*
   * Modal Control Functions
   */
  const openCreateServiceModal = () => {
    setIsCreateServiceModalOpen(true);
  };

  const closeCreateServiceModal = () => {
    setIsCreateServiceModalOpen(false);
  };

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
        setHasNoFetchedRecords(true);
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

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchServiceListingsForPB(serviceListings, searchStr);
    setRecords(results);
    setPage(1);
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
        <SearchBar
          text="Search by title, category, tags"
          onSearch={handleSearch}
        />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <ServiceListTable
            records={records}
            totalNumServiceListing={serviceListings.length}
            userId={userId}
            refetch={refetchServiceListings}
            page={page}
            isSearching={isSearching}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onPageChange={setPage}
            tags={tags}
            addresses={petBusiness ? petBusiness.businessAddresses : []}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Service Listings - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Service Listings Management" />
          <LargeCreateButton
            text="Create Service Listing"
            onClick={openCreateServiceModal}
          />
        </Group>

        <Group mt="xs">
          <ServiceListingModal
            opened={isCreateServiceModalOpen}
            onClose={closeCreateServiceModal}
            isView={false}
            isUpdate={false}
            serviceListing={null}
            userId={userId}
            refetch={refetchServiceListings}
            tags={tags}
            addresses={petBusiness ? petBusiness.businessAddresses : []}
          />
        </Group>
        {renderContent()}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
