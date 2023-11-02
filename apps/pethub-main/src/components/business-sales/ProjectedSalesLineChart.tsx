import { Card, useMantineTheme } from "@mantine/core";
import React from "react";
import Chart from "react-google-charts";

interface ProjectedSalesLineChartProps {
  data: [string, any][];
}
const ProjectedSalesLineChart = ({ data }: ProjectedSalesLineChartProps) => {
  const theme = useMantineTheme();

  const options = {
    hAxis: { title: "Month" },
    vAxis: { title: "Sales ($)" },
    legend: { position: "bottom" },
    curveType: "function",
    colors: [theme.colors.indigo[5], theme.colors.pink[5]],
    animation: {
      startup: true,
      easing: "out",
      duration: 3000,
    },
  };

  return (
    <Card shadow="sm" radius="md">
      <Chart
        chartType="LineChart"
        width="100%"
        height="600px"
        data={data}
        options={options}
      />
    </Card>
  );
};

export default ProjectedSalesLineChart;
