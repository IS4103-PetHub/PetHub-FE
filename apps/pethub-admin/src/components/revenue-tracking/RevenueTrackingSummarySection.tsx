import { Grid } from "@mantine/core";
import React from "react";
import { formatNumber2Decimals } from "shared-utils";
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
      `$${formatNumber2Decimals(summary.totalTransactionAmount)}`,
    ],
    [
      "Total Commission Earned",
      `$${formatNumber2Decimals(summary.totalCommissionEarned)}`,
    ],
    [
      "Last 30 Day Transaction Amount",
      `$${formatNumber2Decimals(summary.last30DaysTransactionAmount)}`,
    ],
    [
      "Last 30 Day Commission Earned",
      `$${formatNumber2Decimals(summary.last30DaysCommissionEarned)}`,
    ],
  ]);

  const renderSummarySection = () => {
    const first3Cards = Array.from(summaryMap.entries()).map(([key, value]) => (
      <Grid.Col span={3} key={key}>
        <MiniSummaryCard title={key} body={value} />
      </Grid.Col>
    ));
    return first3Cards;
  };

  return <Grid>{renderSummarySection()}</Grid>;
};

export default RevenueTrackingSummarySection;