import { Card, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface ProjectedSalesLineChartProps {
  data: [string, any, any][];
}
const ProjectedSalesLineChart = ({ data }: ProjectedSalesLineChartProps) => {
  const theme = useMantineTheme();
  const [processedData, setProcessedData] = useState([]);

  function getProcessedData() {
    let processedData: any[] = [];
    processedData[0] = [
      ...data[0],
      { id: "c0", type: "boolean", role: "certainty" },
      { id: "a0", type: "string", role: "annotation" },
    ];
    for (let i = 1; i < data.length; i++) {
      // start of projected sales
      if (i === data.length - 3) {
        processedData[i] = [...data[i], false, "Projected"];
      } else {
        processedData[i] = [...data[i], false, null];
      }
    }
    console.log(processedData);
    return processedData;
  }

  useEffect(() => {
    setProcessedData(getProcessedData());
  }, [data]);

  const options = {
    hAxis: { title: "Month" },
    vAxis: { title: "Sales ($)" },
    legend: { position: "bottom" },
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
        data={processedData}
        options={options}
      />
    </Card>
  );
};

export default ProjectedSalesLineChart;
