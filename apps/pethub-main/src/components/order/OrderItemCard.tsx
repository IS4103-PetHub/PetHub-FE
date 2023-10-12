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
  Center,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBuildingStore, IconMapPin, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  OrderItemStatusEnum,
  ServiceListing,
  convertMinsToDurationString,
  formatISODayDateTime,
} from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import { formatPriceForDisplay } from "@/util";
import OrderItemBadge from "./OrderItemBadge";

interface OrderItemCardProps {
  itemId: number;
  title: string;
  price: number;
  quantity: number;
  voucherCode: string;
  companyName: string;
  status: string;
}

const OrderItemCard = ({
  itemId,
  title,
  price,
  quantity,
  voucherCode,
  companyName,
  status,
}: OrderItemCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Card withBorder mb="lg" mah={240} mih={240} radius="xs" shadow="xs">
      <Group position="apart" mb={5} mt={-5}>
        <Center>
          <Text fw={600} mr={2}>
            {companyName}
          </Text>
          <Button
            size="xs"
            variant="subtle"
            leftIcon={
              <IconBuildingStore size="1rem" style={{ marginRight: "-5px" }} />
            }
          >
            Visit Shop
          </Button>
        </Center>
        <OrderItemBadge text={status} />
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
        }}
      >
        <Grid.Col span={4}>
          <Image
            radius="md"
            src="/pethub-placeholder.png"
            fit="contain"
            w="auto"
            alt="Cart Item Photo"
          />
        </Grid.Col>
        <Grid.Col span={15}>
          <Box>
            <Text fw={500}>{title}</Text>
            {/* <Link href={`/service-listings/${serviceListing.serviceListingId}`}>
              <Text fw={600} size={18}>
                {serviceListing.title}
              </Text>
            </Link> */}
          </Box>
        </Grid.Col>
        <Grid.Col
          span={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text size="sm" c="dark">
            ${formatPriceForDisplay(price)}{" "}
            {quantity && quantity !== 1 && "(" + quantity + ")"}
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
        <Grid.Col span={4}>Pos 1</Grid.Col>
        <Grid.Col span={15}>Pos 2</Grid.Col>
        <Grid.Col
          span={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Text c="black">Order Total: </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default OrderItemCard;
