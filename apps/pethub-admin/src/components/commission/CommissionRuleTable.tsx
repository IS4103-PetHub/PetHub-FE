import { Group, Badge } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  TABLE_PAGE_SIZE,
  formatNumber2Decimals,
  getErrorMessageProps,
  getMinTableHeight,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { useDeleteCommissionRuleById } from "@/hooks/commission-rule";
import { CommissionRule } from "@/types/types";

interface CommissionRuleTableProps {
  commissionRules: CommissionRule[];
  page: number;
  sortStatus: DataTableSortStatus;
  onSortStatusChange: any;
  onPageChange(p: number): void;
  disabled?: boolean;
  totalNumGroup: number;
  canWrite: boolean;
}

export default function CommissionRuleTable({
  commissionRules,
  page,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  disabled,
  totalNumGroup,
}: CommissionRuleTableProps) {
  const router = useRouter();

  /*
   * Component State
   */
  const [selectedCommission, setSelectedCommission] = useState(null);

  /*
   * Service Handlers
   */
  const queryClient = useQueryClient();
  const deleteCommissionRuleMutation = useDeleteCommissionRuleById(queryClient);
  const handleDeleteCommission = async (commissionRuleId: number) => {
    try {
      if (commissionRuleId == 1) {
        notifications.show({
          title: "Error Deleting Commission Rule",
          color: "red",
          icon: <IconX />,
          message: "Unable to Delete a Default Commission Rule",
        });
        return;
      }
      await deleteCommissionRuleMutation.mutateAsync(commissionRuleId);
      notifications.show({
        message: "Commission Rule Successfully Deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Commission Rule", error),
      });
    }
  };

  return (
    <>
      <DataTable
        onRowClick={(record) =>
          router.push(
            `/admin/commission/commission-rules/${record.commissionRuleId}`,
          )
        }
        minHeight={getMinTableHeight(commissionRules)}
        records={commissionRules}
        columns={[
          {
            accessor: "name",
            title: "Name",
            textAlignment: "left",
            width: "15vw",
            sortable: true,
            ellipsis: true,
            render: (rowData) => (
              <div>
                {rowData.name}
                {rowData.commissionRuleId == 1 && (
                  <Badge color="blue">Default</Badge>
                )}
              </div>
            ),
          },
          {
            accessor: "commissionRate",
            title: "Rate (%)",
            textAlignment: "right",
            width: "10vw",
            sortable: true,
            render: (rowData) =>
              formatNumber2Decimals(rowData.commissionRate * 100),
          },
          {
            accessor: "createdAt",
            title: "Date Created",
            textAlignment: "left",
            width: "10vw",
            sortable: true,
            render: (rowData) => (
              <div>{new Date(rowData.createdAt).toLocaleDateString()}</div>
            ),
          },
          {
            accessor: "updatedAt",
            title: "Date Updated",
            textAlignment: "left",
            width: "10vw",
            sortable: true,
            render: (rowData) => (
              <div>
                {rowData.updatedAt
                  ? new Date(rowData.updatedAt).toLocaleDateString()
                  : "-"}
              </div>
            ),
          },
          {
            // actions
            accessor: "actions",
            title: "Actions",
            width: "10vw",
            textAlignment: "right",
            hidden: disabled,
            render: (group) => (
              <Group position="right">
                <ViewActionButton
                  onClick={function (): void {
                    setSelectedCommission(group);
                    router.push(
                      `${router.asPath}/commission-rules/${group.commissionRuleId}`,
                    );
                  }}
                />
                <DeleteActionButtonModal
                  title={`Are you sure you want to delete ${group.name}?`}
                  subtitle={
                    group.petBusinesses && group.petBusinesses.length > 0
                      ? "Are you sure you want to delete the commission rule? There are existing pet businesses assigned to this Commission Rule. The pet businessses would be reassigned to the default rule."
                      : "The commission rule would no longer exists."
                  }
                  onDelete={() =>
                    handleDeleteCommission(group.commissionRuleId)
                  }
                />
              </Group>
            ),
          },
        ]}
        withBorder
        withColumnBorders
        striped
        verticalSpacing="sm"
        idAccessor="commissionRuleId"
        //sorting
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        //pagination
        totalRecords={totalNumGroup}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
        highlightOnHover
      />
    </>
  );
}
