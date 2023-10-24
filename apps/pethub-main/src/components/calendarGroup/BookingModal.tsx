import {
  Accordion,
  Badge,
  Button,
  Grid,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
  Loader,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClipboardList,
  IconGiftCard,
  IconClockHour4,
  IconUserSquare,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  Address,
  Tag,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
  OrderItemStatusEnum,
} from "shared-utils";
import { useCompleteOrderItem } from "@/hooks/order";
import { Booking, CompleteOrderItemPayload } from "@/types/types";
import SelectTimeslotModal from "../appointment-booking/SelectTimeslotModal";

interface BookingModalProps {
  booking: Booking;
  opened: boolean;
  onClose(): void;
  addresses: Address[];
  tags: Tag[];
  refetch: () => void;
}

const BookingModal = ({
  booking,
  opened,
  onClose,
  addresses,
  tags,
  refetch,
}: BookingModalProps) => {
  const [
    rescheduleModalOpened,
    { open: openRescheduleModal, close: closeRescheduleModal },
  ] = useDisclosure(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useMantineTheme();
  const defaultValues = ["Claim Voucher"];

  const isOrderItemClaimed = (status) => {
    return (
      status === OrderItemStatusEnum.Fulfilled ||
      status === OrderItemStatusEnum.PaidOut ||
      status === OrderItemStatusEnum.Refunded ||
      status === OrderItemStatusEnum.Expired
    );
  };

  const formDefaultValues = {
    // Booking details
    startTime: booking ? formatTime(booking.startTime) : "",
    endTime: booking ? formatTime(booking.endTime) : "",
    description: booking ? booking.serviceListing.description : "",
    category: booking
      ? formatStringToLetterCase(booking.serviceListing.category)
      : "",
    tags: booking
      ? booking.serviceListing.tags.map((tag) => tag.tagId.toString())
      : [],
    addresses: booking
      ? booking.serviceListing.addresses.map((address) =>
          address.addressId.toString(),
        )
      : [],
    basePrice: booking ? booking.serviceListing.basePrice : 0,
    voucherCode:
      booking && isOrderItemClaimed(booking?.OrderItem.status)
        ? booking.OrderItem?.voucherCode
        : "",

    // user details
    petOwnerName: booking
      ? booking.petOwner.firstName?.concat(" ", booking.petOwner.lastName)
      : "",
    petOwnerContact: booking ? booking.petOwner.contactNumber : "",
    petOwnerEmail: booking ? booking.petOwner.email : "",
    petName: booking ? (booking.pet ? booking.pet.petName : "") : "",
    petType: booking
      ? booking.pet
        ? formatStringToLetterCase(booking.pet.petType)
        : ""
      : "",
    petGender: booking
      ? booking.pet
        ? formatStringToLetterCase(booking.pet.gender)
        : ""
      : "",
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      voucherCode: (value) =>
        isNotEmpty("Voucher code required.") && value.length === 6
          ? "Voucher code is of 6 characters."
          : null,
    },
  });

  useEffect(() => {
    setIsClaimed(false);
    form.setValues(formDefaultValues);
  }, [booking]);

  /*
   *    HELPER FUNCTIONS
   */

  function formatTime(time) {
    const date = new Date(time);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const completeOrderMutation = useCompleteOrderItem(
    booking ? booking.orderItemId : null,
  );
  const handleCompleteOrder = async (payload: CompleteOrderItemPayload) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
      onClose();
    }
  };
  function onUpdateBooking() {
    refetch();
    onClose();
  }

  const modalTitle = (
    <Group>
      <Text size="lg" weight={500}>
        {form.values.startTime} - {form.values.endTime}
      </Text>
      <Button
        variant="filled"
        compact
        onClick={openRescheduleModal}
        leftIcon={<IconClockHour4 size="1rem" style={{ marginRight: -5 }} />}
      >
        Reschedule
      </Button>
    </Group>
  );

  function renderItemGroup(label: string, value: string | any[]) {
    if (Array.isArray(value) && value.length > 0) {
      return (
        <>
          <Group position="apart" ml="xs" mr="xs" mb="md">
            <Text fw={600}>{label}:</Text>
            <Text size="sm">
              {value.map((item, index) => (
                <span key={item.id}>
                  {index > 0 ? ", " : ""}
                  {item.name}
                </span>
              ))}
            </Text>
          </Group>
        </>
      );
    } else if (typeof value === "string") {
      return (
        <>
          {value && (
            <Group position="apart" ml="xs" mr="xs" mb="md">
              <Text fw={600}>{label}</Text>
              <Text>{value}</Text>
            </Group>
          )}
        </>
      );
    }
    return null;
  }

  return (
    <>
      {booking && (
        <Modal
          opened={opened}
          onClose={onClose}
          title={modalTitle}
          centered
          size="80vh"
        >
          <Text size="lg" weight={600} mb="xs">
            {booking.serviceListing.title}
          </Text>
          <Accordion variant="separated" multiple defaultValue={defaultValues}>
            <Accordion.Item value="Claim Voucher">
              <Accordion.Control>
                <Group>
                  <IconGiftCard color={theme.colors.indigo[5]} />{" "}
                  <Text size="lg">
                    Claim Voucher
                    {isClaimed ||
                    booking?.OrderItem.status ===
                      OrderItemStatusEnum.Fulfilled ||
                    booking?.OrderItem.status ===
                      OrderItemStatusEnum.PaidOut ? (
                      <Badge color="green">Claimed</Badge>
                    ) : booking?.OrderItem.status ===
                      OrderItemStatusEnum.PendingFulfillment ? (
                      <Badge color="red">Unclaimed</Badge>
                    ) : booking?.OrderItem.status ===
                      OrderItemStatusEnum.Refunded ? (
                      <Badge color="orange">Refunded</Badge>
                    ) : booking?.OrderItem.status ===
                      OrderItemStatusEnum.Expired ? (
                      <Badge color="red">Expired</Badge>
                    ) : null}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col span={12}>
                    {isOrderItemClaimed(booking?.OrderItem.status) ||
                    isClaimed ? (
                      renderItemGroup("Voucher Code", form.values.voucherCode)
                    ) : (
                      <TextInput
                        label="Voucher Code"
                        placeholder="Enter customer's code"
                        maxLength={6}
                        {...form.getInputProps("voucherCode")}
                      />
                    )}
                  </Grid.Col>
                  <Grid.Col span={12}>
                    {!isOrderItemClaimed(booking?.OrderItem.status) &&
                      !isClaimed && (
                        <Button
                          color="primary"
                          onClick={() => {
                            const voucherCode = form.values.voucherCode;
                            const payload: CompleteOrderItemPayload = {
                              userId: booking ? booking.petOwnerId : null,
                              voucherCode: voucherCode,
                            };
                            handleCompleteOrder(payload);
                          }}
                          disabled={loading} // disable the button while loading
                          rightIcon={loading ? <Loader size="xs" /> : null}
                        >
                          {loading ? "Claiming..." : "Claim"}
                        </Button>
                      )}
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
            {/* Customer related details, name, contact nuber, etc */}
            <Accordion.Item value="Customer Details">
              <Accordion.Control>
                <Group>
                  <IconUserSquare color={theme.colors.indigo[5]} />
                  <Text size="lg">Customer details</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {renderItemGroup("Name", form.values.petOwnerName)}
                {renderItemGroup("Contact", form.values.petOwnerContact)}
                {renderItemGroup("Email", form.values.petOwnerEmail)}
                {renderItemGroup("Pet Name", form.values.petName)}
                {renderItemGroup("Pet Type", form.values.petType)}
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="Booking Details">
              <Accordion.Control>
                <Group>
                  <IconClipboardList color={theme.colors.indigo[5]} />
                  <Text size="lg">Service details</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {renderItemGroup("Base Price", `$ ${form.values.basePrice}`)}
                {renderItemGroup("Category", form.values.category)}
                {renderItemGroup("Start Time", form.values.startTime)}
                {renderItemGroup("End Time", form.values.endTime)}
                {renderItemGroup(
                  "Addresses",
                  addresses.map((address) => ({
                    id: address.addressId,
                    name: address.addressName,
                  })),
                )}
                {renderItemGroup(
                  "Tags",
                  tags.map((tag) => ({ id: tag.tagId, name: tag.name })),
                )}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Modal>
      )}
      {booking && (
        <SelectTimeslotModal
          petOwnerId={booking?.petOwnerId}
          opened={rescheduleModalOpened}
          onClose={closeRescheduleModal}
          orderItem={booking?.OrderItem}
          serviceListing={booking?.serviceListing}
          onUpdateBooking={onUpdateBooking}
          booking={booking}
          isUpdating
          forPetBusiness
        />
      )}
    </>
  );
};

export default BookingModal;
