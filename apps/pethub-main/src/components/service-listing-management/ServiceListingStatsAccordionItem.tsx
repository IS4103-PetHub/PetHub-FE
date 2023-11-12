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
import { IconChartBar } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Address,
  CalendarGroup,
  Review,
  ReviewStatsResponse,
  ServiceCategoryEnum,
  ServiceListing,
} from "shared-utils";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import ReviewStatisticsGroup from "./ReviewStatisticsGroup";

interface ServiceListingStatsAccordionItemProps {
  reviewStats: ReviewStatsResponse;
}

const ServiceListingStatsAccordionItem = ({
  reviewStats,
}: ServiceListingStatsAccordionItemProps) => {
  const [areStatsHidden, toggleStatsVisibility] = useToggle();

  return (
    <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={20} mt={20}>
      <Group position="apart" mt={5}>
        <Text size="xl">
          <b>Review Statistics (Past 6 months)</b>
        </Text>
        {reviewStats && (
          <Button
            onClick={() => toggleStatsVisibility()}
            leftIcon={<IconChartBar size="1rem" />}
            variant="gradient"
          >
            {areStatsHidden ? "Show" : "Hide"}
          </Button>
        )}
      </Group>
      <Divider mt="lg" mb="lg" />

      {!areStatsHidden && reviewStats ? (
        <ReviewStatisticsGroup reviewStats={reviewStats} />
      ) : !reviewStats ? (
        <Text color="dimmed" size="sm">
          There are no reviews for this service listing in the past 6 months.
        </Text>
      ) : (
        <Text color="dimmed" size="sm">
          Review statistics are currently toggled to be hidden.
        </Text>
      )}
    </Accordion.Item>
  );
};

export default ServiceListingStatsAccordionItem;
