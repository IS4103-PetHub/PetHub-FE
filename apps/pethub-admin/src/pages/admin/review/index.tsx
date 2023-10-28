import { Container, Group, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  Review,
  TABLE_PAGE_SIZE,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import ReportedReviewTable from "@/components/review/ReportedReviewTable";
import {
  useDeleteReview,
  useGetAllReportedReviews,
  useResolveReview,
} from "@/hooks/reported-review";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface ReportedReviewProps {
  permissions: Permission[];
}

export default function ReportedReview({ permissions }: ReportedReviewProps) {
  const queryClient = useQueryClient();

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
    data: reportedReviews = [],
    isLoading,
    isError,
  } = useGetAllReportedReviews();

  //for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Review[]>(reportedReviews);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "reportedBy.length",
    direction: "desc",
  });
  const [searchResults, setSearchResults] = useState<Review[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedOrderItems = sortBy(searchResults, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedOrderItems.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedOrderItems.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, reportedReviews, searchResults]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (reportedReviews.length === 0) {
        sethasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [reportedReviews]);

  /*
   * Search Functions
   */
  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(reportedReviews);
      setPage(1);
      return;
    }

    // Search by title, category, tag
    setIsSearching(true);
    const results = searchReviews(reportedReviews, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchReviews(reviews: Review[], searchStr: string) {
    return reviews.filter((review: Review) => {
      return (
        review.title.toLowerCase().includes(searchStr.toLowerCase()) ||
        review.reviewId.toString().includes(searchStr.toLowerCase())
      );
    });
  }

  const deleteReviewMutation = useDeleteReview(queryClient);
  const handleDeleteReview = async (id: number) => {
    try {
      await deleteReviewMutation.mutateAsync(id);
      notifications.show({
        title: "Review Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Review ID: ${id} deleted successfully.`,
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Review", error),
      });
    }
  };

  const resolveReviewMutation = useResolveReview(queryClient);
  const handleResolveReview = async (id: number) => {
    try {
      await resolveReviewMutation.mutateAsync(id);
      notifications.show({
        title: "Review Resolved",
        color: "green",
        icon: <IconCheck />,
        message: `Review ID: ${id} resolved successfully.`,
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Resolving Review", error),
      });
    }
  };

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const renderContent = () => {
    if (reportedReviews.length === 0) {
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
              <SadDimmedMessage title="No Reported Reviews found" subtitle="" />
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
            <ReportedReviewTable
              records={records}
              totalNumRecords={searchResults.length}
              page={page}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              onPageChange={setPage}
              canWrite={canWrite}
              onDelete={handleDeleteReview}
              onResolve={handleResolveReview}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Reported Review - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Reported Review Management" />
        </Group>
        <SearchBar
          text="Search by Review ID and title"
          onSearch={handleSearch}
          size="md"
        />
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
