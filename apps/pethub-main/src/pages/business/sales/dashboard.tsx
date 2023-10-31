import {
  Badge,
  Box,
  Card,
  Chip,
  Container,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { formatNumber2Decimals, formatStringToLetterCase } from "shared-utils";
import { PageTitle } from "web-ui";
import api from "@/api/axiosConfig";
import BusinesssSalesSummarySection from "@/components/business-sales/BusinessSalesSummarySection";
import MonthlySalesChart from "@/components/business-sales/MonthlySalesChart";
import TopServiceListingsTable from "@/components/business-sales/TopServiceListingsTable";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import {
  SalesDashboardServiceListing,
  SalesDashboardSummary,
} from "@/types/types";

interface SalesDashboardProps {
  summary: SalesDashboardSummary;
  allTimeTop5ServiceListings: SalesDashboardServiceListing[];
  top5ServiceListingsWithin30Days: SalesDashboardServiceListing[];
  // Month, Sales
  monthlySales: [string, any][];
}

export default function SalesDashboard({
  summary,
  allTimeTop5ServiceListings,
  top5ServiceListingsWithin30Days,
  monthlySales,
}: SalesDashboardProps) {
  const theme = useMantineTheme();
  const [selectedChipValue, setSelectedChipValue] =
    useState<string>("all-time");

  return (
    <>
      <Head>
        <title>Sales Dashboard - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid p="lg" h="100%" w="100%" bg={theme.colors.gray[0]}>
        <Container fluid mb="xl">
          <Group position="apart" mb="lg">
            <PageTitle title="Sales Dashboard" />
          </Group>
          <Stack spacing={30}>
            <BusinesssSalesSummarySection summary={summary} />
            <Box>
              <Text size="xl" fw={600} mb="md">
                Top 5 Service Listings with Highest Sales
              </Text>
              <Chip.Group
                multiple={false}
                value={selectedChipValue}
                onChange={setSelectedChipValue}
              >
                <Group position="left">
                  <Chip value="all-time" size="md">
                    All time
                  </Chip>
                  <Chip value="last-30-days" size="md">
                    Last 30 days
                  </Chip>
                </Group>
              </Chip.Group>
              <TopServiceListingsTable
                records={
                  selectedChipValue === "all-time"
                    ? allTimeTop5ServiceListings
                    : top5ServiceListingsWithin30Days
                }
              />
            </Box>
            <Box>
              <Text size="xl" fw={600} mb="md">
                Monthly Sales for Last 12 Months ($ / month)
              </Text>
              <MonthlySalesChart monthlySales={monthlySales} />
            </Box>
          </Stack>
        </Container>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];

  const salesDashboardData = await (
    await api.get(`/chart/pet-business-sales/data/${userId}`)
  ).data;
  return {
    props: {
      summary: salesDashboardData.summary,
      allTimeTop5ServiceListings:
        salesDashboardData.lists["allTimeTop5ServiceListings"],
      top5ServiceListingsWithin30Days:
        salesDashboardData.lists["top5ServiceListingsWithin30Days"],
      monthlySales: salesDashboardData.charts["monthlySales"],
    },
  };
}
