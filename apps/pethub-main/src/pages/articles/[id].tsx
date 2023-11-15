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
  AccountTypeEnum,
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
import {
  useCreateArticleComment,
  useDeleteArticleComment,
  useGetArticleById,
  useGetArticleCommentsIdByArticleIdAndPetOwnerId,
  useUpdateArticleComment,
} from "@/hooks/article";
import { useGetPetOwnerByIdAndAccountType } from "@/hooks/pet-owner";
import { CreateUpdateArticleCommentPayload } from "@/types/types";

interface ArticleDetailsProps {
  userId: number;
}

export default function ArticleDetails({ userId }: ArticleDetailsProps) {
  const router = useRouter();
  const articleId = Number(router.query.id);

  const ARTICLE_MARGIN = 300;

  const createArticleCommentMutation = useCreateArticleComment();
  const updateArticleCommentMutation = useUpdateArticleComment();
  const deleteArticleCommentMutation = useDeleteArticleComment();

  const { data: article, refetch: refetchArticle } =
    useGetArticleById(articleId);
  const {
    data: petOwnerArticleCommentIds = [],
    refetch: refetchPetOwnerArticleCommentIds,
  } = useGetArticleCommentsIdByArticleIdAndPetOwnerId(articleId, userId);
  const { data: petOwner, refetch: refetchPetOwner } =
    useGetPetOwnerByIdAndAccountType(userId, AccountTypeEnum.PetOwner);

  const createArticleComment = async (
    payload: CreateUpdateArticleCommentPayload,
  ) => {
    try {
      await createArticleCommentMutation.mutateAsync(payload);
      await refetchArticle();
      await refetchPetOwnerArticleCommentIds();
      notifications.show({
        title: `Comment Published`,
        color: "green",
        icon: <IconCheck />,
        message:
          "Your comment has been published and is now visible to the public.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Publishing Comment`, error),
      });
    }
  };

  const updateArticleComment = async (
    payload: CreateUpdateArticleCommentPayload,
  ) => {
    try {
      await updateArticleCommentMutation.mutateAsync(payload);
      await refetchArticle();
      await refetchPetOwnerArticleCommentIds();
      notifications.show({
        title: `Comment Updated`,
        color: "green",
        icon: <IconCheck />,
        message: "Your comment has been updated.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Updating Comment`, error),
      });
    }
  };

  const deleteArticleComment = async (articleCommentId: number) => {
    try {
      await deleteArticleCommentMutation.mutateAsync(articleCommentId);
      await refetchArticle();
      await refetchPetOwnerArticleCommentIds();
      notifications.show({
        title: `Comment Deleted`,
        color: "green",
        icon: <IconCheck />,
        message: "Your comment has been removed.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Deleting Comment`, error),
      });
    }
  };

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
        <Box ml={ARTICLE_MARGIN} mr={ARTICLE_MARGIN}>
          <PublishedArticleView
            article={article}
            publishComment={createArticleComment}
            updateComment={updateArticleComment}
            deleteComment={deleteArticleComment}
            petOwner={petOwner}
            petOwnerArticleCommentIds={petOwnerArticleCommentIds}
          />
        </Box>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: { userId: null } };
  const userId = session.user["userId"];

  return {
    props: { userId },
  };
}
