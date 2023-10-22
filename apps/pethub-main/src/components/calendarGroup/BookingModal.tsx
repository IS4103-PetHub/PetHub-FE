import {
  Accordion,
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
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconClipboardList, IconClockHour4 } from "@tabler/icons-react";
import { IconUserSquare } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  Address,
  Tag,
  formatNumber2Decimals,
  formatStringToLetterCase,
} from "shared-utils";
import { Booking } from "@/types/types";
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
  const theme = useMantineTheme();
  const defaultValues = ["Customer Details"];

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
  });

  useEffect(() => {
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
