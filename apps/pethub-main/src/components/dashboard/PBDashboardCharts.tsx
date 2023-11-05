import { Box, Grid, useMantineTheme } from "@mantine/core";
import MiniSummaryCard from "web-ui/shared/dashboard/MiniSummaryCard";
import { pbDashboardData } from "@/types/types";

interface pbDashboardDataProps {
  data: pbDashboardData;
}

export default function PBDashboardCharts({ data }: pbDashboardDataProps) {
  const theme = useMantineTheme();
  return (
    <Box>
      <Grid>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title="Unreplied Reviews"
            body={data.unrepliedReviewCount.toString()}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title="Invalid Service Listings"
            body={data.invalidSLCount.toString()}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title="Pending Refund Requests"
            body={data.openRefundRequestsCount.toString()}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title="Pending Support Requests"
            body={data.openSupportRequestsCount.toString()}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
}