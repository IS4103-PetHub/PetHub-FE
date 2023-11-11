import {
  Accordion,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconFileDownload,
  IconPackage,
  IconCalendar,
  IconUserCircle,
  IconNotes,
  IconGiftCard,
  IconCheck,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import {
  OrderItem,
  OrderItemStatusEnum,
  PLATFORM_FEE_PERCENT,
  Pet,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import { PageTitle } from "../PageTitle";

interface PublishedArticleViewProps {
  title: string;
  content: string;
  coverImage?: string;
}

const PublishedArticleView = ({
  title,
  content,
  coverImage,
}: PublishedArticleViewProps) => {
  const theme = useMantineTheme();

  return (
    <>
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle title={`${title}`} />
          Right side
        </Group>
        <Group>Article content</Group>
      </Container>
    </>
  );
};

export default PublishedArticleView;
