import {
  Modal,
  Text,
  TextInput,
  Grid,
  SegmentedControl,
  Textarea,
  Select,
  Button,
  Card,
  FileInput,
  Image,
  Group,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconMapPin } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import {
  AccountTypeEnum,
  downloadFile,
  extractFileName,
  getErrorMessageProps,
} from "shared-utils";
import {
  useCreatePetLostAndFoundPost,
  useUpdatePetLostAndFoundPost,
} from "@/hooks/pet-lost-and-found";
import { useGetPetOwnerByIdAndAccountType } from "@/hooks/pet-owner";
import { useGetPetsByPetOwnerId } from "@/hooks/pets";
import { PetRequestTypeEnum } from "@/types/constants";
import {
  CreatePetLostAndFoundPayload,
  PetLostAndFound,
  UpdatePetLostAndFoundPayload,
} from "@/types/types";

interface LostAndFoundPostModalProps {
  petOwnerId: number;
  opened: boolean;
  post?: PetLostAndFound;
  close(): void;
  refetch(): void;
}

const LostAndFoundPostModal = ({
  petOwnerId,
  opened,
  post,
  close,
  refetch,
}: LostAndFoundPostModalProps) => {
  const { data: petOwner } = useGetPetOwnerByIdAndAccountType(
    petOwnerId,
    AccountTypeEnum.PetOwner,
  );

  // pet lost and found object is passed in, hence is updating
  const isUpdating = post;
  const { data: pets = [] } = useGetPetsByPetOwnerId(petOwnerId);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useToggle();

  const createPetLostAndFoundPostMutation = useCreatePetLostAndFoundPost();
  const updatePetLostAndFoundMutation = useUpdatePetLostAndFoundPost();

  const form = useForm({
    initialValues: {
      title: post ? post.title : "",
      description: post ? post.description : "",
      requestType: post ? post.requestType : PetRequestTypeEnum.LostPet,
      lastSeenDate: post ? new Date(post.lastSeenDate) : "",
      lastSeenLocation: post ? post.lastSeenLocation : "",
      contactNumber: petOwner ? petOwner.contactNumber : "",
      petId: post ? post.petId?.toString() : "",
      file: null,
    },

    validate: {
      title: (value) => {
        const maxLength = 64;
        if (!value) {
          return "Title required.";
        }
        if (value.length > maxLength) {
          return `Title must be ${maxLength} characters or less.`;
        }
      },
      description: (value) => {
        const maxLength = 500;
        if (!value) {
          return "Please enter a description.";
        }
        if (value.length > maxLength) {
          return `Description must be ${maxLength} characters or less.`;
        }
      },
      lastSeenDate: isNotEmpty("Last seen date required."),
      lastSeenLocation: isNotEmpty("Last seen location required."),
      contactNumber: (value) =>
        /^[0-9]{8}$/.test(value)
          ? null
          : "Contact number must be 8 digits long.",
    },
  });

  const downloadPromise = () => {
    try {
      const fileName = extractFileName(post.attachmentKeys[0]);
      const url = post.attachmentURLs[0];
      return downloadFile(url, fileName);
    } catch (error) {
      console.error(`Error downloading file:`, error);
      return null;
    }
  };

  const setFormFields = async () => {
    if (isUpdating) {
      form.setValues({
        title: post ? post.title : "",
        description: post ? post.description : "",
        requestType: post ? post.requestType : PetRequestTypeEnum.LostPet,
        lastSeenDate: post ? new Date(post.lastSeenDate) : "",
        lastSeenLocation: post ? post.lastSeenLocation : "",
        contactNumber: post ? post.contactNumber : "",
        petId: post ? post.petId?.toString() : "",
      });

      if (post.attachmentURLs?.length > 0) {
        const newFile: File = await downloadPromise();
        const imageObjectUrl = URL.createObjectURL(newFile);
        setImagePreviewUrl(imageObjectUrl);
        form.setFieldValue("file", newFile);
      }

      return;
    }
    form.setFieldValue("contactNumber", petOwner?.contactNumber);
  };

  useEffect(() => {
    setFormFields();
  }, [petOwner, post]);

  type FormValues = typeof form.values;

  async function handleClose() {
    if (isUpdating) {
      await setFormFields();
    } else {
      form.reset();
      setImagePreviewUrl("");
    }
    close();
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);

    if (isUpdating) {
      try {
        const payload: UpdatePetLostAndFoundPayload = {
          ...values,
          lastSeenDate: new Date(values.lastSeenDate).toISOString(),
          petLostAndFoundId: post.petLostAndFoundId,
        };
        await updatePetLostAndFoundMutation.mutateAsync(payload);
        handleClose();
        refetch();
        notifications.show({
          message: "Pet Lost and Found Post Updated",
          color: "green",
        });
      } catch (error: any) {
        setIsLoading(false);
        notifications.show({
          ...getErrorMessageProps("Error Updating Post", error),
        });
      }
    } else {
      try {
        const payload: CreatePetLostAndFoundPayload = {
          ...values,
          lastSeenDate: new Date(values.lastSeenDate).toISOString(),
          petOwnerId,
        };
        await createPetLostAndFoundPostMutation.mutateAsync(payload);
        handleClose();
        refetch();
        notifications.show({
          message: "Pet Lost and Found Post Created",
          color: "green",
        });
      } catch (error: any) {
        setIsLoading(false);
        notifications.show({
          ...getErrorMessageProps("Error Creating Post", error),
        });
      }
    }
    setIsLoading(false);
  }

  const handleFileInputChange = (newFile: File) => {
    if (newFile) {
      const imageObjectUrl = URL.createObjectURL(newFile);
      setImagePreviewUrl(imageObjectUrl);
      form.setFieldValue("file", newFile);
    } else {
      setImagePreviewUrl("");
      form.setFieldValue("file", null);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnClickOutside={false}
      size="xl"
      title={
        <Text fw={500} size="lg">
          {isUpdating ? "Update Post" : "Create New Post"}
        </Text>
      }
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid grow>
          <Grid.Col span={12}>
            <SegmentedControl
              color="dark"
              size="md"
              fullWidth
              data={[
                { label: "Lost Pet", value: PetRequestTypeEnum.LostPet },
                { label: "Found Pet", value: PetRequestTypeEnum.FoundPet },
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
            <DateTimePicker
              withAsterisk
              label="Last Seen Date"
              clearable
              description="When was the pet last spotted?"
              placeholder="Last seen date"
              valueFormat="DD-MM-YYYY HH:mm"
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
        </Grid>
        <Grid grow mt={-20}>
          <Grid.Col span={6}>
            <TextInput
              withAsterisk
              label="Contact Number"
              description="Let others know where to reach you to find out more."
              placeholder="Contact number"
              {...form.getInputProps("contactNumber")}
            />
          </Grid.Col>
          {form.values.requestType === PetRequestTypeEnum.LostPet && (
            <Grid.Col span={6}>
              <Select
                label="Pet"
                maxDropdownHeight={200}
                description="(Optional) Select the missing pet."
                placeholder="Select a pet"
                dropdownPosition="bottom"
                withinPortal
                clearable
                data={...pets.map((pet) => ({
                  value: pet.petId.toString(),
                  label: pet.petName,
                }))}
                {...form.getInputProps("petId")}
              />
            </Grid.Col>
          )}
          <Grid.Col span={12}>
            <FileInput
              label="Upload Display Image"
              clearable
              placeholder={
                !imagePreviewUrl ? "No file selected" : "Upload new image"
              }
              accept="image/*"
              name="image"
              onChange={(file) => handleFileInputChange(file)}
              capture={false}
            />
            {form.values.file && imagePreviewUrl && (
              <Card sx={{ maxWidth: "100%" }}>
                <Image
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  sx={{ maxWidth: "100%", display: "block" }}
                />
              </Card>
            )}
          </Grid.Col>
        </Grid>
        <Group position="apart">
          {isUpdating && (
            <Button
              mt="lg"
              type="reset"
              size="md"
              color="gray"
              w="48%"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          )}
          <Button
            mt="lg"
            type="submit"
            w={isUpdating ? "49%" : "100%"}
            color="dark"
            size="md"
            className="gradient-hover"
            loading={isLoading}
          >
            {isUpdating ? "Save changes" : "Create post"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default LostAndFoundPostModal;
