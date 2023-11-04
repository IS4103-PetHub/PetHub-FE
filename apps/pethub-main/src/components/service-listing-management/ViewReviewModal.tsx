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
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPaw, IconPawFilled, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  OrderItem,
  Review,
  downloadFile,
  getErrorMessageProps,
} from "shared-utils";
import {
  useCreateReview,
  useReplyReview,
  useUpdateReview,
} from "@/hooks/review";
import {
  CreateReviewPayload,
  ReplyReviewPayload,
  UpdateReviewPayload,
} from "@/types/types";
import {
  validateReviewComment,
  validateReviewFiles,
  validateReviewRating,
  validateReviewTitle,
} from "@/util";
import OrderItemCardMini from "../order/OrderItemCardMini";
import OrderItemPopover from "../order/OrderItemPopover";
import ReviewItem from "../review/ReviewItem";
import StarRating from "../review/StarRating";

interface ViewReviewModalProps {
  review: Review;
  opened: boolean;
  onClose: () => void;
  refetch: () => Promise<any>;
}

const ViewReviewModal = ({
  review,
  opened,
  onClose,
  refetch,
}: ViewReviewModalProps) => {
  const [isReplying, toggleIsReplying] = useToggle();

  const isUpdate = !!review?.reply;

  const OPEN_FOREVER = ["review", "reply"];

  const form = useForm({
    initialValues: {
      reply: "",
    },
    validate: {
      reply: (value) => validateReviewComment(value),
    },
  });

  useEffect(() => {
    if (review?.reply) {
      form.setValues({
        ...form.values,
        reply: review.reply,
      });
    } else {
      form.reset();
    }
  }, [review, opened, isReplying]);

  const replyReviewMutation = useReplyReview();
  const replyReview = async (payload: ReplyReviewPayload) => {
    try {
      await replyReviewMutation.mutateAsync(payload);
      notifications.show({
        title: `Reply ${isUpdate ? "Updated" : "sent"}`,
        color: "green",
        icon: <IconCheck />,
        message: isUpdate
          ? "Your reply has been updated"
          : "Congratulations! You have left a reply.",
      });
      toggleIsReplying();
      await refetch();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(
          `Error ${isUpdate ? "Updated" : "Sent"} Reply`,
          error,
        ),
      });
    }
  };

  type formValues = typeof form.values;
  async function handleSubmit(values: formValues) {
    const payload: ReplyReviewPayload = {
      reviewId: review.reviewId,
      reply: values.reply,
    };
    await replyReview(payload);
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="120vh"
      closeOnEscape={false}
      closeOnClickOutside={false}
      title={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Text size="sm" fw={600}>
            Review Details ID. {review?.reviewId}
          </Text>
          <OrderItemPopover
            text={`Please ensure that you remain respectful, truthful, and constructive in your replies. Crafting a thoughtful response can positively impact your brand's reputation.`}
          />
        </Box>
      }
    >
      <Group position="right" mt="xs" mb="xs">
        <Text size="sm">
          As an pet business, you have the opportunity to respond to this
          review. Your response will appear directly below the customer&apos;s
          review, providing context or addressing any concerns raised. Below is
          how the review currently looks like in the service listing page.
        </Text>
      </Group>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Accordion
          multiple
          variant="filled"
          value={OPEN_FOREVER}
          onChange={() => {}}
          chevronSize={0}
        >
          <Accordion.Item value="review" pl={30} pr={30} pt={15}>
            <Group mb="sm">
              <Center>
                <Text fw={600} size="xl">
                  {review?.title}
                </Text>
              </Center>
            </Group>

            <ReviewItem
              review={review}
              isLikedByUser={false}
              isReportedByUser={false}
              hideIconButtons={true}
            />
          </Accordion.Item>

          {isReplying && (
            <Accordion.Item value="reply" pl={30} pr={30} pt={15} pb={15}>
              <Textarea
                placeholder="Input your reply here..."
                minRows={3}
                maxRows={3}
                autosize
                {...form.getInputProps("reply")}
              />
              <Text color="dimmed" size="sm" align="right">
                {form.values.reply.length} / 2000 characters
              </Text>
            </Accordion.Item>
          )}
        </Accordion>
        <Group position="right" mt="xs">
          <Button
            miw={150}
            color={isReplying ? "red" : "indigo"}
            variant={isReplying ? "light" : "filled"}
            onClick={() => toggleIsReplying()}
          >
            {isReplying
              ? "Cancel"
              : isUpdate
              ? "Update your reply"
              : "Reply to review"}
          </Button>
          {isReplying && (
            <Button miw={150} type="submit">
              {isUpdate ? "Update reply" : "Submit reply"}
            </Button>
          )}
        </Group>
      </form>
    </Modal>
  );
};

export default ViewReviewModal;
