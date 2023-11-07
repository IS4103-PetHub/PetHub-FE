import {
  Box,
  Button,
  Center,
  Chip,
  Container,
  Group,
  LoadingOverlay,
  SegmentedControl,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconChartBar, IconRefresh, IconReport } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatISODateTimeShort } from "shared-utils";
import { PageTitle, useLoadingOverlay } from "web-ui";
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
  allTimeTop5ByOrderCount: SalesDashboardServiceListing[];
  top5Within30DaysByOrderCount: SalesDashboardServiceListing[];
  allTimeTop5BySales: SalesDashboardServiceListing[];
  top5Within30DaysBySales: SalesDashboardServiceListing[];
  // Month, Sales
  monthlySales: [string, any][];
  // Month, Sales, Projected
  aggregatedAndProjectedSales: [string, any, any][];
}

export default function SalesDashboard({
  summary,
  allTimeTop5ByOrderCount,
  top5Within30DaysByOrderCount,
  allTimeTop5BySales,
  top5Within30DaysBySales,
  monthlySales,
  aggregatedAndProjectedSales,
}: SalesDashboardProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [selectedChipValue, setSelectedChipValue] =
    useState<string>("order-count");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("all-time");
  const [top5Title, setTop5Title] = useState<string>(
    "All Time Top 5 Service Listings by Order Count",
  );
  const [top5ServiceListings, settop5ServiceListings] = useState<
    SalesDashboardServiceListing[]
  >(allTimeTop5ByOrderCount);
  const [monthlySalesChartType, setMonthlySalesChartType] =
    useState("ColumnChart");
  const [updatedDate, setUpdatedDate] = useState<Date>(new Date());
  const { showOverlay, hideOverlay } = useLoadingOverlay();

  const projectedFirstMonth =
    aggregatedAndProjectedSales[aggregatedAndProjectedSales.length - 3][0];
  const projectedLastMonth =
    aggregatedAndProjectedSales[aggregatedAndProjectedSales.length - 1][0];

  const top5TitleMap = new Map([
    ["order-count all-time", "All Time Top 5 Service Listings by Order Count"],
    [
      "order-count last-30-days",
      " Top 5 Service Listings by Last 30 Days Order Count",
    ],
    [
      "sales-amount all-time",
      "All Time Top 5 Service Listings by Sales Amount",
    ],
    [
      "sales-amount last-30-days",
      "Top 5 Service Listings by Last 30 Days  Sales Amount",
    ],
  ]);

  // for filtering of top 5 service listings

  function getListingsByFilters() {
    // by order count
    if (selectedChipValue === "order-count") {
      if (selectedTimePeriod === "all-time") {
        return allTimeTop5ByOrderCount;
      }
      return top5Within30DaysByOrderCount;
    }
    aggregatedAndProjectedSales;
    // by sales
    if (selectedTimePeriod === "all-time") {
      return allTimeTop5BySales;
    }
    return top5Within30DaysBySales;
  }

  useEffect(() => {
    // set title
    const title = top5TitleMap.get(
      `${selectedChipValue} ${selectedTimePeriod}`,
    );
    setTop5Title(title);
    // set records
    settop5ServiceListings(getListingsByFilters());
  }, [selectedChipValue, selectedTimePeriod]);

  const handleRefresh = async () => {
    showOverlay();
    await router.replace(router.asPath);
    setUpdatedDate(new Date());
    hideOverlay();
  };

  return (
    <>
      <Head>
        <title>Business Sales Dashboard - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid p="lg" h="100%" w="100%" bg={theme.colors.gray[0]}>
        <Container fluid mb="xl">
          <Group position="apart" mb="xl">
            <Group>
              <PageTitle title="Business Sales Dashboard" />
              <Text
                size="sm"
                color="dimmed"
              >{`Last Updated: ${formatISODateTimeShort(
                updatedDate.toISOString(),
              )}`}</Text>
            </Group>
            <Button
              size="md"
              leftIcon={<IconRefresh />}
              className="gradient-hover"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Group>
          <Stack spacing={30}>
            <BusinessSalesSummarySection summary={summary} />
            <Box>
              <Group>
                <Text size="xl" fw={600} mb={-10}>
                  {top5Title}
                </Text>
              </Group>
              <Group position="apart" align="end">
                <Chip.Group
                  multiple={false}
                  value={selectedChipValue}
                  onChange={setSelectedChipValue}
                >
                  <Group position="left">
                    <Chip value="order-count" size="md">
                      By Order Count
                    </Chip>
                    <Chip value="sales-amount" size="md">
                      By Sales Amount
                    </Chip>
                  </Group>
                </Chip.Group>
                <Select
                  label="Temporal Period"
                  placeholder="Select period"
                  data={[
                    { value: "all-time", label: "All time" },
                    { value: "last-30-days", label: "Last 30 days" },
                  ]}
                  value={selectedTimePeriod}
                  onChange={setSelectedTimePeriod}
                />
              </Group>
              <TopServiceListingsTable records={top5ServiceListings} />
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
      allTimeTop5ByOrderCount:
        salesDashboardData.lists.byOrderCount["allTimeTop5ByOrders"],
      top5Within30DaysByOrderCount:
        salesDashboardData.lists.byOrderCount["top5Within30DaysByOrders"],
      allTimeTop5BySales:
        salesDashboardData.lists.bySaleAmount["allTimeTop5BySales"],
      top5Within30DaysBySales:
        salesDashboardData.lists.bySaleAmount["allTimeTop5BySales"],
      monthlySales: salesDashboardData.charts["monthlySales"],
      aggregatedAndProjectedSales:
        salesDashboardData.charts["aggregatedAndProjectedSales"],
    },
  };
}
