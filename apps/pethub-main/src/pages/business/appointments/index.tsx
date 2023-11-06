import { Container, Group } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { AccountStatusEnum, AccountTypeEnum } from "shared-utils";
import { PageTitle, useLoadingOverlay } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import api from "@/api/axiosConfig";
import MainCalendar from "@/components/calendarGroup/MainCalendar";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import { useGetCalendarGroupByPBId } from "@/hooks/calendar-group";
import { useGetPetBusinessByIdAndAccountType } from "@/hooks/pet-business";
import { useGetAllTags } from "@/hooks/tags";
import { PetBusiness } from "@/types/types";

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
  canView: boolean;
}
export default function CalendarGroup({
  userId,
  accountType,
  canView,
}: MyAccountProps) {
  const router = useRouter();
  const { hideOverlay } = useLoadingOverlay();

  const { data: calendarGroup = [], refetch: refetchCalendarGroup } =
    useGetCalendarGroupByPBId(userId);

  const { data: petBusinessData } = useGetPetBusinessByIdAndAccountType(
    userId,
    accountType,
  );
  const { data: tags } = useGetAllTags();

  useEffect(() => {
    hideOverlay(); // Hide the overlay that was triggered via a PB login in the event of a direct page login
  }, []);

  return (
    <>
      <Head>
        <title>Appointments - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!canView ? (
        <PBCannotAccessMessage />
      ) : (
        <Container fluid>
          <Group position="apart">
            <PageTitle title="Appointment Management" />
            <LargeCreateButton
              text="Create Calendar Group"
              onClick={() => router.push("/business/calendar-groups/create")}
            />
          </Group>
          <MainCalendar
            calendarGroupings={calendarGroup}
            userId={userId}
            addresses={petBusinessData ? petBusinessData.businessAddresses : []}
            tags={tags}
          />
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];
  const accountStatus = session.user["accountStatus"];
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { userId, accountType, canView } };
}
