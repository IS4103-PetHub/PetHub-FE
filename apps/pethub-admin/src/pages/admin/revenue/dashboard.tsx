import { Button, Container, Group, useMantineTheme, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import Head from "next/head";
import { formatISODateTimeShort } from "shared-utils";
import { PageTitle } from "web-ui";
import api from "@/api/axiosConfig";
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
}

export default function RevenueTrackingDashboard() {
  const theme = useMantineTheme();
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
              {/* <Text
                size="sm"
                color="dimmed"
              >{`Last Updated: ${formatISODateTimeShort(
                updatedDate.toISOString()
              )}`}</Text> */}
            </Group>
            <Button
              size="md"
              leftIcon={<IconRefresh />}
              className="gradient-hover"
              // onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Group>
        </Container>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
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
      transactionsByCategory:
        dashboardData.charts.pieChart["transactionsByCategory"],
      commissionByCategory:
        dashboardData.charts.pieChart["commissionByCategory"],
    },
  };
}
