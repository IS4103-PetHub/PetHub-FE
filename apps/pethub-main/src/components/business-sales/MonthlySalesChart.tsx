import { Card, useMantineTheme } from "@mantine/core";
import React from "react";
import Chart, { GoogleChartWrapperChartType } from "react-google-charts";

interface MonthlySalesChartProps {
  data: [string, any][];
  chartType: string;
}

const MonthlySalesChart = ({ data, chartType }: MonthlySalesChartProps) => {
  const theme = useMantineTheme();

  const options = {
    hAxis: { title: chartType === "ColumnChart" ? "Month" : "Sales ($)" },
    vAxis: { title: chartType === "ColumnChart" ? "Sales ($)" : "Month" },
    legend: "none",
    colors: [theme.colors.indigo[4]],
    animation: {
      startup: true,
      easing: "out",
      duration: 1500,
    },
  };

  return (
    <Card shadow="sm" radius="md">
      <Chart
        chartType={chartType as GoogleChartWrapperChartType}
        width="100%"
        height="600px"
        data={data}
        options={options}
      />
    </Card>
  );
};

export default MonthlySalesChart;
