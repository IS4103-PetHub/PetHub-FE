import { Card, useMantineTheme } from "@mantine/core";
import React from "react";
import Chart from "react-google-charts";

interface TransactionsCommissionAreaChartProps {
  data: [string, any, any][];
}
const TransactionsCommissionAreaChart = ({
  data,
}: TransactionsCommissionAreaChartProps) => {
  const theme = useMantineTheme();

  const options = {
    colors: [theme.colors.indigo[4], theme.colors.pink[4]],
    legend: { position: "bottom" },
    hAxis: { title: "Month" },
    vAxis: { title: "Amount ($)" },
    animation: {
      startup: true,
      easing: "out",
      duration: 1500,
    },
  };
  return (
    <Card shadow="sm" radius="md">
      <Chart
        chartType="AreaChart"
        width="100%"
        height="600px"
        data={data}
        options={options}
      />
    </Card>
  );
};

export default TransactionsCommissionAreaChart;
