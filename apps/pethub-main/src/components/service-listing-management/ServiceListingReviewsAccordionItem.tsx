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
import { useDisclosure, useToggle } from "@mantine/hooks";
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
  Review,
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
import ReviewFiltersGroup from "./ReviewFiltersGroup";
import ServiceReviewsTable from "./ServiceReviewsTable";

interface ServiceListingReviewsAccordionItemProps {
  serviceListing: ServiceListing;
  refetchServiceListing: () => Promise<any>;
}

const ServiceListingReviewsAccordionItem = ({
  serviceListing,
  refetchServiceListing,
}: ServiceListingReviewsAccordionItemProps) => {
  const [page, setPage] = useState<number>(1);
  const [filteredReviews, setFilteredReviews] = useState(
    serviceListing?.reviews,
  );

  return (
    <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={10} mt={20}>
      <Group position="apart" mt={5}>
        <Text size="xl">
          <b>Reviews ({serviceListing?.reviews?.length})</b>
        </Text>
        <Button>Toggle statistics</Button>
      </Group>
      <Divider mt="lg" mb="lg" />
      <ReviewFiltersGroup
        reviews={serviceListing?.reviews}
        setFilteredReviews={setFilteredReviews}
      />
      <ServiceReviewsTable
        records={filteredReviews}
        page={page}
        onPageChange={setPage}
        refetch={refetchServiceListing}
      />
    </Accordion.Item>
  );
};

export default ServiceListingReviewsAccordionItem;
