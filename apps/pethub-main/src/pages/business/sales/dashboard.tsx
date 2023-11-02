import {
  Box,
  Button,
  Center,
  Chip,
  Container,
  Group,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconChartBar, IconReport } from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { PageTitle } from "web-ui";
import CustomPopover from "web-ui/shared/CustomPopover";
import api from "@/api/axiosConfig";
import BusinessSalesSummarySection from "@/components/business-sales/BusinessSalesSummarySection";
import MonthlySalesChart from "@/components/business-sales/MonthlySalesChart";
import ProjectedSalesLineChart from "@/components/business-sales/ProjectedSalesLineChart";
import TopServiceListingsTable from "@/components/business-sales/TopServiceListingsTable";
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
  // Month, Sales, Projected
  aggregatedAndProjectedSales: [string, any][];
}

export default function SalesDashboard({
  summary,
  allTimeTop5ServiceListings,
  top5ServiceListingsWithin30Days,
  monthlySales,
  aggregatedAndProjectedSales,
}: SalesDashboardProps) {
  const theme = useMantineTheme();
  const [selectedChipValue, setSelectedChipValue] =
    useState<string>("all-time");
  const [monthlySalesChartType, setMonthlySalesChartType] =
    useState("ColumnChart");

  const projectedFirstMonth =
    aggregatedAndProjectedSales[aggregatedAndProjectedSales.length - 3][0];
  const projectedLastMonth =
    aggregatedAndProjectedSales[aggregatedAndProjectedSales.length - 1][0];

  return (
    <>
      <Head>
        <title>Business Sales Dashboard - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid p="lg" h="100%" w="100%" bg={theme.colors.gray[0]}>
        <Container fluid mb="xl">
          <Group position="apart" mb="xl">
            <PageTitle title="Business Sales Dashboard" />
            <Button
              size="md"
              leftIcon={<IconReport />}
              className="gradient-hover"
            >
              View Monthly Sales Reports
            </Button>
          </Group>
          <Stack spacing={30}>
            <BusinessSalesSummarySection summary={summary} />
            <Box>
              <Group>
                <Text size="xl" fw={600} mb="md">
                  Top 5 Service Listings with the Highest Number of Orders
                </Text>
              </Group>
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
              <Group position="apart" mb="md">
                <Text size="xl" fw={600}>
                  Monthly Sales for Last 12 Months ($ / month)
                </Text>
                <SegmentedControl
                  data={[
                    {
                      value: "ColumnChart",
                      label: (
                        <Center>
                          <IconChartBar size="1rem" color="gray" />
                          <Box ml={5}>Vertical</Box>
                        </Center>
                      ),
                    },
                    {
                      value: "BarChart",
                      label: (
                        <Center>
                          <IconChartBar
                            size="1rem"
                            color="gray"
                            style={{ transform: "rotate(90deg)" }}
                          />
                          <Box ml={5}>Horizontal</Box>
                        </Center>
                      ),
                    },
                  ]}
                  value={monthlySalesChartType}
                  onChange={setMonthlySalesChartType}
                />
              </Group>
              <MonthlySalesChart
                data={monthlySales}
                chartType={monthlySalesChartType}
              />
            </Box>
            <Box>
              <Group align="flex-start">
                <Text size="xl" fw={600} mb="md">
                  Projected Sales ($ / month) for {projectedFirstMonth} to{" "}
                  {projectedLastMonth}
                </Text>
                <CustomPopover
                  text="Projected sales for the upcoming month is computed using the average of the past 3 months sales. Subsequent projected sales are computed taking into account the projected sales of the past months."
                  iconSize="1.3rem"
                >
                  {""}
                </CustomPopover>
              </Group>
              <ProjectedSalesLineChart data={aggregatedAndProjectedSales} />
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
      aggregatedAndProjectedSales:
        salesDashboardData.charts["aggregatedAndProjectedSales"],
    },
  };
}
