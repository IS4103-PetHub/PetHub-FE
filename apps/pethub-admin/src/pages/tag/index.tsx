import { Container, Group } from "@mantine/core";
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
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import TagTable from "@/components/tag/TagTable";
import { useDeleteTag, useGetAllTags } from "@/hooks/tag";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { Tag } from "@/types/types";

export default function Tags() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading, refetch } = useGetAllTags();

  // for table
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Tag[]>(tags);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "tagId",
    direction: "asc",
  });

  const from = (page - 1) * TABLE_PAGE_SIZE;
  const to = from + TABLE_PAGE_SIZE;

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    const sortedTags = sortBy(tags, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedTags.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedTags.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, tags]);

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

  const renderContent = () => {
    if (tags.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no tags fetched
      return (
        <SadDimmedMessage
          title="No tags found"
          subtitle="Click 'Create Tag' to create a new tag"
        />
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
            onDelete={handleDeleteTag}
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
        <PageTitle title="Tag Management" />
        <LargeCreateButton
          text="Create Tag"
          onClick={() => router.push(`${router.asPath}/create`)}
        />
      </Group>

      {renderContent()}
    </Container>
  );
}
