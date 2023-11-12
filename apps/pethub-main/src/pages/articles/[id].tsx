import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEye } from "@tabler/icons-react";
import { IconWriting } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  Article,
  OrderItem,
  Pet,
  formatISODateLong,
  formatISODayDateTime,
  formatISOLongWithDay,
} from "shared-utils";
import { getErrorMessageProps } from "shared-utils";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import PublishedArticleView from "web-ui/shared/article/PublishedArticleView";
import ViewOrderDetails from "web-ui/shared/order-management/ViewOrderDetails";
import api from "@/api/axiosConfig";
import { useGetArticleById } from "@/hooks/article";

interface ArticleDetailsProps {}

export default function ArticleDetails({}: ArticleDetailsProps) {
  const router = useRouter();
  const articleId = Number(router.query.id);

  const { data: article, refetch: refetchArticle } =
    useGetArticleById(articleId);

  if (!articleId) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {articleId} - {article?.title}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid mb="lg" mr="lg" ml="lg" mt="md">
        <Group position={"apart"} mb="md">
          <LargeBackButton
            text="Back to Articles"
            onClick={() => {
              router.push("/articles");
            }}
            size="md"
          />
        </Group>

        <PublishedArticleView article={article} />
      </Container>
    </>
  );
}
