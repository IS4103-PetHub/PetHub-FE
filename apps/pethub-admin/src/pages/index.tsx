import { Box, Container, Stack, Text } from "@mantine/core";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { PageTitle } from "web-ui";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";
import api from "@/api/axiosConfig";
import ServiceListingCharts from "@/components/dashboard/serviceListingCharts";
import UserDemographic from "@/components/dashboard/userDemographic";

export default function Home({ userDemographic, serviceListingData }) {
  const { showOverlay, hideOverlay } = useLoadingOverlay();

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
      <main>
        <Container fluid>
          <Text color="dimmed" w="50vw" size="md">
            Admin Management Portal
          </Text>
          <PageTitle title="Admin Dashboard" />
          <Stack spacing={30}>
            <UserDemographic data={userDemographic} />
            <ServiceListingCharts data={serviceListingData} />
          </Stack>
        </Container>
      </main>
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
