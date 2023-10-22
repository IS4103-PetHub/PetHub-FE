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
import { useCompleteOrderItem } from "../../../../apps/pethub-main/src/hooks/order";
import { CompleteOrderItemPayload } from "../../../../apps/pethub-main/src/types/types";
import { PageTitle } from "../PageTitle";

interface ViewOrderDetailsProps {
  order: OrderItem;
  pet: Pet;
}

export default function ViewOrderDetails({
  order,
  pet,
}: ViewOrderDetailsProps) {
  const theme = useMantineTheme();
  const orderStatusColorMap = new Map([
    ["PENDING_BOOKING", "indigo"],
    ["PENDING_FULFILLMENT", "violet"],
    ["FULFILLED", "green"],
    ["PAID_OUT", "green"],
    ["REFUNDED", "orange"],
    ["EXPIRED", "red"],
  ]);
  const [isClaimed, setIsClaimed] = useState(false);

  const isOrderItemClaimed = (status) => {
    return (
      status === OrderItemStatusEnum.Fulfilled ||
      status === OrderItemStatusEnum.PaidOut ||
      status === OrderItemStatusEnum.Refunded ||
      status === OrderItemStatusEnum.Expired
    );
  };

  const form = useForm({
    initialValues: {
      voucherCode: isOrderItemClaimed(order.status) ? order.voucherCode : "",
    },
    validate: {
      voucherCode: (value) =>
        isNotEmpty("Voucher code required.") && value.length === 6
          ? "Voucher code is of 6 characters."
          : null,
    },
  });

  const completeOrderMutation = useCompleteOrderItem(order.orderItemId);
  const handleCompleteOrder = async (payload: CompleteOrderItemPayload) => {
    try {
      await completeOrderMutation.mutateAsync(payload);
      notifications.show({
        title: "Order Item Fulfilled",
        color: "green",
        icon: <IconCheck />,
        message: `Voucher successfully claimed.`,
      });
      setIsClaimed(true);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error claiming voucher", error),
      });
    }
  };
  return (
    <>
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle title={`${order.itemName}`} />
          <Button
            style={{
              display: "flex",
              alignItems: "center",
            }}
            color={theme.primaryColor}
            onClick={() => {
              window.open(order.attachmentURL, "_blank");
            }}
          >
            <IconFileDownload size={"1.5rem"} />
            Download Invoice
          </Button>
        </Group>
        <Accordion
          radius="md"
          variant="filled"
          mt="xl"
          mb={80}
          multiple
          value={[
            "OrderDetails",
            "BookingDetails",
            "PetOwnerDetails",
            "ServiceListingDetails",
            "ClaimVoucher",
          ]}
          onChange={() => {}}
          chevronSize={0}
        >
          <Accordion.Item value="OrderDetails">
            <Accordion.Control
              icon={<IconPackage color={theme.colors.indigo[5]} />}
              sx={{ "&:hover": { cursor: "default" } }}
            >
              <Group>
                <Text size="xl" weight={600}>
                  Order Details
                </Text>
                <Badge color={orderStatusColorMap.get(order.status)}>
                  {formatStringToLetterCase(order.status)}
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Order Item Name:</Text>
                  </Box>
                  <Text>{order.itemName}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Order Item Id:</Text>
                  </Box>
                  <Text>{order.orderItemId}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Expiry Date:</Text>
                    <Text>{dayjs(order.expiryDate).format("DD-MM-YYYY")}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Date Created:</Text>
                    <Text>
                      {dayjs(order.invoice.createdAt).format("DD-MM-YYYY")}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Item Price:</Text>
                    <Text>${formatNumber2Decimals(order.itemPrice)}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Platform Fee :</Text>
                    <Text>
                      $
                      {formatNumber2Decimals(
                        PLATFORM_FEE_PERCENT * order.itemPrice,
                      )}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Total Price :</Text>
                    <Text>
                      $
                      {formatNumber2Decimals(
                        (1 + PLATFORM_FEE_PERCENT) * order.itemPrice,
                      )}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Commission Rate:</Text>
                    <Text>{order.commissionRate * 100}% </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Commission Amount:</Text>
                    <Text>
                      $
                      {formatNumber2Decimals(
                        order.commissionRate * order.itemPrice,
                      )}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Net Total:</Text>
                    <Text>
                      $
                      {formatNumber2Decimals(
                        (1 + PLATFORM_FEE_PERCENT) * order.itemPrice -
                          order.commissionRate * order.itemPrice,
                      )}
                    </Text>
                  </Box>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          {order.booking && (
            <>
              <Accordion.Item value="BookingDetails">
                <Accordion.Control
                  icon={<IconCalendar color={theme.colors.indigo[5]} />}
                  sx={{ "&:hover": { cursor: "default" } }}
                >
                  <Text size="xl" weight={600}>
                    Booking Details
                  </Text>
                </Accordion.Control>
                <Accordion.Panel mb="xs">
                  <Grid>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Booking ID:</Text>
                        <Text>{order.booking.bookingId}</Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Date Created:</Text>
                        <Text>
                          {dayjs(order.booking.dateCreated).format(
                            "DD-MM-YYYY",
                          )}
                        </Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Start Time:</Text>
                        <Text>
                          {dayjs(order.booking.startTime).format(
                            "DD-MM-YYYY, HH:MM",
                          )}
                        </Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">End Time:</Text>
                        <Text>
                          {dayjs(order.booking.endTime).format(
                            "DD-MM-YYYY, HH:MM",
                          )}
                        </Text>
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>
            </>
          )}
          <Accordion.Item value="PetOwnerDetails">
            <Accordion.Control
              icon={<IconUserCircle color={theme.colors.indigo[5]} />}
              sx={{ "&:hover": { cursor: "default" } }}
            >
              <Text size="xl" weight={600}>
                Pet Owner Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">First Name:</Text>
                    <Text>{order.invoice.PetOwner.firstName}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Last Name:</Text>
                    <Text>{order.invoice.PetOwner.lastName}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Contact Number:</Text>
                    <Text>{order.invoice.PetOwner.contactNumber}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Email:</Text>
                    <Text>{order.invoice.PetOwner.user.email}</Text>
                  </Box>
                </Grid.Col>

                {pet && (
                  <>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Pet Name:</Text>
                        <Text>{pet.petName}</Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Pet Type:</Text>
                        <Text>{formatStringToLetterCase(pet.petType)}</Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Gender:</Text>
                        <Text>{formatStringToLetterCase(pet.gender)}</Text>
                      </Box>
                    </Grid.Col>
                  </>
                )}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="ServiceListingDetails">
            <Accordion.Control
              icon={<IconNotes color={theme.colors.indigo[5]} />}
              sx={{ "&:hover": { cursor: "default" } }}
            >
              <Text size="xl" weight={600}>
                Service Listing Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Title:</Text>
                    <Text>{order.serviceListing.title}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Category:</Text>
                    <Text>
                      {formatStringToLetterCase(order.serviceListing.category)}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Box>
                    <Text weight="600">Description:</Text>
                    <Text>{order.serviceListing.description}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Base Price:</Text>
                    <Text>
                      ${formatNumber2Decimals(order.serviceListing.basePrice)}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Duration:</Text>
                    <Text>{order.serviceListing.duration} mins</Text>
                  </Box>
                </Grid.Col>
                {/* Address: not sure if just showing the name is enough */}
                {order.serviceListing.addresses.length != 0 && (
                  <Grid.Col span={12}>
                    <Box>
                      <Text weight="600">Address:</Text>
                      {order.serviceListing.addresses.map((address) => (
                        <Badge
                          key={address.addressId}
                          variant="dot"
                          style={{ marginRight: "8px" }}
                        >
                          {address.addressName}
                        </Badge>
                      ))}
                    </Box>
                  </Grid.Col>
                )}
                {/* Tags */}
                <Grid.Col span={12}>
                  <Box>
                    <Text weight="600">Tags:</Text>
                    {order.serviceListing.tags.map((tag) => (
                      <Badge key={tag.tagId} color="gray">
                        {formatStringToLetterCase(tag.name)}
                      </Badge>
                    ))}
                  </Box>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          {order.status !== OrderItemStatusEnum.PendingBooking && (
            <Accordion.Item value="ClaimVoucher">
              <Accordion.Control sx={{ "&:hover": { cursor: "default" } }}>
                <Group>
                  <IconGiftCard color={theme.colors.indigo[5]} />{" "}
                  <Text size="lg">
                    Claim Voucher
                    {isClaimed ||
                    order.status === OrderItemStatusEnum.Fulfilled ||
                    order.status === OrderItemStatusEnum.PaidOut ? (
                      <Badge color="green">Claimed</Badge>
                    ) : order.status ===
                      OrderItemStatusEnum.PendingFulfillment ? (
                      <Badge color="red">Unclaimed</Badge>
                    ) : order.status === OrderItemStatusEnum.Refunded ? (
                      <Badge color="orange">Refunded</Badge>
                    ) : order.status === OrderItemStatusEnum.Expired ? (
                      <Badge color="red">Expired</Badge>
                    ) : null}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel mb="xs">
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Voucher Code"
                      placeholder="Enter customer's code"
                      maxLength={6}
                      disabled={isClaimed || isOrderItemClaimed(order.status)}
                      {...form.getInputProps("voucherCode")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Button
                      color="primary"
                      disabled={isClaimed || isOrderItemClaimed(order.status)}
                      onClick={() => {
                        const voucherCode = form.values.voucherCode;
                        const payload: CompleteOrderItemPayload = {
                          userId: order.invoice.PetOwner.userId,
                          voucherCode: voucherCode,
                        };
                        handleCompleteOrder(payload);
                      }}
                    >
                      Claim
                    </Button>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          )}
          {/* <Accordion.Item value="RefundDetails">
            <Accordion.Control>
              <Text size="xl" weight={600}>
                Refund Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              Refund DEETS
            </Accordion.Panel>
          </Accordion.Item> */}
        </Accordion>
      </Container>
    </>
  );
}
