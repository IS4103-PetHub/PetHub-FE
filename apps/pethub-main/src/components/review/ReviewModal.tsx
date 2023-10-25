import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  FileInput,
  Grid,
  Group,
  Image,
  Modal,
  MultiSelect,
  NumberInput,
  Rating,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPaw, IconPawFilled, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  OrderItem,
  Review,
  downloadFile,
  getErrorMessageProps,
} from "shared-utils";
import { useCreateReview, useUpdateReview } from "@/hooks/review";
import { CreateReviewPayload, UpdateReviewPayload } from "@/types/types";
import {
  validateReviewComment,
  validateReviewFiles,
  validateReviewRating,
  validateReviewTitle,
} from "@/util";
import OrderItemCardMini from "../order/OrderItemCardMini";
import OrderItemPopover from "../order/OrderItemPopover";

interface ReviewModalProps {
  orderItem: OrderItem;
  opened: boolean;
  onClose: () => void;
  userId: number;
  onCreateOrUpdate?: () => Promise<any>;
}

const ReviewModal = ({
  orderItem,
  userId,
  opened,
  onClose,
  onCreateOrUpdate,
}: ReviewModalProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const OPEN_FOREVER = ["content"];

  const isUpdate = !!orderItem?.review;

  const form = useForm({
    initialValues: {
      title: "",
      comment: "",
      files: [],
      rating: 4,
    },
    validate: {
      title: (value) => validateReviewTitle(value),
      comment: (value) => validateReviewComment(value),
      files: (value) => validateReviewFiles(value),
      rating: (value) => validateReviewRating(value),
    },
  });

  const ratingTextMap = {
    1: "Pawful",
    2: "Meh, Just Okay",
    3: "Decent, Not Purrfect",
    4: "Tail Waggingly Great",
    5: "Pawsitively Excellent",
  };

  const handleModalClose = () => {
    form.reset();
    setImagePreview([]);
    setFileInputKey(0);
    onClose();
  };

  useEffect(() => {
    const fetchAndSetReviewFields = async () => {
      if (orderItem?.review) {
        await setReviewFields();
      } else {
        // This is neccessary to have a blank form after deleting a review
        form.reset();
        setImagePreview([]);
        setFileInputKey(0);
      }
    };
    fetchAndSetReviewFields();
  }, [orderItem, opened]);

  const setReviewFields = async () => {
    const fileNames = orderItem?.review?.attachmentKeys.map((keys) =>
      keys.substring(keys.lastIndexOf("-") + 1),
    );
    const downloadPromises = fileNames.map((filename, index) => {
      const url = orderItem?.review?.attachmentURLs[index];
      return downloadFile(url, filename).catch((error) => {
        console.error(`Error downloading file ${filename}:`, error);
        return null;
      });
    });
    const downloadedFiles: File[] = await Promise.all(downloadPromises);
    form.setValues({
      title: orderItem?.review?.title,
      comment: orderItem?.review?.comment,
      rating: orderItem?.review?.rating,
      files: downloadedFiles,
    });
    const imageUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(imageUrls);
  };

  // ik all these file stuff should probably be extracted somewhere but
  const handleFileInputChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      // enforce that there can only be 3 files max including the ones already "uploaded"
      if (files.length + form.values.files.length > 3) {
        notifications.show({
          title: `Image Maximum Reached`,
          color: "orange",
          icon: <IconX />,
          message: "Maximum of 3 images allowed per review.",
        });
        files = files.slice(0, 3 - form.values.files.length);
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

  const createReviewMutation = useCreateReview();
  const UpdateReviewMutation = useUpdateReview();
  const createOrUpdateReview = async (
    payload: CreateReviewPayload | UpdateReviewPayload,
  ) => {
    try {
      if (!isUpdate) {
        await createReviewMutation.mutateAsync(payload as CreateReviewPayload);
      } else {
        await UpdateReviewMutation.mutateAsync(payload as UpdateReviewPayload);
      }
      if (onCreateOrUpdate) await onCreateOrUpdate();
      handleModalClose();
      router.push(`/customer/orders/${orderItem?.orderItemId}`);
      notifications.show({
        title: `Review ${isUpdate ? "Updated" : "Created"}`,
        color: "green",
        icon: <IconCheck />,
        message: isUpdate
          ? "Your review has been updated"
          : "Congratulations! You have left a review.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(
          `Error ${isUpdate ? "Updated" : "Created"} Review`,
          error,
        ),
      });
    }
  };

  type formValues = typeof form.values;
  function handleSubmit(values: formValues) {
    let payload;
    if (!isUpdate) {
      payload = {
        orderItemId: orderItem.orderItemId,
        title: values.title,
        comment: values.comment,
        rating: values.rating,
        files: values.files,
      } as CreateReviewPayload;
    } else {
      payload = {
        reviewId: orderItem.review.reviewId,
        title: values.title,
        comment: values.comment,
        rating: values.rating,
        files: values.files,
      } as UpdateReviewPayload;
    }
    createOrUpdateReview(payload);
  }

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      centered
      size="80vh"
      closeOnEscape={false}
      closeOnClickOutside={false}
    >
      <Accordion
        multiple
        variant="filled"
        value={OPEN_FOREVER}
        onChange={() => {}}
        chevronSize={0}
      >
        <Box mt={-25}>
          <OrderItemCardMini orderItem={orderItem} viewOnly={true} />
        </Box>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Accordion.Item value="content" mt={-35} pl={30} pr={30} pt={15}>
            <Group mb="sm" position="apart">
              <Center>
                <Text fw={600} size="xl">
                  Review Product
                </Text>
                <OrderItemPopover
                  text={`Please ensure that you remain respectful, truthful, and constructive in your review. Do not give irrelevant feedback, use offensive language or photos, or disclose any personal information. Failure to comply might result in your review getting removed.`}
                />
              </Center>
              <Box>
                <Text fw={400} size="sm" mb={3} align="center">
                  {ratingTextMap[form.values.rating] || ""}
                </Text>
                <Rating
                  emptySymbol={
                    <IconPaw
                      size="2rem"
                      color={theme.colors.yellow[7]}
                      strokeWidth={1.5}
                    />
                  }
                  fullSymbol={
                    <IconPaw
                      size="2rem"
                      color={theme.colors.yellow[7]}
                      fill={theme.colors.yellow[4]}
                      strokeWidth={1.5}
                    />
                  }
                  {...form.getInputProps("rating")}
                />
              </Box>
            </Group>
            <Box mb="sm">
              <Text fw={500} size="md" mb={3}>
                Title
              </Text>
              <TextInput
                data-autofocus
                withAsterisk
                placeholder="What&#39;s most important to know?"
                {...form.getInputProps("title")}
              />
            </Box>
            <Box mb="sm">
              <Text fw={500} size="md" mb={3}>
                Comment
              </Text>
              <Textarea
                withAsterisk
                autosize
                minRows={3}
                maxRows={3}
                placeholder="What did you like or dislike? Share your thoughts!"
                {...form.getInputProps("comment")}
              />
            </Box>
            <Box>
              <Text fw={500} size="md" mb={3}>
                Add photos
              </Text>
              <FileInput
                placeholder={
                  imagePreview.length == 0
                    ? "+ Upload an image or two to help others visualize your experience"
                    : `You have uploaded ${imagePreview.length} images`
                }
                accept="image/*"
                name="images"
                multiple
                onChange={(files) => handleFileInputChange(files)}
                capture={false}
                key={fileInputKey}
                mb="md"
                error={form.errors?.files}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {imagePreview &&
                  imagePreview.length > 0 &&
                  imagePreview.map((imageUrl, index) => (
                    <div
                      key={index}
                      style={{ flex: "0 0 calc(33.33% - 10px)" }}
                    >
                      <Card style={{ maxWidth: "100%" }} mb="xs">
                        <Group position="right">
                          <CloseButton
                            size="md"
                            color="red"
                            onClick={() => removeImage(index)}
                          />
                        </Group>

                        <Image
                          src={imageUrl}
                          alt={`Image Preview ${index}`}
                          style={{
                            maxWidth: "100%",
                            display: "block",
                            width: "100px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </Card>
                    </div>
                  ))}
              </div>
            </Box>
          </Accordion.Item>
          <Box mb="xs" mt="xl">
            <Button
              fullWidth
              color="dark"
              className="gradient-hover"
              type="submit"
            >
              {!isUpdate ? "Submit Review" : "Update Review"}
            </Button>
          </Box>
        </form>
      </Accordion>
    </Modal>
  );
};

export default ReviewModal;
