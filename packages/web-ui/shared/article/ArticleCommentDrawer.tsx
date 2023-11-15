import {
  Button,
  Container,
  Group,
  useMantineTheme,
  Image,
  Avatar,
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
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import {
  Article,
  ArticleComment,
  PetOwner,
  Tag,
  calculateArticleEstimatedReadingTime,
  displayArticleDate,
  formatISODayDateTime,
  formatStringToLetterCase,
  validateArticleComment,
} from "shared-utils";
import { CreateUpdateArticleCommentPayload } from "../../../../apps/pethub-main/src/types/types";
import { PageTitle } from "../PageTitle";
import ArticleCommentCard from "./ArticleCommentCard";

interface ArticleCommentDrawerProps {
  opened: boolean;
  onClose: () => void;
  article: any;
  publishComment?: (
    payload: CreateUpdateArticleCommentPayload,
  ) => Promise<void>;
  updateComment?: (payload: CreateUpdateArticleCommentPayload) => Promise<void>;
  deleteComment?: (articleCommentId: number) => Promise<void>;
  petOwner?: PetOwner;
  petOwnerArticleCommentIds?: number[];
}

const ArticleCommentDrawer = ({
  article,
  opened,
  onClose,
  publishComment,
  updateComment,
  deleteComment,
  petOwner,
  petOwnerArticleCommentIds,
}: ArticleCommentDrawerProps) => {
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      comment: "",
    },
    validate: {
      comment: (value) => validateArticleComment(value),
    },
  });

  type formValues = typeof form.values;
  async function handleSubmit(values: formValues) {
    const payload: CreateUpdateArticleCommentPayload = {
      articleId: article?.articleId,
      comment: values.comment,
    };
    await publishComment(payload);
    form.reset();
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size={20}>
          Comments ({petOwnerArticleCommentIds?.length})
        </Text>
      }
      position="right"
      size="45vh"
      lockScroll={false}
      styles={{
        // Styles API (We don't want the thing cutting through header)
        inner: { marginTop: rem(80) },
      }}
      shadow="lg"
      overlayProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.2)" }, // Just a slight darken for the page when opened
      }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Card shadow="xs" withBorder mt="xs" mb="xs">
          <Group>
            <Avatar radius="xl" size="md" mr={-5} color="blue" />
            <Text size="sm" fw={500}>
              {petOwner?.firstName} {petOwner?.lastName}
            </Text>
          </Group>
          <Textarea
            variant="unstyled"
            size="sm"
            autosize
            sx={{ length: "100%" }}
            minRows={3}
            maxLength={500}
            placeholder="Write your thoughts on the article here"
            styles={(theme) => ({
              input: {
                backgroundColor: "white",
                color: theme.colors.dark[9],
              },
            })}
            {...form.getInputProps("comment")}
          />
          <Group position="apart">
            <Text color="dimmed" size="sm">
              {form.values.comment.length} / 500 characters
            </Text>
            <Button radius="xl" type="submit">
              Post
            </Button>
          </Group>
        </Card>
      </form>
      <Box>
        {article?.articleComments
          .map((articleComment: ArticleComment) => (
            <ArticleCommentCard
              key={articleComment?.articleCommentId}
              articleComment={articleComment}
              updateComment={updateComment}
              deleteComment={deleteComment}
            />
          ))
          .reverse()}
      </Box>
    </Drawer>
  );
};

export default ArticleCommentDrawer;
