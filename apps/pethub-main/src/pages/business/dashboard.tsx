import { Container, Group } from "@mantine/core";
import dayjs from "dayjs";
import Head from "next/head";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  AccountStatusEnum,
  AccountTypeEnum,
  BusinessApplicationStatusEnum,
} from "shared-utils";
import { PageTitle } from "web-ui";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";
import api from "@/api/axiosConfig";
import PBUpcomingAppointments from "@/components/dashboard/PBUpcomingAppointments";
import ApplicationStatusAlert from "@/components/pb-application/ApplicationStatusAlert";
import { useGetPetBusinessApplicationByPBId } from "@/hooks/pet-business-application";
import { Booking } from "@/types/types";

interface DashboardProps {
  userId: number;
  accountType: AccountTypeEnum;
  upcomingBookings: Booking[];
}

const DAYS_AHEAD = 3;

export default function Dashboard({
  userId,
  accountType,
  upcomingBookings,
}: DashboardProps) {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const { showOverlay, hideOverlay } = useLoadingOverlay();

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
      <Container fluid m="lg">
        {applicationStatus !== BusinessApplicationStatusEnum.Approved ? (
          // PB application is not yet approved
          <ApplicationStatusAlert
            forDashboard={true}
            applicationStatus={applicationStatus}
            remarks={
              petBusinessApplication && petBusinessApplication.adminRemarks
            }
          />
        ) : (
          // PB application approved
          <>
            <Group position="left">
              <PageTitle title="Dashboard" />
            </Group>
            <PBUpcomingAppointments
              bookings={upcomingBookings}
              daysAhead={DAYS_AHEAD}
            />
          </>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  const accountStatus = session.user["accountStatus"];
  if (accountStatus === AccountStatusEnum.Pending) {
    return { props: { userId, accountType } };
  }

  // get upcoming bookings
  const startTime = new Date().toISOString();
  const endTime = dayjs(startTime)
    .add(DAYS_AHEAD, "day")
    .startOf("day")
    .toISOString();
  const response = api.get(`/bookings/pet-business/${userId}`, {
    params: { startTime, endTime },
  });
  const upcomingBookings: Booking[] = (await response).data;

  return { props: { userId, accountType, upcomingBookings } };
}
