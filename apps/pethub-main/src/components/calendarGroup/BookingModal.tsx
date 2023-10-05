import {
  Accordion,
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
import { IconClipboardList } from "@tabler/icons-react";
import { IconUserSquare } from "@tabler/icons-react";
import { useEffect } from "react";
import { Address, Tag, formatStringToLetterCase } from "shared-utils";
import { Booking } from "@/types/types";

interface BookingModalProps {
  booking: Booking;
  opened: boolean;
  onClose(): void;
  addresses: Address[];
  tags: Tag[];
}

const BookingModal = ({
  booking,
  opened,
  onClose,
  addresses,
  tags,
}: BookingModalProps) => {
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

  return (
    <>
      {booking && (
        <Modal
          opened={opened}
          onClose={onClose}
          title={
            <Text size="lg" weight={600}>
              {form.values.startTime} - {form.values.endTime}:{" "}
              {booking.serviceListing.title}
            </Text>
          }
          centered
          size="80vh"
        >
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
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Name"
                      disabled
                      {...form.getInputProps("petOwnerName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Contact"
                      disabled
                      {...form.getInputProps("petOwnerContact")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Email"
                      disabled
                      {...form.getInputProps("petOwnerEmail")}
                    />
                  </Grid.Col>
                  {booking.pet && (
                    <>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Pet Name"
                          disabled
                          {...form.getInputProps("petName")}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Pet Type"
                          disabled
                          {...form.getInputProps("petType")}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Pet Gender"
                          disabled
                          {...form.getInputProps("petGender")}
                        />
                      </Grid.Col>
                    </>
                  )}
                </Grid>
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
                <Grid>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Description"
                      disabled
                      autosize
                      {...form.getInputProps("description")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label="Base Price"
                      disabled
                      parser={(value) => {
                        const floatValue = parseFloat(
                          value.replace(/\$\s?|(,*)/g, ""),
                        );
                        return isNaN(floatValue) ? "" : floatValue.toString();
                      }}
                      formatter={(value) => {
                        const formattedValue = parseFloat(
                          value.replace(/\$\s?/, ""),
                        ).toFixed(2);
                        return `$ ${formattedValue}`;
                      }}
                      {...form.getInputProps("basePrice")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Category"
                      disabled
                      {...form.getInputProps("category")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TimeInput
                      label="Start Time"
                      disabled
                      {...form.getInputProps("startTime")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TimeInput
                      label="End Time"
                      disabled
                      {...form.getInputProps("endTime")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <MultiSelect
                      data={
                        addresses
                          ? addresses.map((address) => ({
                              value: address.addressId.toString(),
                              label: address.addressName,
                            }))
                          : []
                      }
                      disabled
                      label="Addresses"
                      {...form.getInputProps("addresses")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <MultiSelect
                      disabled
                      label="Tags"
                      data={
                        tags
                          ? tags.map((tag) => ({
                              value: tag.tagId.toString(),
                              label: tag.name,
                            }))
                          : []
                      }
                      {...form.getInputProps("tags")}
                    />
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>

            {/* Invoice and Transaction details */}
            {/* <Accordion.Item value="Invoice Details">
              <Accordion.Control>
                <Group>
                  <IconFileInvoice color={theme.colors.indigo[5]} />
                  <Text size="lg">Invoice Details</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>TODO: Invoice DETIALS</Accordion.Panel>
            </Accordion.Item> */}
          </Accordion>
        </Modal>
      )}
    </>
  );
};

export default BookingModal;
