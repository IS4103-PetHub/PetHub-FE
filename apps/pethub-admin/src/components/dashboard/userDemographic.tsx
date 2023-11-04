import { Box, Grid, Text } from "@mantine/core";
import MiniSummaryCard from "web-ui/shared/dashboard/MiniSummaryCard";
import { userDemographicData } from "../../../../pethub-main/src/types/types";

interface UserDemographicProps {
  data: userDemographicData;
}

export default function UserDemographic({ data }: UserDemographicProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "short",
  });

  return (
    <Box>
      <Grid>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title={`New Pet Owners for ${currentMonth}`}
            body={data.POCount.toString()}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title={`New Pet Businesses for ${currentMonth}`}
            body={data.PBCount.toString()}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title={`No. of Reported Reviews`}
            body={data.ReportedReviewCount.toString()}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MiniSummaryCard
            title={`No. of Pending Applications`}
            body={data.PBApplicationCount.toString()}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
}
