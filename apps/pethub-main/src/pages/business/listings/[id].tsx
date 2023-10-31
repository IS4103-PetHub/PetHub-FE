import {
  Accordion,
  Box,
  Button,
  Card,
  Center,
  CloseButton,
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
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  AccountStatusEnum,
  ServiceCategoryEnum,
  ServiceListing,
  downloadFile,
  extractFileName,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import PBCannotAccessMessage from "@/components/common/PBCannotAccessMessage";
import ServiceListingDetailsAccordionItem from "@/components/service-listing-management/ServiceListingDetailsAccordionItem";
import { useGetCalendarGroupByPBId } from "@/hooks/calendar-group";
import {
  useDeleteServiceListingById,
  useGetServiceListingById,
  useGetServiceListingByPetBusinessId,
  useGetServiceListingByPetBusinessIdAndAccountStatus,
  useUpdateServiceListing,
} from "@/hooks/service-listing";
import { PetBusiness, UpdateServiceListingPayload } from "@/types/types";
import { validateCGName, validateCGSettings } from "@/util";

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
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const serviceListingId = Number(router.query.id);

  const OPEN_FOREVER = ["details", "review"];

  const { data: serviceListings = [], refetch: refetchServiceListings } =
    useGetServiceListingByPetBusinessId(userId);

  const { data: serviceListing, refetch: refetchServiceListing } =
    useGetServiceListingById(serviceListingId);

  const { data: calendarGroups = [] } = useGetCalendarGroupByPBId(userId);

  console.log("serviceLising", serviceListing);

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

  const form = useForm({
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
        <Container mt="xl" mb="xl" size="70vw">
          {isLoading ? (
            <LoadingOverlay visible={isLoading} overlayBlur={1} />
          ) : (
            <>
              <Group position="apart">
                <PageTitle title={form.values.title} />
                <Box>
                  <LargeBackButton
                    text="Back to Service Listings"
                    onClick={async () => {
                      await refetchServiceListings();
                      router.push("/business/listings");
                    }}
                    size="sm"
                    mb="md"
                  />
                </Box>
              </Group>
              <Accordion
                multiple
                variant="filled"
                value={OPEN_FOREVER}
                onChange={() => {}}
                chevronSize={0}
                mt="md"
              >
                <ServiceListingDetailsAccordionItem
                  form={form}
                  serviceListing={serviceListing}
                  refetchServiceListing={refetchServiceListing}
                  refetchServiceListings={refetchServiceListings}
                  calendarGroups={calendarGroups}
                />
              </Accordion>
            </>
          )}
        </Container>
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
