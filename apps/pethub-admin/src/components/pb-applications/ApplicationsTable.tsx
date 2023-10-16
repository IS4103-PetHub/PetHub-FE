import { Center, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { EMPTY_STATE_DELAY_MS, getMinTableHeight } from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllPetBusinessApplications } from "@/hooks/pet-business-application";
import { BusinessApplicationStatusEnum } from "@/types/constants";
import { PetBusinessApplication } from "@/types/types";
import { searchPBApplications } from "@/util";
import { errorAlert } from "@/util";
import { ViewButtonWithEvent } from "../common/ViewButtonWithEvent";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

const PAGE_SIZE = 10;

// If applicationStatus is filtered by ALL, Pending should display first, then rejected, then approved
const statusPriority = {
  [BusinessApplicationStatusEnum.Pending]: 1,
  [BusinessApplicationStatusEnum.Rejected]: 2,
  [BusinessApplicationStatusEnum.Approved]: 3,
};
interface ApplicationsTableProps {
  applicationStatus: BusinessApplicationStatusEnum;
}

export default function ApplicationsTable({
  applicationStatus,
}: ApplicationsTableProps) {
  const {
    data: petBusinessApplications = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllPetBusinessApplications();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "petBusinessApplicationId",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<PetBusinessApplication[]>(
    petBusinessApplications,
  );
  const router = useRouter();
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [isSearching, setIsSearching] = useToggle();
  const [searchResults, setSearchResults] = useState<PetBusinessApplication[]>(
    [],
  );

  // Filter the applications by the applicationStatus, unless it's 'All'
  const filterApplications = (applications: PetBusinessApplication[]) => {
    if (applicationStatus !== BusinessApplicationStatusEnum.All) {
      return applications.filter(
        (app) => app.applicationStatus === applicationStatus,
      );
    }
    return applications;
  };

  /*
   * When filtered for ALL, applications should be sorted according to PENDING, REJECTED, APPROVED
   * When filtered for PENDING, REJECTED, or APPROVED, applications should be sorted according to date last updated
   */
  const sortApplications = (applications: PetBusinessApplication[]) => {
    let sortedApplications: PetBusinessApplication[];
    if (applicationStatus === BusinessApplicationStatusEnum.All) {
      sortedApplications = sortBy(
        applications,
        (app) => statusPriority[app.applicationStatus],
      );
    } else {
      sortedApplications = sortBy(applications, "lastUpdated");
    }
    if (sortStatus.direction === "desc") {
      sortedApplications.reverse();
    }
    return sortedApplications;
  };

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    const filteredApplications = filterApplications(searchResults);
    const sortedPetBusinessApplications =
      sortApplications(filteredApplications);
    const newRecords = sortedPetBusinessApplications.slice(from, to);
    setRecords(newRecords);
  }, [
    page,
    sortStatus,
    petBusinessApplications,
    applicationStatus,
    searchResults,
  ]);

  useEffect(() => {
    setSearchResults(petBusinessApplications);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (petBusinessApplications.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [petBusinessApplications]);

  if (isError) {
    return errorAlert("Error fetching Pet Business Applications");
  }

  // Search based on filtered application status only
  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(petBusinessApplications);
      setPage(1);
      return;
    }

    setIsSearching(true);
    const results = searchPBApplications(petBusinessApplications, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  return (
    <>
      {petBusinessApplications.length === 0 ? (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <SadDimmedMessage title="No pet business applications found" />
          )}
        </Transition>
      ) : (
        <>
          <SearchBar
            text="Search by pet business application ID, UEN, business type"
            onSearch={handleSearch}
          />
          {isSearching && records.length === 0 ? (
            <NoSearchResultsMessage />
          ) : (
            <DataTable
              onRowClick={(record) => {
                router.push(
                  `/admin/pb-applications/${record.petBusinessApplicationId}`,
                );
              }}
              rowStyle={{ cursor: "pointer" }}
              withBorder
              borderRadius="sm"
              withColumnBorders
              sortStatus={sortStatus}
              striped
              highlightOnHover
              verticalAlignment="center"
              minHeight={getMinTableHeight(records)}
              records={records}
              columns={[
                {
                  accessor: "petBusinessApplicationId",
                  title: "#",
                  textAlignment: "right",
                  width: 100,
                  sortable: true,
                },
                {
                  accessor: "petBusiness.companyName",
                  title: "Company Name",
                  sortable: true,
                  ellipsis: true,
                },
                {
                  accessor: "petBusiness.uen",
                  title: "UEN",
                  sortable: true,
                  ellipsis: true,
                },
                {
                  accessor: "businessType",
                  title: "Business Type",
                  sortable: true,
                  ellipsis: true,
                  render: ({ businessType }) => {
                    return formatStringToLetterCase(businessType);
                  },
                },
                {
                  accessor: "dateCreated",
                  title: "Date Created",
                  sortable: true,
                  ellipsis: true,
                  width: 150,
                  render: ({ dateCreated }) => {
                    return new Date(dateCreated).toLocaleDateString();
                  },
                },
                {
                  accessor: "lastUpdated",
                  title: "Last Updated",
                  sortable: true,
                  ellipsis: true,
                  width: 150,
                  render: ({ lastUpdated }) => {
                    return new Date(lastUpdated as any).toLocaleDateString();
                  },
                },
                ...(applicationStatus === BusinessApplicationStatusEnum.All // This column will not render if applicationStatus is set to `ALL`
                  ? [
                      {
                        accessor: "applicationStatus",
                        title: "Status",
                        sortable: true,
                        render: ({ applicationStatus }: any) => (
                          <ApplicationStatusBadge
                            applicationStatus={applicationStatus}
                          />
                        ),
                      },
                    ]
                  : []),
                {
                  accessor: "actions",
                  title: "Actions",
                  width: 140,
                  textAlignment: "right",
                  render: (record) => (
                    <Center style={{ height: "100%" }}>
                      <ViewButtonWithEvent
                        onClick={(e: any) => {
                          e.stopPropagation();
                          router.push(
                            `/admin/pb-applications/${record.petBusinessApplicationId}`,
                          );
                        }}
                      />
                    </Center>
                  ),
                },
              ]}
              onSortStatusChange={setSortStatus}
              totalRecords={searchResults ? searchResults.length : 0}
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              idAccessor="petBusinessApplicationId"
            />
          )}
        </>
      )}
    </>
  );
}
