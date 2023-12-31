import {
  TextInput,
  Group,
  Select,
  NumberInput,
  FileInput,
  Image,
  Textarea,
  Card,
  CloseButton,
  Autocomplete,
  Checkbox,
  Accordion,
  Box,
  Text,
  Button,
  MultiSelect,
  Grid,
  Divider,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconCircleX,
  IconListDetails,
  IconPhotoPlus,
  IconX,
} from "@tabler/icons-react";
import { IconCalendarTime } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  CalendarGroup,
  ServiceCategoryEnum,
  ServiceListing,
  Tag,
  downloadFile,
  extractFileName,
  formatISODateLong,
  formatISODateTimeShort,
  formatNumber2Decimals,
  formatStringToLetterCase,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import LargeEditButton from "web-ui/shared/LargeEditButton";
import LargeSaveButton from "web-ui/shared/LargeSaveButton";
import {
  useDeleteServiceListingById,
  useUpdateServiceListing,
} from "@/hooks/service-listing";
import { UpdateServiceListingPayload } from "@/types/types";

interface ServiceListingDetailsAccordionItemProps {
  form: any;
  serviceListing: ServiceListing;
  refetchServiceListings: () => Promise<any>;
  refetchServiceListing: () => Promise<any>;
  calendarGroups: CalendarGroup[];
  tags: Tag[];
}

const ServiceListingDetailsAccordionItem = ({
  form,
  serviceListing,
  refetchServiceListing,
  refetchServiceListings,
  calendarGroups,
  tags,
}: ServiceListingDetailsAccordionItemProps) => {
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isEditingDisabled, setIsEditingDisabled] = useState(true);

  const [showFullDescription, toggleShowFullDescription] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);

  const textRef = useRef(null);

  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useMantineTheme();

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

  // This is a hacky way to check if the text exceeds 2 lines in the DOM
  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
  }, [serviceListing?.description]);

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

  const handleFileInputChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      // enforce that there can only be 6 files max including the ones already "uploaded"
      if (files.length + form.values.files.length > 6) {
        notifications.show({
          title: `Image Maximum Reached`,
          color: "orange",
          icon: <IconX />,
          message: "Maximum of 6 images allowed per review.",
        });
        files = files.slice(0, 6 - form.values.files.length);
      }

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

  const removeImage = (indexToRemove: number) => {
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

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={7} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={17} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  const serviceOverviewGrid = (
    <Box>
      <Divider mb="lg" mt="lg" />
      <Group>
        <IconListDetails size="1rem" color={theme.colors.indigo[5]} />{" "}
        <Text fw={600} size="md" ml={-5}>
          Service Overview
        </Text>
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Title",
          isEditingDisabled ? (
            <Text fw={600}>{serviceListing?.title}</Text>
          ) : (
            <TextInput
              placeholder="Input Service Listing Title"
              {...form.getInputProps("title")}
            />
          ),
        )}
        {generateItemGroup(
          "Description",
          isEditingDisabled ? (
            <Box>
              <Text lineClamp={showFullDescription ? 0 : 2} ref={textRef}>
                {serviceListing?.description}
              </Text>
              <Group position="right">
                <Button
                  compact
                  variant="subtle"
                  color="blue"
                  size="xs"
                  onClick={() => toggleShowFullDescription()}
                  mt="xs"
                  mr="xs"
                  display={textExceedsLineClamp ? "block" : "none"}
                >
                  {showFullDescription ? "View less" : "View more"}
                </Button>
              </Group>
            </Box>
          ) : (
            <Textarea
              placeholder="Input Service Listing Description"
              minRows={1}
              maxRows={3}
              autosize
              {...form.getInputProps("description")}
            />
          ),
        )}
        {generateItemGroup(
          "Category",
          isEditingDisabled ? (
            <>
              {serviceListing?.category ? (
                <Badge ml={-2}>
                  {formatStringToLetterCase(serviceListing?.category)}
                </Badge>
              ) : (
                "-"
              )}
            </>
          ) : (
            <Select
              placeholder="Pick one"
              data={categoryOptions}
              {...form.getInputProps("category")}
            />
          ),
          { mt: isEditingDisabled && textExceedsLineClamp ? -30 : undefined },
        )}
        {generateItemGroup(
          "Price",
          isEditingDisabled ? (
            <Text>${formatNumber2Decimals(serviceListing?.basePrice)}</Text>
          ) : (
            <NumberInput
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
          ),
        )}
        {generateItemGroup(
          "Date Created",
          <Text>{formatISODateTimeShort(serviceListing?.dateCreated)}</Text>,
        )}
        {generateItemGroup(
          "Last Updated",
          <Text>
            {serviceListing?.lastUpdated
              ? formatISODateTimeShort(serviceListing?.lastUpdated)
              : "-"}
          </Text>,
        )}
        {generateItemGroup(
          "Last Spotlighted",
          <Text>
            {serviceListing?.lastUpdated
              ? formatISODateTimeShort(serviceListing?.listingTime)
              : "-"}
          </Text>,
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );

  const schedulingGrid = (
    <Box>
      <Group>
        <IconCalendarTime size="1rem" color={theme.colors.indigo[5]} />
        <Text fw={600} size="md" ml={-5}>
          Scheduling
        </Text>
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Default Expiry Days",
          isEditingDisabled ? (
            <Text>{`${serviceListing?.defaultExpiryDays} ${
              serviceListing?.defaultExpiryDays === 1 ? "day" : "days"
            }`}</Text>
          ) : (
            <NumberInput
              placeholder="Input number of days for vouchers to expire"
              min={0}
              {...form.getInputProps("defaultExpiryDays")}
            />
          ),
        )}
        {generateItemGroup(
          "Last Operational Date",
          isEditingDisabled ? (
            <Text>
              {serviceListing?.lastPossibleDate
                ? formatISODateLong(serviceListing?.lastPossibleDate)
                : "None selected"}
            </Text>
          ) : (
            <DateInput
              placeholder="Input last possible date"
              valueFormat="DD-MM-YYYY"
              minDate={new Date()}
              clearable
              {...form.getInputProps("lastPossibleDate")}
            />
          ),
        )}
        {generateItemGroup(
          "Requires Booking",
          isEditingDisabled ? (
            serviceListing?.requiresBooking ? (
              <Badge color="green" ml={-2}>
                REQUIRED
              </Badge>
            ) : (
              <Badge color="red" ml={-2}>
                NOT REQUIRED
              </Badge>
            )
          ) : (
            <Checkbox
              {...form.getInputProps("requiresBooking", {
                type: "checkbox",
              })}
            />
          ),
        )}
        {generateItemGroup(
          "Duration",
          isEditingDisabled ? (
            <Text>
              {serviceListing?.duration
                ? `${serviceListing.duration} minutes`
                : "-"}
            </Text>
          ) : (
            <Autocomplete
              placeholder="Select Service duration"
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
          ),
          { display: form.values.requiresBooking ? "block" : "none" },
        )}
        {generateItemGroup(
          "Calendar Group",
          isEditingDisabled ? (
            <Text>
              {
                calendarGroups.find(
                  (group) =>
                    group.calendarGroupId.toString() ===
                    form.values.calendarGroupId,
                )?.name
              }
            </Text>
          ) : (
            <Select
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
          ),
          { display: form.values.requiresBooking ? "block" : "none" },
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );

  const othersGrid = (
    <Box mb="md">
      <Group>
        <IconPhotoPlus size="1rem" color={theme.colors.indigo[5]} />
        <Text fw={600} size="md" ml={-5}>
          Other Details
        </Text>
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Locations",
          isEditingDisabled ? (
            serviceListing?.addresses && serviceListing.addresses.length > 0 ? (
              serviceListing.addresses.map((address) => (
                <Badge
                  key={address.addressId}
                  color="violet"
                  radius="xs"
                  mr={4}
                  variant="dot"
                >
                  {address.addressName}
                </Badge>
              ))
            ) : (
              <Text>None selected</Text>
            )
          ) : (
            <MultiSelect
              placeholder="Select address"
              data={
                serviceListing?.petBusiness?.businessAddresses
                  ? serviceListing.petBusiness.businessAddresses.map(
                      (address) => ({
                        value: address.addressId.toString(),
                        label: address.addressName,
                      }),
                    )
                  : []
              }
              {...form.getInputProps("addresses")}
            />
          ),
        )}

        {generateItemGroup(
          "Tags",
          isEditingDisabled ? (
            serviceListing?.tags && serviceListing.tags.length > 0 ? (
              serviceListing.tags.map((tag) => (
                <Badge key={tag.tagId} color="violet" radius="xs" mr={4}>
                  {tag.name}
                </Badge>
              ))
            ) : (
              <Text>None selected</Text>
            )
          ) : (
            <MultiSelect
              placeholder="Select your Tags"
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
          ),
        )}
        {generateItemGroup(
          "Display Images",
          isEditingDisabled ? (
            imagePreview.length == 0 ? (
              <Text color="dimmed">No images uploaded</Text>
            ) : (
              <ImageCarousel
                attachmentURLs={imagePreview}
                altText="Service listing image"
                imageHeight={400}
              />
            )
          ) : (
            <>
              <FileInput
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
                    <div
                      key={index}
                      style={{ flex: "0 0 calc(33.33% - 10px)" }}
                    >
                      <Card style={{ maxWidth: "100%" }} mt="xs">
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
            </>
          ),
        )}
      </Grid>
    </Box>
  );

  return (
    <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={20}>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Group position="apart" mt={5}>
          <Group>
            <Text size="xl" fw={600}>
              Service Listing Details
            </Text>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
            >
              ID: {serviceListing?.serviceListingId}
            </Badge>
          </Group>
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
                color="gray"
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
                sx={{ border: "1.5px  solid" }}
              />
            </Group>
          )}
        </Group>

        {serviceOverviewGrid}

        {schedulingGrid}

        {othersGrid}
      </form>
    </Accordion.Item>
  );
};

export default ServiceListingDetailsAccordionItem;
