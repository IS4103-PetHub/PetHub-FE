import { Container, Group, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AccountTypeEnum, BusinessApplicationStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";
import ApplicationStatusAlert from "@/components/pb-application/ApplicationStatusAlert";
import { useGetPetBusinessApplicationByPBId } from "@/hooks/pet-business-application";

interface DashboardProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function Dashboard({ userId, accountType }: DashboardProps) {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const { showOverlay, hideOverlay } = useLoadingOverlay();
  const router = useRouter();

  const {
    data: petBusinessApplication,
    refetch: refetchPetBusinessApplication,
  } = useGetPetBusinessApplicationByPBId(userId);

  useEffect(() => {
    hideOverlay(); // Hide the overlay that was triggered via a PB login
  }, []);

  useEffect(() => {
    if (!petBusinessApplication) {
      setApplicationStatus(BusinessApplicationStatusEnum.Notfound);
    } else {
      setApplicationStatus(petBusinessApplication.applicationStatus);
    }
  }, [petBusinessApplication]);

  return (
    <>
      <Head>
        <title>Dashboard - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
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

  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
