import { Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { Tag, UpdateTagPayload } from "@/types/types";
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
}: TagTableProps) => {
  return (
    <>
      <DataTable
        minHeight={150}
        columns={[
          {
            accessor: "tagId",
            title: "#",
            textAlignment: "right",
            width: 80,
            sortable: true,
          },
          { accessor: "name", width: "45vw", ellipsis: true, sortable: true },
          {
            accessor: "dateCreated",
            title: "Date Created",
            sortable: true,
            ellipsis: true,
            width: "10vw",
            render: ({ dateCreated }) => {
              return new Date(dateCreated).toLocaleDateString();
            },
          },
          {
            accessor: "lastUpdated",
            title: "Last Updated",
            sortable: true,
            ellipsis: true,
            width: "10vw",
            render: ({ lastUpdated }) => {
              return new Date(lastUpdated).toLocaleDateString();
            },
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 100,
            textAlignment: "right",
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
                  onDelete={() => onDelete(record.tagId)}
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
