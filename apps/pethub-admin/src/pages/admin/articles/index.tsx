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
  TABLE_PAGE_SIZE,
  Tag,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import CreateTagButtonModal from "@/components/tags/CreateTagButtonModal";
import TagTable from "@/components/tags/TagTable";
import {
  useCreateTag,
  useDeleteTag,
  useGetAllTags,
  useUpdateTag,
} from "@/hooks/tag";
import { PermissionsCodeEnum } from "@/types/constants";
import { CreateTagPayload, Permission, UpdateTagPayload } from "@/types/types";

interface ArticlesProps {
  permissions: Permission[];
}

export default function Articles({ permissions }: ArticlesProps) {
  const queryClient = useQueryClient();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  const { data: articles = [], isLoading, refetch } = null; //add  getArticles endpt

  // for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Article[]>(articles); //create Article type
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "articleId",
    direction: "asc",
  });
  const [searchResults, setSearchResults] = useState<Article[]>([]);

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedTags = sortBy(searchResults, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedTags.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedTags.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, articles, searchResults]);

  useEffect(() => {
    setSearchResults(articles);
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (articles.length === 0) {
        setHasNoFetchedRecords(true);
      }
      setSearchResults(articles);
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [articles]);

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(articles); // reset search results
      setPage(1);
      return;
    }
    // search by id or title
    setIsSearching(true);
    const results = articles.filter(
      (article: Article) =>
        article.title.toLowerCase().includes(searchStr.toLowerCase()) ||
        (article.articleId &&
          searchStr.includes(article.articleId.toString()) &&
          searchStr.length <= article.articleId.toString().length),
    );
    setSearchResults(results);
    setPage(1);
  };

  // ADD DELETE ARTICLE HERE
  // const deleteTagMutation = useDeleteTag(queryClient);
  // const handleDeleteTag = async (id: number) => {
  //   try {
  //     await deleteTagMutation.mutateAsync(id);
  //     notifications.show({
  //       title: "Tag Deleted",
  //       color: "green",
  //       icon: <IconCheck />,
  //       message: `Tag ID: ${id} deleted successfully.`,
  //     });
  //     // refetch();
  //   } catch (error: any) {
  //     notifications.show({
  //       ...getErrorMessageProps("Error Deleting Tag", error),
  //     });
  //   }
  // };

  // ADD UPDATE ARTICLE HERE
  // const updateTagMutation = useUpdateTag();
  // const handleUpdateTag = async (payload: UpdateTagPayload) => {
  //   try {
  //     await updateTagMutation.mutateAsync(payload);
  //     notifications.show({
  //       title: "Tag Updated",
  //       color: "green",
  //       icon: <IconCheck />,
  //       message: `Tag ${payload.tagId} updated successfully.`,
  //     });
  //     refetch();
  //   } catch (error: any) {
  //     notifications.show({
  //       ...getErrorMessageProps("Error Updating Tag", error),
  //     });
  //   }
  // };

  //ADD CREATE ARTICLE HERE (may be different cuz need rich text editor)
  // const createTagMutation = useCreateTag(queryClient);
  // const handleCreateTag = async (payload: CreateTagPayload) => {
  //   try {
  //     await createTagMutation.mutateAsync(payload);
  //     notifications.show({
  //       title: "Tag Created",
  //       color: "green",
  //       icon: <IconCheck />,
  //       message: `Tag created successfully!`,
  //     });
  //   } catch (error: any) {
  //     notifications.show({
  //       ...getErrorMessageProps("Error Creating Tag", error),
  //     });
  //   }
  // };

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const renderContent = () => {
    if (articles.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      // no articles fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No articles found"
                subtitle="Click 'Create Article' to create a new article"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar text="Search by article ID, title" onSearch={handleSearch} />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          // <TagTable
          //   tags={records}
          //   totalNumTags={searchResults.length}
          //   onDelete={handleDeleteTag}
          //   onUpdate={handleUpdateTag}
          //   page={page}
          //   sortStatus={sortStatus}
          //   onSortStatusChange={setSortStatus}
          //   onPageChange={setPage}
          //   disabled={!canWrite}
          // />
          <></>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Articles - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart" mb="xl">
          <PageTitle title="Article Management" />
          {/* {canWrite && <CreateTagButtonModal onCreate={handleCreateTag} />} */}
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
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { permissions } };
}
