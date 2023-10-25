import {
  useMantineTheme,
  Text,
  Divider,
  Card,
  Button,
  Group,
  Box,
  Badge,
  Checkbox,
  Grid,
  Image,
  Stack,
  CopyButton,
  Center,
  Alert,
  LoadingOverlay,
  Avatar,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCopy,
  IconFlag,
  IconMapPin,
  IconPaw,
  IconThumbUp,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  Invoice,
  OrderItem,
  OrderItemStatusEnum,
  Review,
  ServiceListing,
  convertMinsToDurationString,
  formatISODateLong,
  formatISODateOnly,
  formatISODateTimeShort,
  formatISODayDateTime,
} from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import { useCartOperations } from "@/hooks/cart";
import { Booking, CartItem } from "@/types/types";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const flaggedPlaceholder = false;

  return (
    <Card withBorder radius="md" shadow="xs" mb="md">
      <Grid columns={12}>
        <Grid.Col span={1}>
          <Avatar radius="xl" />
        </Grid.Col>

        <Grid.Col span={9}>
          <Box>
            <Text size="xs" fw={500}>
              username
            </Text>
            <Text lineClamp={2} size="xs" color="dimmed">
              Reviewed on {formatISODateTimeShort(review.dateCreated)}
            </Text>
          </Box>
        </Grid.Col>

        <Grid.Col
          span={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Center>
            <ActionIcon onClick={() => alert("Mark as helpful")}>
              <IconThumbUp
                size="1rem"
                {...(flaggedPlaceholder ? { filled: "gray" } : {})}
              />
            </ActionIcon>
            <ActionIcon onClick={() => alert("Open report modal")}>
              <IconFlag
                size="1rem"
                {...(flaggedPlaceholder ? { filled: "gray" } : {})}
              />
            </ActionIcon>
          </Center>
        </Grid.Col>

        <Grid.Col span={12}>
          <Box ml="md" mr="md">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarRating
                value={review.rating}
                viewOnly
                allowFractions
                iconSize="1.25rem"
              />
              <Text fw={600} size={16} ml={3}>
                {review.title}
              </Text>
            </Box>
            <Text lineClamp={2} size="xs" mt="xs">
              {review.comment}
            </Text>
          </Box>
        </Grid.Col>

        <Grid.Col span={12} mah={100}>
          {review?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={review.attachmentURLs[0]}
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
            />
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ReviewCard;
