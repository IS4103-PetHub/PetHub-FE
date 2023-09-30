import { Button, Container, Group } from "@mantine/core";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { AccountTypeEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import MainCalendar from "@/components/calendarGroup/MainCalendar";
import { useGetCalendarGroupByPBId } from "@/hooks/calendar-group";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetAllTags } from "@/hooks/tags";

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
}
export default function CalendarGroup({ userId, accountType }: MyAccountProps) {
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
          <Button>Create</Button>
        </Group>

        <MainCalendar
          calendarGroupings={calendarGroup}
          userId={userId}
          addresses={petBusinessData ? petBusinessData.businessAddresses : []}
          tags={tags}
        />
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