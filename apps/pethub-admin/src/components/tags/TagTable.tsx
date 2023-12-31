import { Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Tag, getMinTableHeight } from "shared-utils";
import { TABLE_PAGE_SIZE } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import { UpdateTagPayload } from "@/types/types";
import EditTagButtonModal from "./EditTagButtonModal";
interface TagTableProps {
  tags: Tag[];
  totalNumTags: number;
  page: number;
  sortStatus: DataTableSortStatus;
  onDelete(id: number): void;
  onUpdate(payload: UpdateTagPayload): void;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  disabled?: boolean;
}

const TagTable = ({
  tags,
  totalNumTags,
  page,
  sortStatus,
  onDelete,
  onUpdate,
  onSortStatusChange,
  onPageChange,
  disabled,
}: TagTableProps) => {
  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(tags)}
        columns={[
          {
            accessor: "tagId",
            title: "#",
            textAlignment: "right",
            width: 80,
            sortable: true,
          },
          { accessor: "name", width: "25vw", ellipsis: true, sortable: true },
          {
            accessor: "dateCreated",
            title: "Date Created",
            sortable: true,
            ellipsis: true,
            width: 100,
            render: ({ dateCreated }) => {
              return new Date(dateCreated).toLocaleDateString();
            },
          },
          {
            accessor: "lastUpdated",
            title: "Last Updated",
            sortable: true,
            ellipsis: true,
            width: 100,
            render: ({ lastUpdated }) => {
              return lastUpdated
                ? new Date(lastUpdated).toLocaleDateString()
                : "-";
            },
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 100,
            textAlignment: "right",
            hidden: disabled,
            render: (record) => (
              <Group position="right">
                <EditTagButtonModal
                  tagId={record.tagId}
                  currentName={record.name}
                  onUpdate={onUpdate}
                />
                <DeleteActionButtonModal
                  title={`Are you sure you want to delete the tag: ${record.name}?`}
                  subtitle="Any service listing currently assigned to this tag will be unassigned."
                  onDelete={() => {
                    onDelete(record.tagId);
                    // Check if there is only 1 record on this page and we're not on the first page.
                    if (tags.length === 1 && page > 1) {
                      onPageChange(page - 1);
                    }
                  }}
                />
              </Group>
            ),
          },
        ]}
        records={tags}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumTags}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
        idAccessor="tagId"
      />
    </>
  );
};

export default TagTable;
