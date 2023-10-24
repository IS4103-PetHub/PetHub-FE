import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { TABLE_PAGE_SIZE, getMinTableHeight } from "shared-utils";
import { CommissionRule, PetBusiness } from "@/types/types";

interface CommissionRulePetBusinessesTableProps {
  commissionRule?: CommissionRule;
  // refetch(): void;
  disabled?: boolean;
}

const CommissionRulePetBusinessesTable = ({
  commissionRule,
  disabled, // refetch
}: CommissionRulePetBusinessesTableProps) => {
  const [petBusinesses, setpetBusinesses] = useState<PetBusiness[]>(
    commissionRule?.petBusinesses ?? [],
  );
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    setpetBusinesses(commissionRule?.petBusinesses?.slice(from, to) ?? []);
  }, [page, commissionRule]);

  return (
    <DataTable
      minHeight={getMinTableHeight(commissionRule?.petBusinesses)}
      columns={[
        {
          accessor: "userId",
          title: "User ID",
          textAlignment: "right",
          width: 80,
        },
        {
          accessor: "companyName",
          title: "Company Name",
          textAlignment: "left",
        },
        {
          accessor: "uen",
          title: "UEN",
          width: "15vw",
          ellipsis: true,
        },
        {
          accessor: "user.email",
          title: "Email",
          width: "20vw",
          ellipsis: true,
        },
      ]}
      records={petBusinesses}
      withBorder
      withColumnBorders
      striped
      verticalSpacing="xs"
      totalRecords={commissionRule?.petBusinesses?.length}
      recordsPerPage={TABLE_PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      idAccessor="commissionRuleId"
    />
  );
};

export default CommissionRulePetBusinessesTable;
