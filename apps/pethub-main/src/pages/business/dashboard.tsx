import { Container, Group, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import ApplicationStatusAlert from "@/components/pb-application/ApplicationStatusAlert";
import { useGetPetBusinessApplicationByPBId } from "@/hooks/pet-business-application";
import {
  AccountTypeEnum,
  BusinessApplicationStatusEnum,
} from "@/types/constants";

interface DashboardProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function Dashboard({ userId, accountType }: DashboardProps) {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  const {
    data: petBusinessApplication,
    refetch: refetchPetBusinessApplication,
  } = useGetPetBusinessApplicationByPBId(userId);

  useEffect(() => {
    if (!petBusinessApplication) {
      setApplicationStatus(BusinessApplicationStatusEnum.Notfound);
    } else {
      setApplicationStatus(petBusinessApplication.applicationStatus);
    }
    setVisible(false);
  }, [petBusinessApplication]);

  useEffect(() => {
    // Show the overlay when route change starts
    const handleRouteChangeStart = () => {
      setVisible(true);
    };

    // Hide the overlay when route change is complete or encounters an error
    const handleRouteChangeEnd = () => {
      setVisible(false);
    };

    // Subscribe to route changes
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);

    // Unsubscribe from the events if the component is unmounted
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          loaderProps={{ color: "pink", type: "bars" }}
        />
        {applicationStatus !== BusinessApplicationStatusEnum.Approved && (
          <ApplicationStatusAlert
            forDashboard={true}
            applicationStatus={applicationStatus}
            remarks={
              petBusinessApplication && petBusinessApplication.adminRemarks
            }
          />
        )}
        <Group position="left">
          {applicationStatus === BusinessApplicationStatusEnum.Approved && (
            <PageTitle title="Dashboard" />
          )}
        </Group>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
