import {
  Card,
  Divider,
  Group,
  Text,
  useMantineTheme,
  Image,
  Badge,
  Box,
  Paper,
  Button,
} from "@mantine/core";
import {
  IconUserCircle,
  IconPhone,
  IconPawFilled,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";
import { formatISODateTimeShort, formatStringToLetterCase } from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditActionButton from "web-ui/shared/EditActionButton";
import { PetRequestTypeEnum } from "@/types/constants";
import { calculateAge } from "@/util";
import LostAndFoundPostModal from "./LostAndFoundPostModal";

interface PostCardProps {
  // destructure and flatten everything because of the masonry library
  id: number;
  title: string;
  description: string;
  requestType: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  petOwnerName: string;
  contactNumber: string;
  dateCreated: string;
  petName: string;
  petType: string;
  petDateOfBirth: string;
  attachmentURL: string;
  isResolved: boolean;
  userId: number;
  sessionUserId?: number;
  onDelete(id: number): void;
  onUpdate(id: number): void;
}

const PostCard = ({
  id,
  title,
  description,
  requestType,
  lastSeenDate,
  lastSeenLocation,
  petOwnerName,
  contactNumber,
  dateCreated,
  petName,
  petType,
  petDateOfBirth,
  attachmentURL,
  isResolved,
  userId,
  sessionUserId,
  onDelete,
  onUpdate,
}: PostCardProps) => {
  const theme = useMantineTheme();
  const hasImage = !!attachmentURL;

  function formatDateCreatedForDisplay() {
    const now = new Date();
    const dayDiff = dayjs(now).diff(dateCreated, "day");
    const hourDiff = dayjs(now).diff(dateCreated, "hour");
    const minDiff = dayjs(now).diff(dateCreated, "minute");

    if (minDiff < 1) {
      return "Just posted";
    }
    if (hourDiff < 1) {
      return `${minDiff} minute${minDiff > 1 ? "s" : ""} ago`;
    }
    if (dayDiff < 1) {
      return `${hourDiff} hour${hourDiff > 1 ? "s" : ""} ago`;
    }

    return formatISODateTimeShort(dateCreated);
  }

  return (
    <Card shadow="md" radius="md">
      <Card.Section>
        <Box sx={{ position: "relative" }}>
          <Badge
            radius="sm"
            size="lg"
            variant="light"
            sx={{
              position: "absolute",
              zIndex: 2,
              left: 10,
              top: 10,
              opacity: 0.95,
            }}
            color={
              isResolved
                ? "green"
                : requestType === PetRequestTypeEnum.FoundPet
                ? "indigo"
                : "red"
            }
          >
            {formatStringToLetterCase(requestType)}
            {isResolved && " (resolved) "}
          </Badge>
          {hasImage && <Image src={attachmentURL} />}
          <Badge
            radius="sm"
            size="md"
            variant="white"
            sx={{
              backgroundColor: theme.colors.gray[2],
              position: "absolute",
              zIndex: 2,
              right: 10,
              top: 10,
              opacity: 0.8,
            }}
          >
            {formatDateCreatedForDisplay()}
          </Badge>
        </Box>
      </Card.Section>

      <Text
        fw={600}
        size="lg"
        mb={5}
        mt={hasImage ? "sm" : 40}
        sx={{ lineHeight: 1.4 }}
      >
        {title}
      </Text>
      <Text fw={500} size="sm" mb={2}>
        Last seen:
      </Text>
      <Group position="apart">
        <Group spacing={5}>
          <IconCalendar color={theme.colors.gray[5]} size="1.25rem" />
          <Text size="sm">{formatISODateTimeShort(lastSeenDate)}</Text>
        </Group>
        <Group spacing={5}>
          <IconMapPin color={theme.colors.gray[5]} size="1.25rem" />
          <Text size="sm">{lastSeenLocation}</Text>
        </Group>
      </Group>

      <Divider mt="xs" mb="xs" />

      <Text sx={{ lineHeight: 1.4 }}>{description}</Text>
      {petName && (
        <Paper sx={{ backgroundColor: theme.colors.gray[1] }} p="xs" mt="xs">
          <Group>
            <IconPawFilled opacity={0.65} size="1.1rem" />
            <Text size="sm" fw={500} ml={-8}>
              {petName} | {formatStringToLetterCase(petType)}
              {petDateOfBirth && ` | ${calculateAge(petDateOfBirth)}`}
            </Text>
          </Group>
        </Paper>
      )}

      <Divider mt="md" mb="xs" />

      <Group position="apart">
        <Group spacing={5}>
          <IconUserCircle color={theme.colors.gray[5]} size="1.25rem" />
          <Text size="sm" color="dimmed">
            {petOwnerName}
          </Text>
        </Group>
        <Group spacing={5}>
          <IconPhone color={theme.colors.gray[5]} size="1.2rem" />
          <Text size="sm" color="dimmed">
            {contactNumber}
          </Text>
        </Group>
      </Group>

      {userId === sessionUserId && (
        <Group position="right" mt="md">
          <EditActionButton onClick={() => onUpdate(id)} />
          <DeleteActionButtonModal
            title={`Are you sure you want to delete this post?`}
            subtitle={`This action cannot be undone. This pet lost and found post titled "${title}" would be permanently deleted.`}
            onDelete={() => onDelete(id)}
          />
        </Group>
      )}
    </Card>
  );
};

export default PostCard;
