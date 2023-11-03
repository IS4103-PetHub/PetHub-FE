import { Grid } from "@mantine/core";
import React from "react";
import { formatNumber2Decimals, formatISODateLong } from "shared-utils";
import MiniSummaryCard from "web-ui/shared/dashboard/MiniSummaryCard";
import { SalesDashboardSummary } from "@/types/types";

interface BusinessSalesSummarySectionProps {
  summary: SalesDashboardSummary;
}

const BusinessSalesSummarySection = ({
  summary,
}: BusinessSalesSummarySectionProps) => {
  const summaryMap = new Map<string, any>([
    ["Total Number of Orders", summary.totalNumOrders],
    ["Total Sales", `$${formatNumber2Decimals(summary.totalSales)}`],
    ["Last 30 Day Sales", `$${formatNumber2Decimals(summary.last30DaySales)}`],
  ]);

  const renderSummarySection = () => {
    const first3Cards = Array.from(summaryMap.entries()).map(([key, value]) => (
      <Grid.Col span={3} key={key}>
        <MiniSummaryCard title={key} body={value} />
      </Grid.Col>
    ));
    const lastCard = (
      <Grid.Col span={3}>
        <MiniSummaryCard
          key={summary.mostSalesDate}
          title={"Date with Most Sales"}
          body={`$${formatNumber2Decimals(summary.mostSalesAmount)}`}
          subbody={formatISODateLong(summary.mostSalesDate)}
        />
      </Grid.Col>
    );
    return [...first3Cards, lastCard];
  };

  return <Grid>{renderSummarySection()}</Grid>;
};

export default BusinessSalesSummarySection;