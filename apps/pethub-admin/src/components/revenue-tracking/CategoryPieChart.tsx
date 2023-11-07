import { Card, useMantineTheme } from "@mantine/core";
import React from "react";
import Chart from "react-google-charts";
import { ServiceCategoryEnum, formatStringToLetterCase } from "shared-utils";

interface CategoryPieChartProps {
  data: [string, any][];
}

const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  const theme = useMantineTheme();

  const options = {
    colors: [
      theme.colors.indigo[4],
      theme.colors.red[4],
      theme.colors.green[4],
      theme.colors.blue[4],
      theme.colors.orange[4],
    ],
    animation: {
      startup: true,
      easing: "out",
      duration: 1500,
    },
  };

  function getFormattedData() {
    const newData = data.map((row, index) => {
      if (index !== 0) {
        if (
          Object.values(ServiceCategoryEnum).includes(
            row[0] as ServiceCategoryEnum,
          )
        ) {
          return [formatStringToLetterCase(row[0]), row[1]];
        }
      }
      return row;
    });
    return newData;
  }

  return (
    <Card shadow="sm" radius="md">
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={getFormattedData()}
        options={options}
      />
    </Card>
  );
};

export default CategoryPieChart;
