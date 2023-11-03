import {
  useMantineTheme,
  Text,
  Card,
  Button,
  Group,
  Box,
  Grid,
  Image,
  Center,
  Stack,
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconList,
  IconMessage,
  IconMessage2Off,
  IconMessageCircle,
  IconPhoto,
  IconThumbUp,
} from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { IconClockHour8 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Chart from "react-google-charts";
import { Review, ServiceListing } from "shared-utils";
import StarRating from "../review/StarRating";

interface ReviewStatisticsGroupProps {
  serviceListing: ServiceListing;
}

const ReviewStatisticsGroup = ({
  serviceListing,
}: ReviewStatisticsGroupProps) => {
  const linedata1 = [
    ["Month", "5 Paw", "4 Paw", "3 Paw", "2 Paw", "1 Paw"],
    ["May", 130, 65, 48, 15, 20],
    ["Jun", 100, 80, 45, 20, 30],
    ["Jul", 150, 90, 50, 10, 35],
    ["Aug", 120, 100, 60, 15, 40],
    ["Sep", 140, 105, 70, 20, 45],
    ["Oct", 260, 110, 80, 25, 50],
  ];

  const lineoptions1 = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Number of ratings",
    },
    title: "Ratings / Time (past 6 months)",
    curveType: "function",
    legend: { position: "bottom" },
    animation: {
      startup: true,
      easing: "out",
      duration: 3000,
    },
  };

  const linedata2 = [
    ["Month", "Average rating"],
    ["May", 3.5],
    ["Jun", 3.7],
    ["Jul", 4.3],
    ["Aug", 4.2],
    ["Sep", 4.9],
    ["Oct", 4.8],
  ];

  const lineoptions2 = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Average Rating",
    },
    title: "Average Rating / Time (past 6 months)",
    curveType: "function",
    legend: { position: "bottom" },
    animation: {
      startup: true,
      easing: "out",
      duration: 3000,
    },
  };

  const piedata = [
    ["Rating", "Count"],
    ["5 Paw (900)", 900],
    ["4 Paw (550)", 550],
    ["3 Paw (353)", 353],
    ["2 Paw (105)", 105],
    ["1 Paw (220)", 220],
  ];

  const pieoptions = {
    title: "Ratings Distribution (past 6 months)",
    is3D: true,
    animation: {
      startup: true,
      easing: "out",
      duration: 3000,
    },
  };

  return (
    <Box mb="xs">
      <Grid columns={12}>
        <Grid.Col span={12}>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={linedata1}
            options={lineoptions1}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={linedata2}
            options={lineoptions2}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Chart
            chartType="PieChart"
            data={piedata}
            options={pieoptions}
            width={"100%"}
            height={"400px"}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default ReviewStatisticsGroup;
