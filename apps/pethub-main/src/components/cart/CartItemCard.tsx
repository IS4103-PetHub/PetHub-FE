import {
  useMantineTheme,
  Text,
  Divider,
  Card,
  Button,
  Group,
  Box,
  Checkbox,
  Grid,
  Image,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ServiceListing, convertMinsToDurationString } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import NumberInputWithIcons from "web-ui/shared/NumberInputWithIcons";
import CartItemBadge from "./CartItemBadge";

const IMAGE_HEIGHT = 120;
interface CartItemCardProps {
  itemId: number;
  serviceListing: ServiceListing;
  checked: boolean;
  onCheckedChange: (checked: any) => void;
  setItemQuantity: (cartItemId: number, quantity: number) => void;
  removeItem: () => void;
  isDisabled: boolean;
  quantity: number;
}

const CartItemCard = ({
  itemId,
  serviceListing,
  checked,
  onCheckedChange,
  setItemQuantity,
  removeItem,
  quantity,
  isDisabled,
}: CartItemCardProps) => {
  const theme = useMantineTheme();
  const [value, setValue] = useState<number | "">(quantity || 1);

  useEffect(() => {
    setValue(quantity || 1);
  }, [quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    setValue(newQuantity);
    setItemQuantity(itemId, newQuantity);
  };

  const removeItemFromCart = () => {
    removeItem();
    notifications.show({
      title: "Item Removed from Cart",
      color: "green",
      message: `${serviceListing.title} has been removed from your cart.`,
    });
  };

  return (
    <Card withBorder mb="lg" mih={220} mah={250} radius="md" shadow="sm">
      <Group position="apart" mb="xs">
        <Center>
          <Checkbox
            mr="md"
            checked={checked}
            disabled={isDisabled}
            onChange={(event) => onCheckedChange(event.currentTarget.checked)}
          />
          {serviceListing.calendarGroupId && (
            <CartItemBadge
              text={`Duration: ${convertMinsToDurationString(
                serviceListing.duration,
              )}`}
              type="DURATION"
              variant="dot"
              square={true}
            />
          )}
        </Center>
        <Center>
          <Button
            variant="subtle"
            onClick={removeItemFromCart}
            leftIcon={<IconTrash size="1rem" />}
            color="gray"
          >
            Remove from cart
          </Button>
        </Center>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid
        columns={24}
        sx={{
          height: "100%",
        }}
      >
        <Grid.Col span={4} mt="xs">
          {serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={serviceListing.attachmentURLs[0]}
              height={IMAGE_HEIGHT}
              alt="Cart Item Photo"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              height={IMAGE_HEIGHT}
              alt="Cart Item Photo"
            />
          )}
        </Grid.Col>
        <Grid.Col span={15} mt="xs">
          <Box ml={5}>
            <Link href={`/service-listings/${serviceListing.serviceListingId}`}>
              <Text fw={600} size="lg">
                {serviceListing.title}
              </Text>
            </Link>
            <Link href={`/pet-businesses/${serviceListing.petBusinessId}`}>
              <CartItemBadge
                text={serviceListing.petBusiness?.companyName}
                type="PETBUSINESS"
                variant="light"
                square={true}
                size="md"
                mb="xs"
              />
            </Link>
            <Text size="xs" mb="xs" color="dimmed" lineClamp={2} w="90%">
              {serviceListing.description}
            </Text>
            <Box>
              <NumberInputWithIcons
                value={value}
                setValue={handleQuantityChange}
                min={1}
                max={100}
                step={1}
              />
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col
          span={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Text fw={600} size="lg" mr={5}>
            $
            {formatNumber2Decimals(
              quantity
                ? serviceListing.basePrice * quantity
                : serviceListing.basePrice,
            )}
          </Text>
          {quantity > 1 && (
            <Text color="dimmed" size="sm" mr={5} mt={-2} mb={2}>
              ${formatNumber2Decimals(serviceListing.basePrice)} each
            </Text>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default CartItemCard;
