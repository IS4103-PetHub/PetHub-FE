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
  Card,
  CloseButton,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { formatStringToLetterCase } from "shared-utils";
import { ServiceCategoryEnum } from "@/types/constants";
import { Address, ServiceListing, Tag } from "@/types/types";

interface ServiceListingModalProps {
  opened: boolean;
  onClose(): void;
  serviceListing?: ServiceListing;
  userId: number;
  refetch(): void;
  tags: Tag[];
}

const ServiceListingModal = ({
  opened,
  onClose,
  serviceListing,
  userId,
  refetch,
  tags,
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
      title: serviceListing.title,
      // TODO: add address in when the BE is ready
      // address: serviceListing.address.addressId.toString(),
      tags: tagIds,
      files: downloadedFiles,
      addresses: addressIds,
    });

    const imageUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(imageUrls);
  };

  return (
    <Modal
      opened={opened}
      onClose={closeAndResetForm}
      title={"View Service Listing"}
      centered
      size="80%"
    >
      <Container fluid>
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
                <Button type="submit">{isUpdating ? "Save" : "Create"}</Button>
              </Group>
            </>
          )}

          {isViewing && (
            <>
              <Group position="right" mt="md" mb="md">
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
      </Container>
    </Modal>
  );
};

export default ServiceListingModal;
