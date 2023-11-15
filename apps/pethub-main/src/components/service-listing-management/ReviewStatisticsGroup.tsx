import { useMantineTheme, Box, Grid } from "@mantine/core";
import React from "react";
import Chart from "react-google-charts";
import { ReviewStatsResponse } from "shared-utils";

interface ReviewStatisticsGroupProps {
  reviewStats: ReviewStatsResponse;
}

const ReviewStatisticsGroup = ({ reviewStats }: ReviewStatisticsGroupProps) => {
  const theme = useMantineTheme();

  const themeColors = [
    theme.colors.red[7], // 5 paw
    theme.colors.orange[7],
    theme.colors.green[7],
    theme.colors.indigo[5],
    theme.colors.grape[7], // 1 paw
  ];

  const ratingCountDistributionOptions = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Number of ratings",
      minValue: 0,
      format: "0", // integer
    },
    title: "Ratings / Time (past 6 months)",
    curveType: "none",
    legend: { position: "bottom" },
    animation: {
      startup: true,
      easing: "out",
      duration: 5000,
    },
    colors: themeColors,
  };

  const averageRatingOptions = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Average Rating",
      ticks: [1, 2, 3, 4, 5], // brackets
      minValue: 1,
    },
    title: "Average Rating / Time (past 6 months)",
    curveType: "function",
    legend: { position: "bottom" },
    animation: {
      startup: true,
      easing: "out",
      duration: 5000,
    },
  };

  const ratingCountOptions = {
    title: "Ratings Distribution (past 6 months)",
    colors: themeColors,
  };

  return (
    <Box mb="xs">
      <Grid columns={12}>
        <Grid.Col span={12}>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={reviewStats?.ratingCountDistributionData}
            options={ratingCountDistributionOptions}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={reviewStats?.averageReviewData}
            options={averageRatingOptions}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Chart
            chartType="PieChart"
            data={reviewStats?.ratingCountData}
            options={ratingCountOptions}
            width={"100%"}
            height={"400px"}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default ReviewStatisticsGroup;
