import { Box, Container, Stack, Text, useMantineTheme } from "@mantine/core";
import Head from "next/head";
import { useEffect } from "react";
import { PageTitle } from "web-ui";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";
import api from "@/api/axiosConfig";
import ServiceListingCharts from "@/components/dashboard/ServiceListingCharts";
import UserDemographic from "@/components/dashboard/UserDemographic";

export default function Home({ userDemographic, serviceListingData }) {
  const { showOverlay, hideOverlay } = useLoadingOverlay();
  const theme = useMantineTheme();

  useEffect(() => {
    hideOverlay(); // Hide the overlay that was triggered via a login
  }, []);

  return (
    <>
      <Head>
        <title>Admin Portal - PetHub</title>
        <meta name="description" content="Admin portal for PetHub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container fluid p="lg" h="100%" w="100%" bg={theme.colors.gray[0]}>
        <Container fluid>
          <Text color="dimmed" w="50vw" size="md">
            Admin Management Portal
          </Text>
          <PageTitle title="Admin Dashboard" />
          <Stack spacing={30} mt="xs">
            <UserDemographic data={userDemographic} />
            <ServiceListingCharts data={serviceListingData} />
          </Stack>
        </Container>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const adminDashboardData = await (
    await api.get(`/chart/admin-dashboard`)
  ).data;
  return {
    props: {
      userDemographic: adminDashboardData.userDemographic,
      serviceListingData: adminDashboardData.serviceListingData,
    },
  };
}
