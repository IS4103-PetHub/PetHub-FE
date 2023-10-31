import { Card, useMantineTheme } from "@mantine/core";
import React from "react";
import Chart from "react-google-charts";

interface MonthlySalesChartProps {
  monthlySales: [string, any][];
}

const MonthlySalesChart = ({ monthlySales }: MonthlySalesChartProps) => {
  const theme = useMantineTheme();
  const options = {
    hAxis: { title: "Month" },
    vAxis: { title: "Sales ($)" },
    legend: "none",
    colors: [theme.colors.indigo[4]],
  };

  return (
    <Card shadow="sm" radius="md">
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="600px"
        data={monthlySales}
        options={options}
      />
    </Card>
  );
};

export default MonthlySalesChart;
