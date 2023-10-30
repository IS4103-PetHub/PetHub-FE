import { Container, Group, Transition } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import CommissionRuleModal from "@/components/commission/CommissionRuleModal";
import CommissionRuleTable from "@/components/commission/CommissionRuleTable";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useGetAllCommissionRules } from "@/hooks/commission-rule";
import { PermissionsCodeEnum } from "@/types/constants";
import { CommissionRule, Permission } from "@/types/types";

interface CommissionProps {
  permissions: Permission[];
}

export default function Commission({ permissions }: CommissionProps) {
  /*
   *   Permissions
   */
  // TODO: permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteCommissionRules,
  );
  const canRead = permissionCodes.includes(
    PermissionsCodeEnum.ReadCommissionRules,
  );

  const {
    data: commissionRules = [],
    refetch: refetchCommissionRules,
    isLoading,
  } = useGetAllCommissionRules();
  /*
   * Component State
   */
  const [isCreateModalOpen, { close: closeCreate, open: openCreate }] =
    useDisclosure(false);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<CommissionRule[]>(commissionRules);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "commissionRuleId",
    direction: "asc",
  });
  const [searchResults, setSearchResults] = useState<CommissionRule[]>([]);

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedCommissionRule = sortBy(
      searchResults,
      sortStatus.columnAccessor,
    );
    if (sortStatus.direction === "desc") {
      sortedCommissionRule.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedCommissionRule.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, commissionRules, searchResults]);

  useEffect(() => {
    setSearchResults(commissionRules);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (commissionRules.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [commissionRules]);

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(commissionRules);
      setPage(1);
      return;
    }
    // search by id or name
    setIsSearching(true);
    const results = commissionRules.filter((rule: CommissionRule) =>
      rule.name.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setSearchResults(results);
    setPage(1);
  };

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const renderContent = () => {
    if (commissionRules.length === 0) {
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
                title="No Commission Rule found"
                subtitle="Click 'Create Commission Rule' to create a new Group"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar text="Search by commission name" onSearch={handleSearch} />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <CommissionRuleTable
            commissionRules={records}
            totalNumGroup={searchResults.length}
            page={page}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onPageChange={setPage}
            disabled={!canWrite}
            canWrite={canWrite}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Commission Rules - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <Group position="apart">
            <PageTitle title="Commission Rule Management" />
            {canWrite && (
              <LargeCreateButton
                text="Create Commission Rule"
                onClick={openCreate}
              />
            )}
          </Group>
          {renderContent()}
        </Container>
        <CommissionRuleModal
          opened={isCreateModalOpen}
          canWrite={canWrite}
          onClose={closeCreate}
          refetch={refetchCommissionRules}
        />
      </main>
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
