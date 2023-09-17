import { Container, Group, Transition } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import CreateTagButtonModal from "@/components/tags/CreateTagButtonModal";
import TagTable from "@/components/tags/TagTable";
import {
  useCreateTag,
  useDeleteTag,
  useGetAllTags,
  useUpdateTag,
} from "@/hooks/tag";
import { EMPTY_STATE_DELAY_MS, TABLE_PAGE_SIZE } from "@/types/constants";
import { CreateTagPayload, Tag, UpdateTagPayload } from "@/types/types";

export default function Tags() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading, refetch } = useGetAllTags();

  // for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Tag[]>(tags);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, sethasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "tagId",
    direction: "asc",
  });

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedTags = sortBy(tags, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedTags.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedTags.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, tags]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after 0.8s
      if (tags.length === 0) {
        sethasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(tags);
      setPage(1);
      return;
    }
    // search by id or name
    setIsSearching(true);
    const results = tags.filter(
      (tag: Tag) =>
        tag.name.toLowerCase().includes(searchStr.toLowerCase()) ||
        (tag.tagId &&
          searchStr.includes(tag.tagId.toString()) &&
          searchStr.length <= tag.tagId.toString().length),
    );
    setRecords(results);
    setPage(1);
  };

  const deleteTagMutation = useDeleteTag(queryClient);
  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation.mutateAsync(id);
      notifications.show({
        title: "Tag Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Tag ${id} deleted successfully.`,
      });
      // refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error Deleting Tag",
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

  const updateTagMutation = useUpdateTag();
  const handleUpdateTag = async (payload: UpdateTagPayload) => {
    try {
      await updateTagMutation.mutateAsync(payload);
      notifications.show({
        title: "Tag Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Tag ${payload.tagId} updated successfully.`,
      });
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error Updating Tag",
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

  const createTagMutation = useCreateTag(queryClient);
  const handleCreateTag = async (payload: CreateTagPayload) => {
    try {
      await createTagMutation.mutateAsync(payload);
      notifications.show({
        title: "Tag Created",
        color: "green",
        icon: <IconCheck />,
        message: `Tag created successfully!`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Creating Tag",
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
    if (tags.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no tags fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No tags found"
                subtitle="Click 'Create Tag' to create a new tag"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar text="Search by tag ID, name" onSearch={handleSearch} />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <TagTable
            tags={records}
            totalNumTags={tags.length}
            onDelete={handleDeleteTag}
            onUpdate={handleUpdateTag}
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
      <Group position="apart" mb="xl">
        <PageTitle title="Tags Management" />
        <CreateTagButtonModal onCreate={handleCreateTag} />
      </Group>

      {renderContent()}
    </Container>
  );
}
