import {
  Button,
  Container,
  Group,
  useMantineTheme,
  Image,
  Avatar,
  ActionIcon,
  Stack,
  Text,
  Box,
  Divider,
  Badge,
  Drawer,
  rem,
  createStyles,
  Card,
  Textarea,
  Menu,
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconDots,
  IconPencil,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Article,
  ArticleComment,
  PetOwner,
  Tag,
  calculateArticleEstimatedReadingTime,
  displayArticleCommentDate,
  displayArticleDate,
  formatISODateTimeShort,
  formatISODayDateTime,
  formatStringToLetterCase,
  validateArticleComment,
} from "shared-utils";
import { CreateUpdateArticleCommentPayload } from "../../../../apps/pethub-main/src/types/types";
import { PageTitle } from "../PageTitle";

interface ArticleCommentCardProps {
  articleComment: ArticleComment;
  isOwner: boolean;
  updateComment?: (payload: CreateUpdateArticleCommentPayload) => Promise<void>;
  deleteComment?: (articleCommentId: number) => Promise<void>;
  petOwner?: PetOwner;
  isAdminView?: boolean;
}

const ArticleCommentCard = ({
  articleComment,
  updateComment,
  deleteComment,
  petOwner,
  isOwner,
  isAdminView,
}: ArticleCommentCardProps) => {
  const theme = useMantineTheme();
  const [isEditing, setIsEditing] = useState(false);

  const [showFullComment, toggleShowFullComment] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);
  const NUM_CLAMP_LINES = 5;

  const form = useForm({
    initialValues: {
      comment: articleComment?.comment,
    },
    validate: {
      comment: (value) => validateArticleComment(value),
    },
  });

  useEffect(() => {
    form.setFieldValue("comment", articleComment?.comment);
  }, [articleComment]);

  // This is a hacky way to check if the text exceeds 5 lines in the DOM
  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 5 lines
      if (textHeight > lineHeight * NUM_CLAMP_LINES) {
        setTextExceedsLineClamp(true);
      }
    }
  }, [articleComment?.comment]);

  type formValues = typeof form.values;
  async function handleSubmit(values: formValues) {
    const payload: CreateUpdateArticleCommentPayload = {
      articleCommentId: articleComment?.articleCommentId,
      comment: values.comment,
    };
    await updateComment(payload);
    setIsEditing(false);
    form.setFieldValue("comment", values.comment);
  }

  return (
    <Card>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Group position="apart">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar radius="xl" size="md" mr={10} color="blue" />
            <Box>
              <Text size={13} fw={500}>
                {articleComment?.petOwner?.firstName}{" "}
                {articleComment?.petOwner?.lastName}
              </Text>
              <Text size={11}>
                {displayArticleCommentDate(articleComment?.dateCreated)}{" "}
                {articleComment?.dateUpdated && "(edited)"}
              </Text>
            </Box>
          </Box>
          {!isEditing && (isOwner || isAdminView) && (
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size="1rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => setIsEditing(true)}
                  icon={<IconPencil size={rem(14)} color="blue" />}
                  display={isAdminView ? "none" : "block"}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  icon={<IconTrash size={rem(14)} color="red" />}
                  onClick={() =>
                    deleteComment(articleComment?.articleCommentId)
                  }
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
        <Box mt="sm">
          {isEditing ? (
            <Box>
              <Textarea
                variant="default"
                size="sm"
                autosize
                sx={{ length: "100%" }}
                maxLength={500}
                styles={(theme) => ({
                  input: {
                    backgroundColor: "white",
                    color: theme.colors.dark[9],
                  },
                })}
                {...form.getInputProps("comment")}
              />
              <Group position="right" mt="xs">
                <Button
                  color="red"
                  onClick={() => setIsEditing(false)}
                  compact
                  variant="light"
                  size="xs"
                  miw={60}
                  mr={-10}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  compact
                  size="xs"
                  variant="light"
                  miw={60}
                >
                  Edit
                </Button>
              </Group>
            </Box>
          ) : (
            <Box>
              <Text
                size="sm"
                lineClamp={showFullComment ? 0 : NUM_CLAMP_LINES}
                ref={textRef}
              >
                {articleComment?.comment}
              </Text>
              <Group position="right">
                <Button
                  compact
                  variant="subtle"
                  color="blue"
                  size="xs"
                  onClick={() => toggleShowFullComment()}
                  mt="xs"
                  mr="xs"
                  display={textExceedsLineClamp ? "block" : "none"}
                >
                  {showFullComment ? "View less" : "View more"}
                </Button>
              </Group>
            </Box>
          )}
        </Box>
        <Divider mt="lg" mb={-10} />
      </form>
    </Card>
  );
};

export default ArticleCommentCard;
