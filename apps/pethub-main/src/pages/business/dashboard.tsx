import { Container, Group } from "@mantine/core";
import Head from "next/head";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import ApplicationStatusAlert from "@/components/pbapplication/ApplicationStatusAlert";
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

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
