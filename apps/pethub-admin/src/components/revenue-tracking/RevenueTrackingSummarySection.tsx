import { Grid } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { addCommasToNumberString, formatNumber2Decimals } from "shared-utils";
import MiniSummaryCard from "web-ui/shared/dashboard/MiniSummaryCard";
import { RevenueDashboardSummary } from "@/types/types";

interface RevenueTrackingSummarySectionProps {
  summary: RevenueDashboardSummary;
}

const RevenueTrackingSummarySection = ({
  summary,
}: RevenueTrackingSummarySectionProps) => {
  const summaryMap = new Map<string, any>([
    [
      "Total Transaction Amount",
      `$${addCommasToNumberString(
        formatNumber2Decimals(summary.totalTransactionAmount),
      )}`,
    ],
    [
      "Total Commission Earned",
      `$${addCommasToNumberString(
        formatNumber2Decimals(summary.totalCommissionEarned),
      )}`,
    ],
    [
      "Last 30 Day Transaction Amount",
      `$${addCommasToNumberString(
        formatNumber2Decimals(summary.last30DaysTransactionAmount),
      )}`,
    ],
    [
      "Last 30 Day Commission Earned",
      `$${addCommasToNumberString(
        formatNumber2Decimals(summary.last30DaysCommissionEarned),
      )}`,
    ],
  ]);

  const renderSummarySection = () => {
    const first3Cards = Array.from(summaryMap.entries()).map(([key, value]) => (
      <Grid.Col span={3} key={key}>
        <Link href="/admin/orders">
          <MiniSummaryCard title={key} body={value} />
        </Link>
      </Grid.Col>
    ));
    return first3Cards;
  };

  return <Grid>{renderSummarySection()}</Grid>;
};

export default RevenueTrackingSummarySection;
