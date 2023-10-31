import {
  TextInput,
  Group,
  Select,
  NumberInput,
  FileInput,
  Image,
  Stack,
  Textarea,
  Card,
  CloseButton,
  Autocomplete,
  Checkbox,
  Accordion,
  Center,
  Box,
  Text,
  Button,
  MultiSelect,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCircleX, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { set } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Address,
  CalendarGroup,
  ServiceCategoryEnum,
  ServiceListing,
  Tag,
  downloadFile,
  extractFileName,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import LargeEditButton from "web-ui/shared/LargeEditButton";
import LargeSaveButton from "web-ui/shared/LargeSaveButton";
import {
  useCreateServiceListing,
  useDeleteServiceListingById,
  useUpdateServiceListing,
} from "@/hooks/service-listing";
import {
  CreateServiceListingPayload,
  UpdateServiceListingPayload,
} from "@/types/types";

interface ServiceListingDetailsAccordionItemProps {
  form: any;
  serviceListing: ServiceListing;
  refetchServiceListings: () => Promise<any>;
  refetchServiceListing: () => Promise<any>;
  calendarGroups: CalendarGroup[];
}

const ServiceListingDetailsAccordionItem = ({
  form,
  serviceListing,
  refetchServiceListing,
  refetchServiceListings,
  calendarGroups,
}: ServiceListingDetailsAccordionItemProps) => {
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isEditingDisabled, setIsEditingDisabled] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  const categoryOptions = Object.values(ServiceCategoryEnum).map(
    (categoryValue) => ({
      value: categoryValue,
      label: formatStringToLetterCase(categoryValue),
    }),
  );

  useEffect(() => {
    const fetchAndSetServiceListingFields = async () => {
      if (serviceListing || isEditingDisabled) {
        await setServiceListingFields();
      }
    };
    fetchAndSetServiceListingFields();
  }, [serviceListing, isEditingDisabled]);

  const setServiceListingFields = async () => {
    const tagIds = serviceListing.tags.map((tag) => tag.tagId.toString());
    const addressIds = serviceListing.addresses.map((address) =>
      address.addressId.toString(),
    );
    const fileNames = serviceListing.attachmentKeys.map((keys) =>
      extractFileName(keys),
    );

    const downloadPromises = fileNames.map((filename, index) => {
      const url = serviceListing.attachmentURLs[index];
      return downloadFile(url, filename).catch((error) => {
        console.error(`Error downloading file ${filename}:`, error);
        return null; // Return null for failed downloads
      });
    });
    const downloadedFiles: File[] = await Promise.all(downloadPromises);
    form.setValues({
      ...serviceListing,
      requiresBooking: serviceListing.requiresBooking,
      defaultExpiryDays: serviceListing.defaultExpiryDays
        ? serviceListing.defaultExpiryDays
        : undefined,
      lastPossibleDate: serviceListing.lastPossibleDate
        ? new Date(serviceListing.lastPossibleDate)
        : undefined,
      title: serviceListing.title,
      tags: tagIds,
      files: downloadedFiles,
      addresses: addressIds,
      calendarGroupId: serviceListing.calendarGroupId
        ? serviceListing.calendarGroupId.toString()
        : "",
    });
    const imageUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(imageUrls);
  };

  //   const closeAndResetForm = async () => {
  //     if (isUpdating || isEditingDisabled) {
  //       await setServiceListingFields();
  //     } else {
  //       form.reset();
  //       setImagePreview([]);
  //     }
  //     setUpdating(isUpdate);
  //     setViewing(isView);
  //     onClose();
  //   };

  const handleFileInputChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      imagePreview.push(...newImageUrls);
      const updatedFiles = [...form.values.files, ...files];

      setImagePreview(imagePreview);
      form.setValues({
        ...form.values,
        files: updatedFiles,
      });
    } else {
      setImagePreview([]);
      form.setValues({
        ...form.values,
        files: [],
      });
    }
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const removeImage = (indexToRemove) => {
    const updatedImagePreview = [...imagePreview];
    updatedImagePreview.splice(indexToRemove, 1);
    setImagePreview(updatedImagePreview);

    const updatedFiles = [...form.values.files];
    updatedFiles.splice(indexToRemove, 1);
    form.setValues({
      ...form.values,
      files: updatedFiles,
    });
  };

  const deleteServiceListingMutation = useDeleteServiceListingById(queryClient);
  const handleDeleteServiceListing = async (id: number) => {
    try {
      await deleteServiceListingMutation.mutateAsync(id);
      notifications.show({
        title: "Calendar Group Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Service listing successfully deleted`,
      });
      await refetchServiceListings();
      router.push("/business/listings");
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Service Listing", error),
      });
    }
  };

  const updateServiceListingMutation = useUpdateServiceListing();
  const handleUpdateServiceListing = async (
    payload: UpdateServiceListingPayload,
  ) => {
    try {
      await updateServiceListingMutation.mutateAsync(payload);
      notifications.show({
        title: "Service Listing Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Service listing successfully updated`,
      });
      await refetchServiceListing();
      setIsEditingDisabled(true);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Updating Service Listing", error),
      });
    }
  };

  type formValues = typeof form.values;
  async function handleSubmit(values: formValues) {
    const payload: UpdateServiceListingPayload = {
      serviceListingId: values.serviceListingId,
      title: values.title,
      description: values.description,
      category: values.category as ServiceCategoryEnum,
      basePrice: values.basePrice,
      tagIds: values.tags.map((tagId) => parseInt(tagId)),
      files: values.files,
      addressIds: values.addresses,
      calendarGroupId: values.calendarGroupId
        ? parseInt(values.calendarGroupId)
        : undefined,
      duration: values.duration,
      requiresBooking: values.requiresBooking,
      defaultExpiryDays: values.defaultExpiryDays,
      lastPossibleDate: values.lastPossibleDate,
    };
    await handleUpdateServiceListing(payload);
  }

  return (
    <Accordion.Item
      value="details"
      pl={30}
      pr={30}
      pt={15}
      title="Service Listing Details"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Group position="apart" mt={5} mb={5}>
          <Text fw={600} size="xl">
            Service Listing Details
          </Text>
          {isEditingDisabled ? (
            <Group>
              <LargeEditButton
                text="Edit"
                onClick={() => setIsEditingDisabled(false)}
                size="sm"
                variant="light"
                miw={120}
                sx={{ border: "1.5px  solid" }}
              />
              <DeleteActionButtonModal
                title="Delete Service Listing"
                subtitle="Are you sure you want to delete this service listing?"
                onDelete={async () =>
                  handleDeleteServiceListing(form.values.serviceListingId)
                }
                large
                miw={120}
                variant="light"
                sx={{ border: "1.5px  solid" }}
              />
            </Group>
          ) : (
            <Group>
              <Button
                size="sm"
                onClick={() => setIsEditingDisabled(true)}
                miw={120}
                variant="light"
                color="red"
                sx={{ border: "1.5px  solid" }}
                leftIcon={<IconCircleX size="1rem" />}
              >
                Cancel
              </Button>
              <LargeSaveButton
                text="Save"
                size="sm"
                onClick={form.onSubmit((values: any) => handleSubmit(values))}
                miw={120}
                variant="light"
                color="green"
                sx={{ border: "1.5px  solid" }}
              />
            </Group>
          )}
        </Group>

        <Stack>
          <TextInput
            withAsterisk
            disabled={isEditingDisabled}
            label="Title"
            placeholder="Input Service Listing Title"
            {...form.getInputProps("title")}
          />

          <Textarea
            withAsterisk
            disabled={isEditingDisabled}
            label="Description"
            placeholder="Input Service Listing Description"
            autosize
            {...form.getInputProps("description")}
          />

          <Select
            withAsterisk
            disabled={isEditingDisabled}
            label="Category"
            placeholder="Pick one"
            // need change to this to use enums
            data={categoryOptions}
            {...form.getInputProps("category")}
          />

          <NumberInput
            withAsterisk
            disabled={isEditingDisabled}
            label="Price"
            defaultValue={0.0}
            min={0}
            precision={2}
            parser={(value) => {
              const floatValue = parseFloat(value.replace(/\$\s?|(,*)/g, ""));
              return isNaN(floatValue) ? "" : floatValue.toString();
            }}
            formatter={(value) => {
              const formattedValue = formatNumber2Decimals(
                parseFloat(value.replace(/\$\s?/, "")),
              );
              return `$ ${formattedValue}`;
            }}
            {...form.getInputProps("basePrice")}
          />

          <NumberInput
            withAsterisk
            disabled={isEditingDisabled}
            label="Default Expiry Days"
            placeholder="Input number of days for vouchers to expire"
            min={0}
            {...form.getInputProps("defaultExpiryDays")}
          />

          <DateInput
            disabled={isEditingDisabled}
            label="Last Operational Date"
            placeholder="Input last possible date"
            valueFormat="DD-MM-YYYY"
            minDate={new Date()}
            clearable
            {...form.getInputProps("lastPossibleDate")}
          />

          <MultiSelect
            disabled={isEditingDisabled}
            label="Address"
            placeholder="Select your address"
            data={
              serviceListing?.petBusiness?.businessAddresses
                ? serviceListing?.petBusiness?.businessAddresses.map(
                    (address) => ({
                      value: address.addressId.toString(),
                      label: address.addressName,
                    }),
                  )
                : []
            }
            {...form.getInputProps("addresses")}
          />

          <MultiSelect
            disabled={isEditingDisabled}
            label="Tags"
            placeholder="Select your Tags"
            data={
              serviceListing?.tags
                ? serviceListing?.tags.map((tag) => ({
                    value: tag.tagId.toString(),
                    label: tag.name,
                  }))
                : []
            }
            {...form.getInputProps("tags")}
          />

          <Checkbox
            disabled={isEditingDisabled}
            label="Requires Booking"
            {...form.getInputProps("requiresBooking", {
              type: "checkbox",
            })}
          />

          {form.values.requiresBooking && (
            <>
              <Autocomplete
                disabled={isEditingDisabled}
                placeholder="Select Service duration"
                label="Duration (minutes)"
                data={["30", "60", "90", "120", "150", "180"]} // Convert numbers to strings
                onChange={(selectedValue) => {
                  const selectedDuration = parseInt(selectedValue, 10);
                  if (!isNaN(selectedDuration)) {
                    form.setValues({
                      duration: selectedDuration,
                    });
                  } else {
                    form.setValues({ duration: 0 });
                  }
                }}
                value={
                  form.values.duration ? form.values.duration.toString() : ""
                }
              />

              <Select
                disabled={isEditingDisabled}
                label="Calendar Group"
                placeholder="Select a Calendar Group"
                data={
                  calendarGroups
                    ? [
                        {
                          value: null,
                          label: "",
                        },
                        ...calendarGroups.map((group) => ({
                          value: group.calendarGroupId.toString(),
                          label: group.name,
                        })),
                      ]
                    : []
                }
                {...form.getInputProps("calendarGroupId")}
              />
            </>
          )}

          <FileInput
            disabled={isEditingDisabled}
            label="Upload Display Images"
            placeholder={
              imagePreview.length == 0
                ? "No file selected"
                : "Upload new images"
            }
            accept="image/*"
            name="images"
            multiple
            onChange={(files) => handleFileInputChange(files)}
            capture={false}
            key={fileInputKey}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imagePreview &&
              imagePreview.length > 0 &&
              imagePreview.map((imageUrl, index) => (
                <div key={index} style={{ flex: "0 0 calc(33.33% - 10px)" }}>
                  <Card style={{ maxWidth: "100%" }}>
                    {!isEditingDisabled && (
                      <Group position="right">
                        <CloseButton
                          size="md"
                          color="red"
                          onClick={() => removeImage(index)}
                        />
                      </Group>
                    )}
                    <Image
                      src={imageUrl}
                      alt={`Image Preview ${index}`}
                      style={{ maxWidth: "100%", display: "block" }}
                    />
                  </Card>
                </div>
              ))}
          </div>
        </Stack>
      </form>
    </Accordion.Item>
  );
};

export default ServiceListingDetailsAccordionItem;
