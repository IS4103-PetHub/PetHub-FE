import {
  Accordion,
  Box,
  Button,
  Container,
  FileInput,
  Group,
  Image,
  LoadingOverlay,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { AccountStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import ServiceListingDetailsAccordionItem from "@/components/service-listing-management/ServiceListingDetailsAccordionItem";
import ServiceListingReviewsAccordionItem from "@/components/service-listing-management/ServiceListingReviewsAccordionItem";
import ServiceListingStatsAccordionItem from "@/components/service-listing-management/ServiceListingStatsAccordionItem";
import { useGetCalendarGroupByPBId } from "@/hooks/calendar-group";
import { useGetReviewStatsForServiceListing } from "@/hooks/review";
import {
  useGetServiceListingById,
  useGetServiceListingByPetBusinessId,
} from "@/hooks/service-listing";
import { useGetAllTags } from "@/hooks/tags";
import { PetBusiness, UpdateServiceListingPayload } from "@/types/types";

interface ViewServiceListingProps {
  userId: number;
  canView: boolean;
}

export default function ViewServiceListing({
  userId,
  canView,
}: ViewServiceListingProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const serviceListingId = Number(router.query.id);

  const OPEN_FOREVER = ["details", "review"];

  // Used to refetch service listings upon backward navigation
  const { data: serviceListings = [], refetch: refetchServiceListings } =
    useGetServiceListingByPetBusinessId(userId);

  // Fetch service listing
  const { data: serviceListing, refetch: refetchServiceListing } =
    useGetServiceListingById(serviceListingId);

  // Fetch all calendar groups for this business
  const { data: calendarGroups = [] } = useGetCalendarGroupByPBId(userId);

  // Fetch all available tags
  const { data: tags } = useGetAllTags();

  // Fetch review stats data
  const { data: reviewStats } = useGetReviewStatsForServiceListing(
    serviceListing?.serviceListingId,
  );

  const initialValues = {
    serviceListingId: null,
    title: "",
    description: "",
    category: "",
    basePrice: 0.0,
    addresses: [],
    files: [],
    tags: [],
    confirmation: false,
    calendarGroupId: "",
    duration: null,
    requiresBooking: false,
    defaultExpiryDays: undefined,
    lastPossibleDate: null,
  };

  const serviceListingForm = useForm({
    initialValues: initialValues,
    validate: {
      title: (value) => {
        const minLength = 1;
        const maxLength = 64;
        if (!value) return "Title is mandatory.";
        if (value.length < minLength || value.length > maxLength) {
          return `Title must be between ${minLength} and ${maxLength} characters.`;
        }
      },
      description: isNotEmpty("Description is mandatory."),
      category: isNotEmpty("Category is mandatory."),
      basePrice: (value) => {
        if (value.toString() == "") return "Price must be a valid number.";
        if (value === null || value === undefined) return "Price is mandatory.";
        else if (value < 0)
          return "Price must be a positive number with two decimal places.";
      },
      files: (value) => {
        if (value.length > 6) {
          notifications.show({
            title: "Error Updating Service Listing",
            color: "red",
            icon: <IconX />,
            message: "A maximum of 6 images can be uploaded.",
          });
          return (
            <div style={{ color: "red" }}>Maximum of 6 images allowed.</div>
          );
        }
        return null;
      },
      defaultExpiryDays: isNotEmpty("Default Expiry Days is required"),
    },
  });

  if (!serviceListingId || !serviceListing) {
    return null;
  }

  return (
    <>
      <Head>
        <title>View Calendar Group - PetHub Business</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!canView ? (
        <PBCannotAccessMessage />
      ) : (
        <>
          <LargeBackButton
            text="Back to Service Listings"
            onClick={async () => {
              await refetchServiceListings();
              router.push("/business/listings");
            }}
            size="sm"
          />
          <Container mt="xl" mb="xl" size="70vw">
            {isLoading ? (
              <LoadingOverlay visible={isLoading} overlayBlur={1} />
            ) : (
              <>
                <PageTitle title={serviceListing?.title} />
                <Accordion
                  multiple
                  variant="filled"
                  value={OPEN_FOREVER}
                  onChange={() => {}}
                  chevronSize={0}
                  mt="md"
                >
                  <ServiceListingDetailsAccordionItem
                    form={serviceListingForm}
                    serviceListing={serviceListing}
                    refetchServiceListing={refetchServiceListing}
                    refetchServiceListings={refetchServiceListings}
                    calendarGroups={calendarGroups}
                    tags={tags}
                  />

                  <ServiceListingReviewsAccordionItem
                    serviceListing={serviceListing}
                    refetchServiceListing={refetchServiceListing}
                  />

                  <ServiceListingStatsAccordionItem reviewStats={reviewStats} />
                </Accordion>
              </>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountStatus = session.user["accountStatus"];
  const petBusiness = (await (
    await api.get(`/users/pet-businesses/${userId}`)
  ).data) as PetBusiness;

  const canView =
    accountStatus !== AccountStatusEnum.Pending &&
    petBusiness.petBusinessApplication;

  return { props: { userId, canView } };
}
