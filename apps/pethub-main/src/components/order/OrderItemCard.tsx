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
import OrderItemBadge from "./OrderItemBadge";
import OrderItemPopover from "./OrderItemPopover";

interface OrderItemCardProps {
  userId: number;
  orderItemId: number;
  invoiceId: number;
  paymentId: string;
  price: number;
  expiryDate: string;
  voucherCode: string;
  serviceListing: ServiceListing;
  status: string;
  createdAt: string;
}

const OrderItemCard = ({
  userId,
  orderItemId,
  invoiceId,
  paymentId,
  expiryDate,
  price,
  voucherCode,
  serviceListing,
  status,
  createdAt,
}: OrderItemCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { addItemToCart } = useCartOperations(userId);

  function triggerNotImplementedNotification() {
    notifications.show({
      title: "Not Implemented",
      color: "orange",
      message: "This function will be implemented in SR4",
    });
  }

  async function buyAgainHandler() {
    await addItemToCart(
      {
        serviceListing: serviceListing,
        ...(serviceListing.calendarGroupId ? {} : { quantity: 1 }),
        isSelected: true,
      } as CartItem,
      1,
    );
    notifications.show({
      title: "Added to cart",
      color: "green",
      message: "Item has been added to cart",
    });
    router.push("/customer/cart");
  }

  function bookNowHandler() {
    open();
  }

  const orderItemFooterGroup = (
    <>
      {status === OrderItemStatusEnum.PendingBooking && (
        <>
          <Button
            color="red"
            variant="light"
            size="xs"
            miw={90}
            mr={-5}
            onClick={triggerNotImplementedNotification}
          >
            Cancel
          </Button>
          <Button miw={90} size="xs" mr={-10} onClick={bookNowHandler}>
            Book now
          </Button>
          <OrderItemPopover
            text={`Make your booking and redeem your voucher before the end of the validity period on ${formatISODayDateTime(
              expiryDate,
            )}`}
          />
        </>
      )}
      {status === OrderItemStatusEnum.PendingFulfillment && (
        <>
          <OrderItemPopover
            text={`Redeem your voucher before the end of the validity period on ${formatISODayDateTime(
              expiryDate,
            )}`}
          />
          <Center>
            <Text size="xs" fw={500} ml={-15}>
              Voucher Code:
            </Text>
            &nbsp;
            <Badge radius="xs" c="indigo" p={2} variant="">
              {voucherCode}
            </Badge>
            <CopyButton value={voucherCode} timeout={3000}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "teal" : "dark"}
                  onClick={copy}
                  leftIcon={
                    <IconCopy size="1rem" style={{ marginRight: -5 }} />
                  }
                  size="xs"
                  variant="subtle"
                  compact
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Center>
        </>
      )}
      {/* In the future, review should be changed to "View review" if already reviewed */}
      {(status === OrderItemStatusEnum.Fulfilled ||
        status === OrderItemStatusEnum.PaidOut) && (
        <>
          <Button
            variant="light"
            size="xs"
            miw={90}
            mr={-5}
            onClick={triggerNotImplementedNotification}
          >
            Review
          </Button>
          <Button size="xs" miw={90} onClick={buyAgainHandler}>
            Buy again
          </Button>
        </>
      )}
      {status === OrderItemStatusEnum.Expired && (
        <>
          <Text size="xs" fw={500} color="red">
            You did not redeem your voucher before the end of the validity
            period on {formatISODayDateTime(expiryDate)}
          </Text>
        </>
      )}
      {status === OrderItemStatusEnum.Refunded && (
        <>
          <Text size="xs" fw={500} color="orange">
            The amount of ${formatNumber2Decimals(price)} has been refunded to
            your original payment method
          </Text>
        </>
      )}
    </>
  );

  return (
    <Card withBorder mah={230} mih={225} radius="xs" shadow="xs">
      <Group position="apart" mb={5} mt={-5}>
        <Center>
          <Text fw={500} mr={2} size="sm">
            {serviceListing?.petBusiness?.companyName}
          </Text>
          <Button
            size="xs"
            variant="subtle"
            leftIcon={
              <IconBuildingStore size="1rem" style={{ marginRight: "-5px" }} />
            }
            onClick={() =>
              router.push("/pet-businesses/" + serviceListing?.petBusinessId)
            }
          >
            Visit Shop
          </Button>
        </Center>
        <Center>
          <Text size="xs" mr="md" fw={500} mt={3}>
            {formatISODateTimeShort(createdAt)}
          </Text>
          <Box>
            <Badge mr="md" radius="xl" c="dark" sx={{ fontWeight: 600 }}>
              Item ID: {orderItemId}
            </Badge>
            <OrderItemBadge text={status} />
          </Box>
        </Center>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[1],
          },
        }}
        onClick={() => router.push(`/customer/orders/${orderItemId}`)}
      >
        <Grid.Col span={4} mih={125}>
          {serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={serviceListing.attachmentURLs[0]}
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
        <Grid.Col span={16}>
          <Box>
            <Text fw={600} size={16}>
              {serviceListing.title}
            </Text>
            <Text lineClamp={2} size="xs">
              {serviceListing.description}
            </Text>
            {serviceListing.duration && (
              <Badge variant="dot" radius="xs">
                Duration: {convertMinsToDurationString(serviceListing.duration)}
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
          <Text size="sm" c="dark" fw={500}>
            ${formatNumber2Decimals(price)}
          </Text>
        </Grid.Col>
      </Grid>
      <Divider mt="xs" mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
        }}
      >
        <Grid.Col span={17}>
          <Group>{orderItemFooterGroup}</Group>
        </Grid.Col>
        <Grid.Col
          span={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Center>
            <IconPaw size="1rem" color="gray" />
            <Text c="dark" fw={500} size="sm" mt={1} ml={2}>
              Order Total:
            </Text>
            &nbsp;
            <Text c="dark" fw={600} size="xl">
              ${formatNumber2Decimals(price)}
            </Text>
          </Center>
        </Grid.Col>
      </Grid>
      <SelectTimeslotModal
        petOwnerId={userId}
        orderItemId={orderItemId}
        serviceListing={serviceListing}
        opened={opened}
        onClose={close}
      />
    </Card>
  );
};

export default OrderItemCard;
