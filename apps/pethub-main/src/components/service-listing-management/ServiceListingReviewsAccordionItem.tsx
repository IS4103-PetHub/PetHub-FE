import {
  TextInput,
  Group,
  Select,
  NumberInput,
  FileInput,
  Image,
  Stack,
  Textarea,
  Card,
  CloseButton,
  Autocomplete,
  Checkbox,
  Accordion,
  Center,
  Box,
  Text,
  Button,
  MultiSelect,
  Grid,
  Divider,
  rem,
  Badge,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconCircleX,
  IconListDetails,
  IconPhotoPlus,
  IconUserExclamation,
  IconX,
} from "@tabler/icons-react";
import { IconCalendarTime } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { set } from "lodash";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Address,
  CalendarGroup,
  ServiceCategoryEnum,
  ServiceListing,
  Tag,
  downloadFile,
  extractFileName,
  formatISODateLong,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import LargeEditButton from "web-ui/shared/LargeEditButton";
import LargeSaveButton from "web-ui/shared/LargeSaveButton";
import {
  useCreateServiceListing,
  useDeleteServiceListingById,
  useUpdateServiceListing,
} from "@/hooks/service-listing";
import {
  CreateServiceListingPayload,
  UpdateServiceListingPayload,
} from "@/types/types";
import ImageCarousel from "../common/file/ImageCarousel";

interface ServiceListingReviewsAccordionItemProps {
  serviceListing: ServiceListing;
  refetchServiceListings: () => Promise<any>;
  refetchServiceListing: () => Promise<any>;
}

const ServiceListingReviewsAccordionItem = ({
  serviceListing,
  refetchServiceListing,
  refetchServiceListings,
}: ServiceListingReviewsAccordionItemProps) => {
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isEditingDisabled, setIsEditingDisabled] = useState(true);

  const [showFullDescription, toggleShowFullDescription] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  console.log("servicelisting", serviceListing);

  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const handleDeleteServiceListing = async (id: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(id);
      notifications.show({
        title: "Calendar Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Service listing successfully deleted`,
      });
      await refetchServiceListings();
      router.push("/business/listings");
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

  const updateServiceListingMutation = useUpdateServiceListing();
  const handleUpdateServiceListing = async (
    payload: UpdateServiceListingPayload,
  ) => {
    try {
      await updateServiceListingMutation.mutateAsync(payload);
      notifications.show({
        title: "Service Listing Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Service listing successfully updated`,
      });
      await refetchServiceListing();
      setIsEditingDisabled(true);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Updating Service Listing", error),
      });
    }
  };

  // type formValues = typeof form.values;
  // async function handleSubmit(values: formValues) {
  //   const payload: UpdateServiceListingPayload = {
  //     serviceListingId: values.serviceListingId,
  //     title: values.title,
  //     description: values.description,
  //     category: values.category as ServiceCategoryEnum,
  //     basePrice: values.basePrice,
  //     tagIds: values.tags.map((tagId) => parseInt(tagId)),
  //     files: values.files,
  //     addressIds: values.addresses,
  //     calendarGroupId: values.calendarGroupId
  //       ? parseInt(values.calendarGroupId)
  //       : undefined,
  //     duration: values.duration,
  //     requiresBooking: values.requiresBooking,
  //     defaultExpiryDays: values.defaultExpiryDays,
  //     lastPossibleDate: values.lastPossibleDate,
  //   };
  //   await handleUpdateServiceListing(payload);
  // }

  return (
    <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={10} mt={20}>
      <Group position="apart" mt={5}>
        <Text size="xl">
          <b>Reviews</b>
        </Text>
      </Group>
      Content here
    </Accordion.Item>
  );
};

export default ServiceListingReviewsAccordionItem;
