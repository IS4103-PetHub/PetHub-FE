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
    ["Month", "1 Paw", "2 Paw", "3 Paw", "4 Paw", "5 Paw"],
    ["May", 20, 15, 48, 65, 130],
    ["Jun", 30, 20, 45, 80, 100],
    ["Jul", 35, 10, 50, 90, 150],
    ["Aug", 40, 15, 60, 100, 120],
    ["Sep", 45, 20, 70, 105, 140],
    ["Oct", 50, 25, 80, 110, 260],
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
      easing: "inAndOut",
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
      easing: "linear",
      duration: 3000,
    },
  };

  return (
    <Box mb="xs">
      <Box mb="xs">
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={linedata1}
          options={lineoptions1}
        />
      </Box>
      <Box mb="xs">
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={linedata2}
          options={lineoptions2}
        />
      </Box>
    </Box>
  );
};

export default ReviewStatisticsGroup;
