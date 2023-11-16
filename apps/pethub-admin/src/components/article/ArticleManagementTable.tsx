import { Group, Badge } from "@mantine/core";
import { IconPin, IconPinFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import React from "react";
import {
  Article,
  TABLE_PAGE_SIZE,
  formatISODateTimeShort,
  formatNumber2Decimals,
  getMinTableHeight,
} from "shared-utils";
import { formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import ArticleTypeBadge from "web-ui/shared/article/ArticleTypeBadge";

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
        records={records}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="articleId"
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        totalRecords={totalNumArticle}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
        highlightOnHover
        onRowClick={(record) =>
          router.push(`${router.asPath}/${record.articleId}`)
        }
        columns={[
          {
            accessor: "articleId",
            title: "#",
            textAlignment: "right",
            width: 30,
            sortable: true,
          },
          {
            accessor: "title",
            title: "Title",
            textAlignment: "left",
            width: 170,
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "createdBy",
            title: "Author",
            sortable: true,
            ellipsis: true,
            width: 75,
            render: (record) =>
              record.createdBy.firstName + " " + record.createdBy.lastName,
          },
          {
            accessor: "articleType",
            title: "Type",
            textAlignment: "left",
            width: 75,
            render: (record) => (
              <ArticleTypeBadge
                ArticleType={formatStringToLetterCase(record.articleType)}
              />
            ),
          },
          {
            accessor: "dateCreated",
            title: "Date Created",
            textAlignment: "left",
            sortable: true,
            width: 75,
            render: (record) => {
              return `${formatISODateTimeShort(record.dateCreated)}`;
            },
          },
          {
            accessor: "isPinned",
            title: "Pin",
            textAlignment: "right",
            width: 35,
            sortable: true,
            render: (record) =>
              record.isPinned ? (
                <IconPinFilled size="1rem" />
              ) : (
                <IconPin size="1rem" />
              ),
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: 50,
            textAlignment: "right",
            render: (record) => (
              <Group position="right">
                <div onClick={(e) => e.stopPropagation()}>
                  <ViewActionButton
                    onClick={() =>
                      router.push(`${router.asPath}/${record.articleId}`)
                    }
                  />
                </div>
                {canWrite && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DeleteActionButtonModal
                      title={`Are you sure you want to delete ${record.title}?`}
                      subtitle="Pet Owners would no longer be able to view this article."
                      onDelete={() => {
                        onDelete(record.articleId);
                        if (records.length === 1 && page > 1) {
                          onPageChange(page - 1);
                        }
                      }}
                    />
                  </div>
                )}
              </Group>
            ),
          },
        ]}
      />
    </>
  );
};

export default ArticleManagementTable;
