import {
  Button,
  Group,
  useMantineTheme,
  Text,
  Box,
  Drawer,
  rem,
  Card,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { ArticleComment, PetOwner, validateArticleComment } from "shared-utils";
import { CreateUpdateArticleCommentPayload } from "../../../../apps/pethub-main/src/types/types";
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
  isAdminView?: boolean;
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
  isAdminView,
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
          Comments ({article?.articleComments?.length})
        </Text>
      }
      position="right"
      size="45vh"
      lockScroll={false}
      styles={
        !isAdminView
          ? {
              // Styles API (We don't want the thing cutting through header for PO view)
              inner: { marginTop: rem(80) },
            }
          : undefined
      }
      shadow="lg"
      overlayProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.2)" }, // Just a slight darken for the page when opened
      }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Card
          shadow="xs"
          withBorder
          mt="xs"
          mb="xs"
          display={isAdminView ? "none" : "block"}
        >
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
              petOwner={petOwner}
              isOwner={petOwnerArticleCommentIds?.includes(
                articleComment?.articleCommentId,
              )}
              isAdminView={isAdminView}
            />
          ))
          .reverse()}
      </Box>
    </Drawer>
  );
};

export default ArticleCommentDrawer;
