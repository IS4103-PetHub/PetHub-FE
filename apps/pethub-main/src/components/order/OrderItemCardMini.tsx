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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingStore,
  IconCopy,
  IconMapPin,
  IconPaw,
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
import SelectTimeslotModal from "../appointment-booking/SelectTimeslotModal";
import CreateReviewModal from "../review/ReviewModal";
import OrderItemBadge from "./OrderItemBadge";
import OrderItemPopover from "./OrderItemPopover";

interface OrderItemCardMiniProps {
  orderItem: OrderItem;
  viewOnly?: boolean;
}

const OrderItemCardMini = ({ orderItem, viewOnly }: OrderItemCardMiniProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Box m="lg">
      <Group position="apart" mb={5} mt={-5}>
        {!viewOnly ? (
          <Center>
            <Text fw={500} mr={2} size="sm">
              {orderItem?.serviceListing?.petBusiness?.companyName}
            </Text>

            <Button
              size="xs"
              variant="subtle"
              leftIcon={
                <IconBuildingStore
                  size="1rem"
                  style={{ marginRight: "-5px" }}
                />
              }
              onClick={() =>
                router.push(
                  "/pet-businesses/" + orderItem?.serviceListing?.petBusinessId,
                )
              }
            >
              Visit Shop
            </Button>
          </Center>
        ) : (
          <div>{}</div>
        )}
        <Center>
          <Box>
            <Badge radius="xl" c="dark" sx={{ fontWeight: 600 }} variant="dot">
              Ordered on: {formatISODayDateTime(orderItem?.invoice?.createdAt)}
            </Badge>
          </Box>
        </Center>
      </Group>
      <Grid columns={24}>
        <Grid.Col span={4} mih={125}>
          {orderItem?.serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={orderItem?.serviceListing?.attachmentURLs[0]}
              fit="contain"
              w="auto"
              alt="Order Item Photo"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              fit="contain"
              w="auto"
              alt="Order Item Photo"
            />
          )}
        </Grid.Col>

        <Grid.Col span={16}>
          <Box>
            {!viewOnly ? (
              <Link href={`/service-listings/${orderItem?.serviceListingId}`}>
                <Text fw={600} size={16}>
                  {orderItem?.serviceListing?.title}
                </Text>
              </Link>
            ) : (
              <Text fw={600} size={16}>
                {orderItem?.serviceListing?.title}
              </Text>
            )}
            <Text lineClamp={2} size="xs">
              {orderItem?.serviceListing?.description}
            </Text>
            {orderItem?.serviceListing?.requiresBooking &&
              orderItem?.serviceListing?.duration && (
                <Badge variant="dot" radius="xs">
                  Duration:{" "}
                  {convertMinsToDurationString(
                    orderItem?.serviceListing?.duration,
                  )}
                </Badge>
              )}
          </Box>
        </Grid.Col>

        <Grid.Col
          span={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text size="sm" fw={500} color="dimmed">
            ${formatNumber2Decimals(orderItem?.itemPrice)}
          </Text>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default OrderItemCardMini;
