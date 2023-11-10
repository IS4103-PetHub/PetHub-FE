import { Group, Badge } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React from "react";
import {
  Article,
  TABLE_PAGE_SIZE,
  formatNumber2Decimals,
  getMinTableHeight,
} from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";

interface ArticleManagementTableProps {
  records: Article[];
  totalNumArticle: number;
  onDelete(id: number): void;
  canWrite: boolean;
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
}

const ArticleManagementTable = ({
  records,
  totalNumArticle,
  onDelete,
  canWrite,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
}: ArticleManagementTableProps) => {
  const router = useRouter();
  return (
    <>
      <DataTable
        minHeight={getMinTableHeight(records)}
        columns={[
          {
            accessor: "articleId",
            title: "#",
            textAlignment: "right",
            width: 80,
            sortable: true,
          },
          {
            accessor: "title",
            title: "Title",
            textAlignment: "left",
            width: "20vw",
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "createdBy.name",
            title: "Author",
            sortable: true,
            ellipsis: true,
            width: "10vw",
          },
          {
            accessor: "category",
            title: "Categories",
            textAlignment: "left",
            width: "10vw",
            render: (record) =>
              record.categories
                ? record.categories.map((category, index) => (
                    <React.Fragment key={category}>
                      <Badge color="blue">{category}</Badge>
                      {index < record.categories.length - 1 && "\u00A0"}
                    </React.Fragment>
                  ))
                : "-",
          },
          {
            accessor: "tags",
            title: "Tags",
            textAlignment: "left",
            width: "10vw",
            render: (record) =>
              record.tags
                ? record.tags.map((tag, index) => (
                    <React.Fragment key={tag.tagId}>
                      <Badge color="blue">{tag.name}</Badge>
                      {index < record.tags.length - 1 && "\u00A0"}
                    </React.Fragment>
                  ))
                : "-",
          },
          {
            accessor: "isPinned",
            title: "Pinned",
            textAlignment: "right",
            width: 100,
            sortable: true,
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 100,
            textAlignment: "right",
            render: (record) => (
              <Group position="right">
                <ViewActionButton
                  onClick={() =>
                    router.push(`${router.asPath}/${record.articleId}`)
                  }
                />
                {canWrite && (
                  <DeleteActionButtonModal
                    title={`Are you sure you want to delete ${record.title}?`}
                    subtitle="Pet Owners would no longer be able to view this service listing."
                    onDelete={() => {
                      onDelete(record.articleId);
                      if (records.length === 1 && page > 1) {
                        onPageChange(page - 1);
                      }
                    }}
                  />
                )}
              </Group>
            ),
          },
        ]}
        records={records}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="articleId"
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumArticle}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
};

export default ArticleManagementTable;
