import {
  Modal,
  Group,
  Text,
  TextInput,
  Grid,
  SegmentedControl,
  Textarea,
  Select,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import React from "react";
import { useGetPetsByPetOwnerId } from "@/hooks/pets";
import { PetLostRequestType } from "@/types/constants";

interface LostAndFoundPostModalProps {
  petOwnerId: number;
  opened: boolean;
  close(): void;
}

const LostAndFoundPostModal = ({
  petOwnerId,
  opened,
  close,
}: LostAndFoundPostModalProps) => {
  const theme = useMantineTheme();
  const { data: pets = [] } = useGetPetsByPetOwnerId(petOwnerId);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      requestType: PetLostRequestType.LostPet,
      lastSeenDate: "",
      lastSeenLocation: "",
      contactNumber: "",
      petId: "",
      attachment: null,
    },

    validate: {
      title: (value) => {
        const maxLength = 64;
        if (!value) {
          return "Title is required.";
        }
        if (value.length > maxLength) {
          return `Title must be ${maxLength} characters or less.`;
        }
      },
      description: (value) => {
        const maxLength = 500;
        if (!value) {
          return "Description is required.";
        }
        if (value.length > maxLength) {
          return `Description must be ${maxLength} characters or less.`;
        }
      },
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="xl"
      title={
        <Text fw={500} size="lg">
          Create New Post
        </Text>
      }
    >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Grid grow>
          <Grid.Col span={12}>
            <SegmentedControl
              color="dark"
              size="md"
              fullWidth
              data={[
                { label: "Lost Pet", value: PetLostRequestType.LostPet },
                { label: "Found Pet", value: PetLostRequestType.FoundPet },
              ]}
              {...form.getInputProps("requestType")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              withAsterisk
              label="Title"
              placeholder="Post title"
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              withAsterisk
              label="Last Seen Date"
              clearable
              description="When was the pet last spotted?"
              placeholder="Last seen date"
              valueFormat="DD-MM-YYYY"
              maxDate={new Date()}
              icon={<IconCalendar size="1rem" />}
              {...form.getInputProps("lastSeenDate")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              withAsterisk
              description="Where did you last see the pet?"
              label="Last Seen Location"
              placeholder="Location"
              icon={<IconMapPin size="1rem" />}
              {...form.getInputProps("lastSeenLocation")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              withAsterisk
              label="Description"
              minRows={6}
              maxRows={6}
              maxLength={500}
              placeholder="Kindly describe the pet in more detail, but omit any direct identifiers such as microchip number."
              {...form.getInputProps("description")}
            />
            <Text color="dimmed" size="sm" align="right">
              {form.values.description.length} / 500 characters
            </Text>
          </Grid.Col>
          <Grid.Col span={6} mt={-20}>
            <TextInput
              withAsterisk
              label="Contact Number"
              description="Let others know where to reach you to find out more."
              placeholder="Contact number"
              {...form.getInputProps("contactNumber")}
            />
          </Grid.Col>
          {form.values.requestType === PetLostRequestType.LostPet && (
            <Grid.Col span={6} mt={-20}>
              <Select
                label="Pet"
                maxDropdownHeight={200}
                description="(Optional) Select the missing pet."
                placeholder="Select a pet"
                dropdownPosition="bottom"
                withinPortal
                clearable
                mb="xl"
                data={...pets.map((pet) => ({
                  value: pet.petId.toString(),
                  label: pet.petName,
                }))}
                {...form.getInputProps("petId")}
              />
            </Grid.Col>
          )}
        </Grid>
      </form>
      <Button fullWidth color="dark" size="md" className="gradient-hover">
        Create post
      </Button>
    </Modal>
  );
};

export default LostAndFoundPostModal;
