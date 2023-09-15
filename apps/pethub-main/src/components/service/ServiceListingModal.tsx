import {
  Container,
  TextInput,
  Button,
  Modal,
  MultiSelect,
  Checkbox,
  Group,
  Select,
  NumberInput,
  FileInput,
  Image,
  Stack,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import {
  useCreateServiceListing,
  useUpdateServiceListing,
} from "@/hooks/service-listing";
import { useGetAllTags } from "@/hooks/tags";
import { ServiceCategoryEnum } from "@/types/constants";
import {
  CreateServiceListingPayload,
  ServiceListing,
  UpdateServiceListingPayload,
} from "@/types/types";

interface ServiceListingModalProps {
  opened: boolean;
  onClose(): void;
  isView: boolean;
  isUpdate: boolean;
  serviceListing?: ServiceListing;
  userId: number;
  refetch(): void;
}

const ServiceListingModal = ({
  opened,
  onClose,
  isView,
  isUpdate,
  serviceListing,
  userId,
  refetch,
}: ServiceListingModalProps) => {
  // Image functions
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setUpdating] = useState(isUpdate);
  const [isViewing, setViewing] = useState(isView);
  const handleFileInputChange = (file: File) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      serviceListingForm.setValues({
        ...serviceListingForm.values,
        attachments: file,
      });
    } else {
      // If no file is selected, reset the image preview
      setImagePreview(null);
    }
  };

  const categoryOptions = Object.values(ServiceCategoryEnum).map(
    (categoryValue) => ({
      value: categoryValue,
      label: categoryValue.replace(/_/g, " "),
    }),
  );

  const { data: tags } = useGetAllTags();

  type ServiceFormValues = typeof serviceListingForm.values;

  const queryClient = useQueryClient();
  const createServiceListingMutation = useCreateServiceListing();
  const updateServiceListingMutation = useUpdateServiceListing(queryClient);
  const handleAction = async (values: ServiceFormValues) => {
    try {
      if (isUpdating) {
        const payload: UpdateServiceListingPayload = {
          serviceListingId: values.serviceListingId,
          title: values.title,
          description: values.description,
          category: values.category as ServiceCategoryEnum,
          basePrice: values.basePrice,
          tagIds: values.tags.map((tagId) => parseInt(tagId)),
        };
        const result = await updateServiceListingMutation.mutateAsync(payload);
        notifications.show({
          message: "Service Successfully Updated",
          color: "green",
          autoClose: 5000,
        });
      } else {
        const payload: CreateServiceListingPayload = {
          petBusinessId: userId, // get userid from server props
          title: values.title,
          description: values.description,
          category: values.category as ServiceCategoryEnum,
          basePrice: values.basePrice,
          tagIds: values.tags.map((tagId) => parseInt(tagId)),
        };
        await createServiceListingMutation.mutateAsync(payload);
        notifications.show({
          message: "Service Successfully Created",
          color: "green",
          autoClose: 5000,
        });
      }
      refetch();
      serviceListingForm.reset();
      setImagePreview(null);
      onClose();
    } catch (error) {
      notifications.show({
        title: isUpdating
          ? "Error Updating Service Listing"
          : "Error Creating Service Listing",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const serviceListingForm = useForm({
    initialValues: {
      serviceListingId: null,
      title: "",
      description: "",
      category: "",
      basePrice: 0.0,
      address: "", // TODO: address not in the BE yet
      attachments: null,
      tags: [],
      confirmation: false,
    },
    validate: {
      title: isNotEmpty("Title is mandatory."), // min max length
      description: isNotEmpty("Description is mandatory."), // min max length
      category: isNotEmpty("Category is mandatory."),
      basePrice: (value) => {
        if (!value) {
          return "Price is mandatory.";
        } else if (value < 0) {
          return "Price must be a positive number with two decimal places.";
        }
      },
      // confirmation: (value) => {
      //   if (!value && !isUpdating) return "Confirmation is mandatory.";
      // },
      // if (!values.address) errors.location = 'Address is mandatory.';
      // if (!values.attachments) errors.attachments = 'Attachments are mandatory.';
    },
  });

  useEffect(() => {
    if (serviceListing) {
      setServiceListingFields();
    }
  }, [serviceListing]);

  const closeAndResetForm = () => {
    if (isUpdating || isViewing) {
      setServiceListingFields();
    } else {
      serviceListingForm.reset();
    }
    setUpdating(isUpdate);
    setViewing(isView);
    onClose();
  };

  const setServiceListingFields = () => {
    const tagIds = serviceListing.tags.map((tag) => tag.tagId.toString());
    serviceListingForm.setValues({
      ...serviceListing,
      // TODO: add address in when the BE is ready
      // address: serviceListing.address.addressId.toString(),
      tags: tagIds,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={closeAndResetForm}
      title={
        isUpdating
          ? "Update Service Listing"
          : isViewing
          ? "View Service Listing"
          : "Create Service Listing"
      }
      centered
      size="80%"
    >
      <Container fluid>
        <form
          onSubmit={serviceListingForm.onSubmit((values) =>
            handleAction(values),
          )}
        >
          <Stack>
            <TextInput
              withAsterisk
              disabled={isViewing}
              label="Title"
              placeholder=""
              {...serviceListingForm.getInputProps("title")}
            />

            <Textarea
              withAsterisk
              disabled={isViewing}
              label="Description"
              placeholder=""
              autosize
              {...serviceListingForm.getInputProps("description")}
            />

            <Select
              withAsterisk
              disabled={isViewing}
              label="Category"
              placeholder="Pick one"
              // need change to this to use enums
              data={categoryOptions}
              {...serviceListingForm.getInputProps("category")}
            />

            <NumberInput
              withAsterisk
              disabled={isViewing}
              label="Price"
              min={0}
              step={0.01}
              precision={2}
              formatter={(value) => `$ ${value}`}
              {...serviceListingForm.getInputProps("basePrice")}
            />

            {/*
                        TODO: this is for addresss
                        - once the BE has address, get the list of address from the pet business
                        - let user select the address from the list of addresss
                    */}

            {/* <Select
                        withAsterisk
                        disabled={isViewing}
                        label="Select an Address"
                        data={dummyAddress.map((address) => ({
                            value: address.addressId.toString(),
                            label: address.addressName,
                        }))}
                        {...serviceListingForm.getInputProps('address')}
                    /> */}

            {/* <FileInput
                        withAsterisk
                        disabled={isViewing}
                        label="Upload Display Image"
                        placeholder="No file selected"
                        accept="image/*"
                        name="image"
                        {...serviceListingForm.getInputProps('attachments')}
                        onChange={handleFileInputChange}
                    />

                    {imagePreview && (
                        <Image src={imagePreview} alt="Image Preview" style={{ maxWidth: "100%" }} />
                    )} */}

            <MultiSelect
              disabled={isViewing}
              label="Tags"
              placeholder="Select your Tags"
              data={
                tags
                  ? tags.map((tag) => ({
                      value: tag.tagId.toString(),
                      label: tag.name,
                    }))
                  : []
              }
              {...serviceListingForm.getInputProps("tags")}
            />

            {!isViewing && (
              <>
                {/* TODO: link to page with terms and conditions  */}
                {/* {!isUpdating && (
                  <Checkbox
                    mt="md"
                    label={"I agree to all the terms and conditions."}
                    {...serviceListingForm.getInputProps("confirmation", {
                      type: "checkbox",
                    })}
                  />
                )} */}
                <Group position="right" mt="sm" mb="sm">
                  {!isViewing && (
                    <Button
                      type="reset"
                      color="gray"
                      onClick={() => {
                        closeAndResetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit">
                    {isUpdating ? "Save" : "Create"}
                  </Button>
                </Group>
              </>
            )}

            {isViewing && (
              <>
                <Group position="right" mt="md">
                  <Button
                    type="button"
                    onClick={() => {
                      // TODO: toggle between edit and view
                      setUpdating(true);
                      setViewing(false);
                    }}
                  >
                    Edit
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </form>
      </Container>
    </Modal>
  );
};

export default ServiceListingModal;
