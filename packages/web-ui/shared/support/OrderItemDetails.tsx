import {
  Grid,
  Box,
  Divider,
  useMantineTheme,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { IconPackages, IconPhotoPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  SupportTicket,
  formatISODateLong,
  formatISODayDateTime,
  formatNumber2Decimals,
} from "shared-utils";

interface OrderItemDetailsProps {
  supportTicket: SupportTicket;
  isAdmin?: boolean;
}

export default function OrderItemDetails({
  supportTicket,
  isAdmin,
}: OrderItemDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={7} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={17} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  return (
    <Box mb="md">
      <Group position="apart">
        <Text fw={600} size="md">
          <IconPackages size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Order Item Details
        </Text>
        {isAdmin && (
          <Button
            color="indigo"
            onClick={() =>
              router.push(`/admin/orders/${supportTicket.orderItemId}`)
            }
          >
            View
          </Button>
        )}
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Order Item ID",
          <Text>{supportTicket.orderItem.orderItemId}</Text>,
        )}
        {generateItemGroup(
          "Item Name",
          <Text>{supportTicket.orderItem.itemName}</Text>,
        )}
        {generateItemGroup(
          "Price",
          <Text>
            $ {formatNumber2Decimals(supportTicket.orderItem?.itemPrice)}
          </Text>,
        )}
        {generateItemGroup(
          "Date Created",
          <Text>
            {formatISODayDateTime(supportTicket.orderItem?.invoice?.createdAt)}
          </Text>,
        )}
        {generateItemGroup(
          "Date Expiry",
          <Text>{formatISODateLong(supportTicket.orderItem?.expiryDate)}</Text>,
        )}
        {generateItemGroup(
          "Pet Owner Name",
          <Text>
            {supportTicket.orderItem.invoice?.PetOwner?.firstName}{" "}
            {supportTicket.orderItem.invoice?.PetOwner?.lastName}
          </Text>,
        )}
        {generateItemGroup(
          "Pet Owner Contact No.",
          <Text>{supportTicket.orderItem.invoice.PetOwner.contactNumber}</Text>,
        )}
        {generateItemGroup(
          "Pet Owner Email",
          <Text>{supportTicket.orderItem.invoice.PetOwner.user.email}</Text>,
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );
}
