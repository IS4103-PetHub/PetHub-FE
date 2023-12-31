import {
  ActionIcon,
  Button,
  Card,
  CloseButton,
  FileInput,
  Group,
  Image,
  Modal,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPhotoPlus } from "@tabler/icons-react";
import React, { useRef, useState } from "react";

interface SupportCommentModalProps {
  commentForm: UseFormReturnType<any>;
  handleAction(): void;
  canEdit: boolean;
}

export default function SupportCommentModal({
  commentForm,
  handleAction,
  canEdit,
}: SupportCommentModalProps) {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef(null);

  const closeAndResetForm = async () => {
    commentForm.reset();
    setImagePreview([]);
    close();
  };

  const handleFileInputChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      imagePreview.push(...newImageUrls);
      const updatedFiles = [...commentForm.values.files, ...files];

      setImagePreview(imagePreview);
      commentForm.setValues({
        ...commentForm.values,
        files: updatedFiles,
      });
    } else {
      setImagePreview([]);
      commentForm.setValues({
        ...commentForm.values,
        files: [],
      });
    }
    open();
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const removeImage = (indexToRemove) => {
    const updatedImagePreview = [...imagePreview];
    updatedImagePreview.splice(indexToRemove, 1);
    setImagePreview(updatedImagePreview);

    const updatedFiles = [...commentForm.values.files];
    updatedFiles.splice(indexToRemove, 1);
    commentForm.setValues({
      ...commentForm.values,
      files: updatedFiles,
    });
  };

  const handleClickAddImage = () => {
    // Programmatically trigger the hidden file input element
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <ActionIcon disabled={!canEdit}>
        <IconPhotoPlus
          onClick={() => handleClickAddImage()}
          color={theme.colors.blue[5]}
        />
      </ActionIcon>
      <FileInput
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/*"
        style={{ display: "none" }}
      />
      <Modal
        opened={opened}
        onClose={closeAndResetForm}
        title={"Send an image"}
        centered
        size="80vh"
        padding="xl"
      >
        <form
          onSubmit={commentForm.onSubmit((values: any) => {
            handleAction();
            closeAndResetForm();
          })}
        >
          <FileInput
            label="Attachments"
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
            mb="xs"
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imagePreview &&
              imagePreview.length > 0 &&
              imagePreview.map((imageUrl, index) => (
                <div key={index} style={{ flex: "0 0 calc(33.33% - 10px)" }}>
                  <Card style={{ maxWidth: "100%" }} mt="xs" mb="xs">
                    <Group position="right">
                      <CloseButton
                        size="md"
                        color="red"
                        mb="xs"
                        onClick={() => removeImage(index)}
                      />
                    </Group>
                    <Image
                      src={imageUrl}
                      alt={`Image Preview ${index}`}
                      style={{ maxWidth: "100%", display: "block" }}
                      mb="xs"
                    />
                  </Card>
                </div>
              ))}
          </div>
          <Textarea
            label="Comment"
            placeholder="Input message"
            autosize
            mb="xs"
            {...commentForm.getInputProps("comment")}
          />
          <Group mt={25} position="right">
            <Button
              type="reset"
              color="gray"
              mb="xs"
              onClick={closeAndResetForm}
            >
              Cancel
            </Button>
            <Button type="submit" mb="xs">
              Send
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
