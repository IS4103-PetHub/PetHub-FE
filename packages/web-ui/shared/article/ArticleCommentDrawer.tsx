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
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import {
  Article,
  Tag,
  calculateArticleEstimatedReadingTime,
  displayArticleDate,
  formatISODayDateTime,
  formatStringToLetterCase,
  validateArticleComment,
} from "shared-utils";
import { CreateUpdateArticleCommentPayload } from "../../../../apps/pethub-main/src/types/types";
import { PageTitle } from "../PageTitle";

interface ArticleCommentDrawerProps {
  opened: boolean;
  onClose: () => void;
  article: any;
  publishComment?: (
    payload: CreateUpdateArticleCommentPayload,
  ) => Promise<void>;
}

const ArticleCommentDrawer = ({
  article,
  opened,
  onClose,
  publishComment,
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
      comment: values.comment,
    };
    await publishComment(payload);
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size={20}>
          Comments (x)
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
        <Card>
          <Avatar />
        </Card>
      </form>
    </Drawer>
  );
};

export default ArticleCommentDrawer;
