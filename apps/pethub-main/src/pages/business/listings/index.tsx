import { Alert, Container, Group, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  AccountStatusEnum,
  AccountTypeEnum,
  EMPTY_STATE_DELAY_MS,
  ServiceListing,
  TABLE_PAGE_SIZE,
  isValidServiceListing,
  searchServiceListingsForPB,
  sortInvalidServiceListings,
} from "shared-utils";
import { PageTitle, useLoadingOverlay } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import ServiceListingModal from "@/components/service-listing-management/ServiceListingModal";
import ServiceListTable from "@/components/service-listing-management/ServiceListingTable";
import { useGetCalendarGroupByPBId } from "@/hooks/calendar-group";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";
import { useGetAllTags } from "@/hooks/tags";
import { PetBusiness } from "@/types/types";
interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
  canView: boolean;
}

export default function Listings({
  userId,
  accountType,
  canView,
}: MyAccountProps) {
  /*
   * Fetch data
   */
  const {
    data: serviceListings = [],
    isLoading,
    refetch: refetchServiceListings,
  } = useGetServiceListingByPetBusinessId(userId, true);

  const { data: calendarGroups = [] } = useGetCalendarGroupByPBId(userId);

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
  const [searchResults, setSearchResults] = useState<ServiceListing[]>([]);
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const { data: tags } = useGetAllTags();
  const [petBusiness, setPetBusiness] = useState(null);
  const { data: petBusinessData } = useGetPetBusinessByIdAndAccountType(
    userId,
    accountType,
  );
  const [hasError, setHasError] = useState(false);
  const { hideOverlay } = useLoadingOverlay();

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
    hideOverlay(); // Hide the overlay that was triggered via a PB login in the event of a direct page login
  }, []);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedServiceListing = sortBy(
      searchResults,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedServiceListing.reverse();
    }
    const sortInvalidSL = sortInvalidServiceListings(sortedServiceListing);
    const newRecords = sortInvalidSL.slice(from, to);
    setRecords(sortInvalidServiceListings(newRecords));
  }, [page, sortStatus, serviceListings, searchResults]);

  useEffect(() => {
    setSearchResults(serviceListings);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (serviceListings.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [serviceListings]);

  useEffect(() => {
    let hasInvalidRecord = false;
    for (const record of records) {
      if (!isValidServiceListing(record)) {
        hasInvalidRecord = true;
        break;
      }
    }
    setHasError(hasInvalidRecord);
  }, [records]);

  /*
   * Search Functions
   */
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(sortInvalidServiceListings(serviceListings));
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchServiceListingsForPB(serviceListings, searchStr);
    setSearchResults(sortInvalidServiceListings(results));
    setPage(1);
  };

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
            totalNumServiceListing={searchResults.length}
            refetch={refetchServiceListings}
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
        <title>Service Listings - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!canView ? (
        <PBCannotAccessMessage />
      ) : (
        <Container fluid>
          <Group position="apart">
            <PageTitle title="Service Listing Management" />
            <LargeCreateButton
              text="Create Service Listing"
              onClick={openCreateServiceModal}
            />
          </Group>

          <Group mt="xs">
            {hasError && (
              <Alert
                color="red"
                title="Urgent Action Required"
                icon={<IconAlertCircle />}
                w="100%"
              >
                Service Listings highlighted in red are <strong>invalid</strong>{" "}
                and requires action. <br />
                Please ensure that every service listing that requires a booking
                has an allocated Calendar Group, valid duration and last
                operational date.
              </Alert>
            )}
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
              calendarGroups={calendarGroups}
            />
          </Group>
          {renderContent()}
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];
  const accountStatus = session.user["accountStatus"];
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { userId, accountType, canView } };
}
