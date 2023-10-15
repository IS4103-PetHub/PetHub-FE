import {
  Container,
  TextInput,
  Button,
  Modal,
  MultiSelect,
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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import {
  Address,
  CalendarGroup,
  ServiceCategoryEnum,
  ServiceListing,
  Tag,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import {
  useCreateServiceListing,
  useUpdateServiceListing,
} from "@/hooks/service-listing";
import {
  CreateServiceListingPayload,
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
  tags: Tag[];
  addresses: Address[];
  calendarGroups: CalendarGroup[];
}

const ServiceListingModal = ({
  opened,
  onClose,
  isView,
  isUpdate,
  serviceListing,
  userId,
  refetch,
  tags,
  addresses,
  calendarGroups,
}: ServiceListingModalProps) => {
  /*
   * Component State
   */
  const [imagePreview, setImagePreview] = useState([]);
  const [isUpdating, setUpdating] = useState(isUpdate);
  const [isViewing, setViewing] = useState(isView);
  // used to force reload the fileinput after each touch
  const [fileInputKey, setFileInputKey] = useState(0);

  /*
   * Component Form
   */
  type ServiceFormValues = typeof serviceListingForm.values;
  const serviceListingForm = useForm({
    initialValues: {
      serviceListingId: null,
      title: "",
      description: "",
      category: "",
      basePrice: 0.0,
      addresses: [],
      files: [],
      tags: [],
      confirmation: false,
      calendarGroupId: "",
      duration: null,
      requiresBooking: false,
      defaultExpiryDays: undefined,
      lastPossibleDate: null,
    },
    validate: {
      title: (value) => {
        const minLength = 1;
        const maxLength = 64;
        if (!value) return "Title is mandatory.";
        if (value.length < minLength || value.length > maxLength) {
          return `Title must be between ${minLength} and ${maxLength} characters.`;
        }
      },
      description: isNotEmpty("Description is mandatory."), // min max length
      category: isNotEmpty("Category is mandatory."),
      basePrice: (value) => {
        if (value.toString() == "") return "Price must be a valid number.";
        if (value === null || value === undefined) return "Price is mandatory.";
        else if (value < 0)
          return "Price must be a positive number with two decimal places.";
      },
      files: (value) => {
        if (value.length > 6) {
          notifications.show({
            title: isUpdating
              ? "Error Updating Service Listing"
              : "Error Creating Service Listing",
            color: "red",
            icon: <IconX />,
            message: "A maximum of 6 images can be uploaded.",
          });
          return (
            <div style={{ color: "red" }}>Maximum of 6 images allowed.</div>
          );
        }
        return null;
      },
      defaultExpiryDays: isNotEmpty("Default Expiry Days is required"),
    },
  });

  /*
   * Effect Hooks
   */

  useEffect(() => {
    const fetchAndSetServiceListingFields = async () => {
      if (serviceListing) {
        await setServiceListingFields(); // Wait for setServiceListingFields to complete
      }
    };

    fetchAndSetServiceListingFields(); // Immediately invoke the async function
  }, [serviceListing]);

  /*
   * Service Handlers
   */
  const createServiceListingMutation = useCreateServiceListing();
  const updateServiceListingMutation = useUpdateServiceListing();
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
        await updateServiceListingMutation.mutateAsync(payload);
        notifications.show({
          message: "Service Successfully Updated",
          color: "green",
        });
      } else {
        const payload: CreateServiceListingPayload = {
          petBusinessId: userId, // get userid from server props
          title: values.title,
          description: values.description,
          category: values.category as ServiceCategoryEnum,
          basePrice: values.basePrice,
          tagIds: values.tags.map((tagId) => parseInt(tagId)),
          files: values.files,
          addressIds: values.addresses,
          calendarGroupId: parseInt(values.calendarGroupId),
          duration: values.duration,
          requiresBooking: values.requiresBooking,
          defaultExpiryDays: values.defaultExpiryDays,
          lastPossibleDate: values.lastPossibleDate,
        };
        await createServiceListingMutation.mutateAsync(payload);
        notifications.show({
          message: "Service Successfully Created",
          color: "green",
        });
      }
      refetch();
      serviceListingForm.reset();
      setImagePreview([]);
      setUpdating(isUpdate);
      setViewing(isView);
      onClose();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps(
          isUpdating
            ? "Error Updating Service Listing"
            : "Error Creating Service Listing",
          error,
        ),
      });
    }
  };

  /*
   * Helper Functions
   */
  const categoryOptions = Object.values(ServiceCategoryEnum).map(
    (categoryValue) => ({
      value: categoryValue,
      label: formatStringToLetterCase(categoryValue),
    }),
  );

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new File([buffer], fileName);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const extractFileName = (attachmentKeys: string) => {
    return attachmentKeys.substring(attachmentKeys.lastIndexOf("-") + 1);
  };

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

    serviceListingForm.setValues({
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

  const closeAndResetForm = async () => {
    if (isUpdating || isViewing) {
      await setServiceListingFields();
    } else {
      serviceListingForm.reset();
      setImagePreview([]);
    }
    setUpdating(isUpdate);
    setViewing(isView);
    onClose();
  };

  const handleFileInputChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      imagePreview.push(...newImageUrls);
      const updatedFiles = [...serviceListingForm.values.files, ...files];

      setImagePreview(imagePreview);
      serviceListingForm.setValues({
        ...serviceListingForm.values,
        files: updatedFiles,
      });
    } else {
      setImagePreview([]);
      serviceListingForm.setValues({
        ...serviceListingForm.values,
        files: [],
      });
    }
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const removeImage = (indexToRemove) => {
    const updatedImagePreview = [...imagePreview];
    updatedImagePreview.splice(indexToRemove, 1); // Remove the image at the specified index
    setImagePreview(updatedImagePreview); // Update the state with the modified array

    const updatedFiles = [...serviceListingForm.values.files];
    updatedFiles.splice(indexToRemove, 1); // Remove the corresponding file from the files array in the form
    serviceListingForm.setValues({
      ...serviceListingForm.values,
      files: updatedFiles, // Update the form's files array
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
      padding="xl"
    >
      <form
        onSubmit={serviceListingForm.onSubmit((values) => handleAction(values))}
      >
        <Stack>
          <TextInput
            withAsterisk
            disabled={isViewing}
            label="Title"
            placeholder="Input Service Listing Title"
            {...serviceListingForm.getInputProps("title")}
          />

          <Textarea
            withAsterisk
            disabled={isViewing}
            label="Description"
            placeholder="Input Service Listing Description"
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
            defaultValue={0.0}
            min={0}
            precision={2}
            parser={(value) => {
              const floatValue = parseFloat(value.replace(/\$\s?|(,*)/g, ""));
              return isNaN(floatValue) ? "" : floatValue.toString();
            }}
            formatter={(value) => {
              const formattedValue = parseFloat(
                value.replace(/\$\s?/, ""),
              ).toFixed(2);
              return `$ ${formattedValue}`;
            }}
            {...serviceListingForm.getInputProps("basePrice")}
          />

          <NumberInput
            withAsterisk
            disabled={isViewing}
            label="Default Expiry Days"
            placeholder="Input number of days for vouchers to expire"
            min={0}
            {...serviceListingForm.getInputProps("defaultExpiryDays")}
          />

          <DateInput
            disabled={isViewing}
            label="Last Operational Date"
            placeholder="Input last possible date"
            valueFormat="DD/MM/YYYY"
            minDate={new Date()}
            clearable
            {...serviceListingForm.getInputProps("lastPossibleDate")}
          />

          <MultiSelect
            disabled={isViewing}
            label="Address"
            placeholder="Select your address"
            data={
              addresses
                ? addresses.map((address) => ({
                    value: address.addressId.toString(),
                    label: address.addressName,
                  }))
                : []
            }
            {...serviceListingForm.getInputProps("addresses")}
          />

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

          <Checkbox
            disabled={isViewing}
            label="Requires Booking"
            {...serviceListingForm.getInputProps("requiresBooking", {
              type: "checkbox",
            })}
          />

          {serviceListingForm.values.requiresBooking && (
            <>
              <Autocomplete
                disabled={isViewing}
                placeholder="Select Service duration"
                label="Duration (minutes)"
                data={["30", "60", "90", "120", "150", "180"]} // Convert numbers to strings
                onChange={(selectedValue) => {
                  const selectedDuration = parseInt(selectedValue, 10);
                  if (!isNaN(selectedDuration)) {
                    serviceListingForm.setValues({
                      duration: selectedDuration,
                    });
                  } else {
                    serviceListingForm.setValues({ duration: 0 });
                  }
                }}
                value={
                  serviceListingForm.values.duration
                    ? serviceListingForm.values.duration.toString()
                    : ""
                }
              />

              <Select
                disabled={isViewing}
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
                {...serviceListingForm.getInputProps("calendarGroupId")}
              />
            </>
          )}

          <FileInput
            disabled={isViewing}
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
                    {!isViewing && (
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
              <Group position="right">
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
                <Button type="submit">{isUpdating ? "Save" : "Create"}</Button>
              </Group>
            </>
          )}

          {isViewing && (
            <>
              <Group position="right">
                <Button
                  type="button"
                  onClick={() => {
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
    </Modal>
  );
};

export default ServiceListingModal;
