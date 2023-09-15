import { Button, Group, Center, Modal } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useGetAllUserGroups } from "@/hooks/rbac";
import { TABLE_PAGE_SIZE } from "@/types/constants";
import { Tag } from "@/types/types";
import { ViewButton } from "../common/ViewButton";
interface TagTableProps {
  tags: Tag[];
  page: number;
  sortStatus: DataTableSortStatus;
  onDelete(id: number): void;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const TagTable = ({
  tags,
  page,
  sortStatus,
  onDelete,
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
          { accessor: "name", width: "25vw", ellipsis: true, sortable: true },
          {
            accessor: "dateCreated",
            title: "Date Created",
            sortable: true,
            ellipsis: true,
            width: "40vw",
            render: ({ dateCreated }) => {
              return new Date(dateCreated).toLocaleDateString();
            },
          },
          {
            accessor: "lastUpdated",
            title: "Last Updated",
            sortable: true,
            ellipsis: true,
            width: "40vw",
            render: ({ lastUpdated }) => {
              return new Date(lastUpdated).toLocaleDateString();
            },
          },
          {
            // actions
            accessor: "${record.tagId}-button",
            title: "Actions",
            width: "10vw",
            render: (record) => (
              <Group>
                <EditActionButton
                  onClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
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
        totalRecords={tags ? tags.length : 0}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
        idAccessor="tagId"
      />
    </>
  );
};

export default TagTable;
