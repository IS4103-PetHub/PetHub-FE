import { Group, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  TABLE_PAGE_SIZE,
  getErrorMessageProps,
  getMinTableHeight,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import ViewActionButton from "web-ui/shared/ViewActionButton";
import { CommissionRule } from "@/types/types";
import CommissionRuleModal from "./CommissionRuleModal";

interface CommissionRuleTableProps {
  commissionRules: CommissionRule[];
  page: number;
  isSearching: boolean;
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
  isSearching,
  sortStatus,
  onSortStatusChange,
  onPageChange,
  disabled,
  totalNumGroup,
  canWrite,
}: CommissionRuleTableProps) {
  const router = useRouter();

  /*
   * Component State
   */
  const [selectedCommission, setSelectedCommission] = useState(null);

  /*
   * Service Handlers
   */
  const handleDeleteCommission = async (commissionRuleId: number) => {
    try {
      // TODO: endpoint to delete commission group and refetch
      console.log("DELETE Commission Group");

      notifications.show({
        message: "Service Successfully Deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

  return (
    <>
      <DataTable
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
                {rowData.default && <Badge color="blue">Default</Badge>}
              </div>
            ),
          },
          {
            accessor: "commissionRate",
            title: "Rate (%)",
            textAlignment: "right",
            width: "10vw",
            sortable: true,
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
                  subtitle="The commission Rule would no longer exists"
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
        totalRecords={isSearching ? commissionRules.length : totalNumGroup}
        recordsPerPage={TABLE_PAGE_SIZE}
        page={page}
        onPageChange={(p) => onPageChange(p)}
      />
    </>
  );
}
