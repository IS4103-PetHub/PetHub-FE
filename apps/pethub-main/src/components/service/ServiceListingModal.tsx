import { close } from "fs";
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
  Slider,
  FileInput,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import {
  useCreateServiceListing,
  usePatchServiceListingByServiceId,
} from "@/hooks/serviceListingHooks";
import { useGetAllTags } from "@/hooks/tagsHooks";
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
  const updateServiceListingMutation =
    usePatchServiceListingByServiceId(queryClient);
  const handleAction = async (values: ServiceFormValues) => {
    try {
      if (isUpdate) {
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
        title: isUpdate
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
    validate: (values) => {
      const errors: any = {};
      if (!values.title) errors.title = "Title is mandatory.";
      if (!values.description) errors.description = "Description is mandatory.";
      if (!values.category) errors.category = "Category is mandatory.";
      if (!values.basePrice) errors.basePrice = "Price is mandatory.";
      // if (!values.address) errors.location = 'Address is mandatory.';
      // if (!values.attachments) errors.attachments = 'Attachments are mandatory.';
      if (!values.confirmation)
        errors.confirmation = "Confirmation is mandatory.";
      if (values.description.length > 500) {
        errors.description = "Description cannot exceed 500 characters.";
      }
      if (values.basePrice < 0) {
        errors.basePrice =
          "Price must be a positive number with two decimal places.";
      }
      console.log("Logging errors:", errors);
      return errors;
    },
  });

  useEffect(() => {
    if (serviceListing) {
      const tagIds = serviceListing.tags.map((tag) => tag.tagId.toString());
      serviceListingForm.setValues({
        ...serviceListing,
        // TODO: add address in when the BE is ready
        // address: serviceListing.address.addressId.toString(),
        tags: tagIds,
      });
    }
  }, [serviceListing]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        isUpdate
          ? "Update Service Listing"
          : isView
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
          <TextInput
            withAsterisk
            disabled={isView}
            label="Title"
            placeholder=""
            {...serviceListingForm.getInputProps("title")}
          />

          <TextInput
            withAsterisk
            disabled={isView}
            label="Description"
            placeholder=""
            {...serviceListingForm.getInputProps("description")}
          />

          <Select
            withAsterisk
            disabled={isView}
            label="Category"
            placeholder="Pick one"
            // need change to this to use enums
            data={categoryOptions}
            {...serviceListingForm.getInputProps("category")}
          />

          <NumberInput
            withAsterisk
            disabled={isView}
            label="Price"
            min={0}
            step={0.01}
            precision={2}
            {...serviceListingForm.getInputProps("basePrice")}
          />

          {/*
                        TODO: this is for addresss
                        - once the BE has address, get the list of address from the pet business
                        - let user select the address from the list of addresss
                    */}

          {/* <Select
                        withAsterisk
                        disabled={isView}
                        label="Select an Address"
                        data={dummyAddress.map((address) => ({
                            value: address.addressId.toString(),
                            label: address.addressName,
                        }))}
                        {...serviceListingForm.getInputProps('address')}
                    /> */}

          {/* <FileInput
                        withAsterisk
                        disabled={isView}
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
            disabled={isView}
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

          {!isView && (
            <>
              <Checkbox
                mt="md"
                label={
                  isUpdate
                    ? "I confirm that I want to update this service listing "
                    : "I agree to all the terms and conditions."
                }
                {...serviceListingForm.getInputProps("confirmation", {
                  type: "checkbox",
                })}
              />
              <Group position="right" mt="md">
                <Button type="submit">{isUpdate ? "Update" : "Create"}</Button>
              </Group>
            </>
          )}
        </form>
      </Container>
    </Modal>
  );
};

export default ServiceListingModal;
