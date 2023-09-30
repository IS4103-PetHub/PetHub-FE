import { Container, Group } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { AccountTypeEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import MainCalendar from "@/components/calendargroup/MainCalendar";
import { useGetCalendarGroupByPBId } from "@/hooks/calendar-group";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetAllTags } from "@/hooks/tags";

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
}
export default function CalendarGroup({ userId, accountType }: MyAccountProps) {
  const router = useRouter();

  const { data: calendarGroup = [], refetch: refetchCalendarGroup } =
    useGetCalendarGroupByPBId(userId);

  const { data: petBusinessData } = useGetPetBusinessByIdAndAccountType(
    userId,
    accountType,
  );
  const { data: tags } = useGetAllTags();

  return (
    <>
      <Head>
        <title>Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <PageTitle title="Calendar Group Management" />
          <LargeCreateButton
            text="Create New Calendar Group"
            onClick={() => router.push("/business/calendargroup/create")}
          />
        </Group>
        {/* <MainCalendar
          calendarGroupings={calendarGroup}
          userId={userId}
          addresses={petBusinessData ? petBusinessData.businessAddresses : []}
          tags={tags}
        /> */}
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
