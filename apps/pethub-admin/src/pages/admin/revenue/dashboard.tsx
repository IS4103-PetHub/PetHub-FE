import {
  Button,
  Box,
  Container,
  Group,
  useMantineTheme,
  Text,
  Stack,
  Chip,
  Select,
  Grid,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconRefresh } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatISODateTimeShort, getErrorMessageProps } from "shared-utils";
import { PageTitle, useLoadingOverlay } from "web-ui";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import CategoryPieChart from "@/components/revenue-tracking/CategoryPieChart";
import RevenueTrackingSummarySection from "@/components/revenue-tracking/RevenueTrackingSummarySection";
import TopPetBusinessesTable from "@/components/revenue-tracking/TopPetBusinessesTable";
import TransactionsCommissionAreaChart from "@/components/revenue-tracking/TransactionsCommissionAreaChart";
import { PermissionsCodeEnum } from "@/types/constants";
import {
  RevenueDashboardPetBusiness,
  RevenueDashboardSummary,
} from "@/types/types";

interface RevenueTrackingDashboardProps {
  summary: RevenueDashboardSummary;
  allTimeTop5PetBusinessByOrderCount: RevenueDashboardPetBusiness[];
  top5PetBusinessWithin30DaysByOrders: RevenueDashboardPetBusiness[];
  allTimeTop5PetBusinessBySales: RevenueDashboardPetBusiness[];
  top5PetBusinessWithin30DaysBySales: RevenueDashboardPetBusiness[];
  // Month, Transactions, Commission Earned
  monthlyData: [string, any, any][];
  // Business Type, Commission Earned
  commissionByBusinessType: [string, any][];
  // Category, Commission Earned
  commissionByCategory: [string, any][];
  canRead: boolean;
}

export default function RevenueTrackingDashboard({
  summary,
  allTimeTop5PetBusinessByOrderCount,
  top5PetBusinessWithin30DaysByOrders,
  allTimeTop5PetBusinessBySales,
  top5PetBusinessWithin30DaysBySales,
  monthlyData,
  commissionByBusinessType,
  commissionByCategory,
  canRead,
}: RevenueTrackingDashboardProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [updatedDate, setUpdatedDate] = useState<Date>(new Date());
  const [isPayingOut, setIsPayingOut] = useToggle();
  const { showOverlay, hideOverlay } = useLoadingOverlay();

  const [selectedChipValue, setSelectedChipValue] =
    useState<string>("order-count");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("all-time");
  const [top5PetBusinesses, setTop5PetBusinesses] = useState<
    RevenueDashboardPetBusiness[]
  >(allTimeTop5PetBusinessByOrderCount);
  const top5TitleMap = new Map([
    ["order-count all-time", "All Time Top 5 Pet Businesses by Order Count"],
    [
      "order-count last-30-days",
      " Top 5 Pet Businesses by Last 30 Days Order Count",
    ],
    ["sales-amount all-time", "All Time Top 5 Pet Businesses by Sales Amount"],
    [
      "sales-amount last-30-days",
      "Top 5 Pet Businesses by Last 30 Days  Sales Amount",
    ],
  ]);
  const [top5Title, setTop5Title] = useState<string>(
    top5TitleMap.get("order-count all-time"),
  );

  const handleRefresh = async () => {
    showOverlay();
    await router.replace(router.asPath);
    setUpdatedDate(new Date());
    hideOverlay();
  };

  const handleManualPayout = async () => {
    setIsPayingOut(true);
    try {
      await api.patch(`/order-items/payout`);
      // payout done
      setIsPayingOut(false);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Processing Payout", error),
      });
    }
  };

  function getPetBusinessesByFilters() {
    // by order count
    if (selectedChipValue === "order-count") {
      if (selectedTimePeriod === "all-time") {
        return allTimeTop5PetBusinessByOrderCount;
      }
      return top5PetBusinessWithin30DaysByOrders;
    }
    // by sales
    if (selectedTimePeriod === "all-time") {
      return allTimeTop5PetBusinessBySales;
    }
    return top5PetBusinessWithin30DaysBySales;
  }

  useEffect(() => {
    // set title
    const title = top5TitleMap.get(
      `${selectedChipValue} ${selectedTimePeriod}`,
    );
    setTop5Title(title);
    // set records
    setTop5PetBusinesses(getPetBusinessesByFilters());
  }, [selectedChipValue, selectedTimePeriod]);

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>Revenue Dashboard - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid p="lg" h="100%" w="100%" bg={theme.colors.gray[0]}>
        <Container fluid mb="xl">
          <Group position="apart" mb="xl">
            <Group>
              <PageTitle title="Revenue Tracking Dashboard" />
              <Text
                size="sm"
                color="dimmed"
              >{`Last Updated: ${formatISODateTimeShort(
                updatedDate.toISOString(),
              )}`}</Text>
            </Group>
            <Group>
              <Button
                size="md"
                onClick={handleManualPayout}
                color="pink"
                loading={isPayingOut}
              >
                Trigger Manual Payout
              </Button>
              <Button
                size="md"
                leftIcon={<IconRefresh />}
                className="gradient-hover"
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </Group>
          </Group>
          <Stack spacing={30}>
            <RevenueTrackingSummarySection summary={summary} />
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
              <TopPetBusinessesTable records={top5PetBusinesses} />
            </Box>
            <Box>
              <Group position="apart" mb="md">
                <Text size="xl" fw={600}>
                  Monthly Transactions and Commission Earned for Last 12 Months
                  ($ / month)
                </Text>
              </Group>
              <TransactionsCommissionAreaChart data={monthlyData} />
            </Box>
            <Grid>
              <Grid.Col span={6}>
                <Text size="xl" fw={600} mb="md">
                  All Time Commission Earned by Pet Business Type ($)
                </Text>
                <CategoryPieChart data={commissionByBusinessType} />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xl" fw={600} mb="md">
                  All Time Commission Earned by Service Listing Category ($)
                </Text>
                <CategoryPieChart data={commissionByCategory} />
              </Grid.Col>
            </Grid>
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
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;

  if (
    !permissions
      .map((permission) => permission.code)
      .includes(PermissionsCodeEnum.ReadOrderItems)
  ) {
    return { props: { canRead: false } };
  }

  const dashboardData = await (
    await api.get(`/chart/revenue-tracking/data`)
  ).data;

  return {
    props: {
      summary: dashboardData.summary,
      allTimeTop5PetBusinessByOrderCount:
        dashboardData.lists.byOrderCount["allTimeTop5PetBusinessByOrders"],
      top5PetBusinessWithin30DaysByOrders:
        dashboardData.lists.byOrderCount["top5PetBusinessWithin30DaysByOrders"],
      allTimeTop5PetBusinessBySales:
        dashboardData.lists.bySaleAmount["allTimeTop5PetBusinessBySales"],
      top5PetBusinessWithin30DaysBySales:
        dashboardData.lists.bySaleAmount["top5PetBusinessWithin30DaysBySales"],
      monthlyData: dashboardData.charts.areaChart["monthlyData"],
      commissionByBusinessType:
        dashboardData.charts.pieChart["commissionByBusinessType"],
      commissionByCategory:
        dashboardData.charts.pieChart["commissionByCategory"],
      canRead: true,
    },
  };
}
