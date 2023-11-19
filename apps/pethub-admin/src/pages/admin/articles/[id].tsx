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
import { useState } from "react";
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
import ViewOrderDetails from "web-ui/shared/order-management/ViewOrderDetails";
import api from "@/api/axiosConfig";
import ArticleForm from "@/components/article/ArticleForm";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import {
  useDeleteArticleComment,
  useGetAllArticles,
  useGetArticleById,
  useUpdateArticle,
} from "@/hooks/article";
import { PermissionsCodeEnum } from "@/types/constants";
import {
  PetOwner,
  Permission,
  CreateOrUpdateArticlePayload,
} from "@/types/types";

interface ArticleDetailsProps {
  userId: number;
  permissions: Permission[];
}

export default function ArticleDetails({
  userId,
  permissions,
}: ArticleDetailsProps) {
  const router = useRouter();

  const articleId = Number(router.query.id);

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  const [isPreviewing, toggleIsPreviewing] = useToggle([false, true]);
  const [loading, setLoading] = useState<boolean>(false);

  const updateArticleMutation = useUpdateArticle();
  const deleteArticleCommentMutation = useDeleteArticleComment();

  // Data fetching hooks
  const { data: article, refetch: refetchArticle } =
    useGetArticleById(articleId);
  const {
    data: articles = [],
    refetch: refetchArticles,
    isLoading,
  } = useGetAllArticles();

  if (!articleId) {
    return null;
  }

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const handleUpdateArticle = async (values: any) => {
    if (!canWrite) {
      notifications.show({
        title: "No Write Permissions",
        color: "red",
        icon: <IconCheck />,
        message: `You do not have permissions to update articles.`,
      });
      return;
    }

    try {
      const payload: CreateOrUpdateArticlePayload = {
        articleId: articleId,
        title: values.title,
        articleType: values.articleType,
        content: values.content,
        category: values.category,
        tags: values.tags,
        file: values.file,
        isPinned: values.isPinned,
        internalUserId: userId,
      };
      setLoading(true);
      const data = await updateArticleMutation.mutateAsync(payload);
      notifications.show({
        title: "Article Updated",
        color: "green",
        icon: <IconCheck />,
        message: `All changes have been saved`,
      });
      await refetchArticle();
      await refetchArticles();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      notifications.show({
        ...getErrorMessageProps("Error Updating Article", error),
      });
    }
  };

  const handleDeleteArticleComment = async (articleCommentId: number) => {
    if (!canWrite) {
      notifications.show({
        title: "No Write Permissions",
        color: "red",
        icon: <IconCheck />,
        message: `You do not have permissions to delete comments.`,
      });
      return;
    }

    try {
      await deleteArticleCommentMutation.mutateAsync(articleCommentId);
      await refetchArticle();
      notifications.show({
        title: `Comment Deleted`,
        color: "green",
        icon: <IconCheck />,
        message:
          "Article comment has been removed. Email notification has been sent to the user.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Deleting Comment`, error),
      });
    }
  };

  return (
    <>
      <Head>
        <title>
          {articleId} - {article?.title}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid mb="lg" mr="lg" ml="lg" mt="md">
        <LoadingOverlay
          loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
          overlayBlur={2}
          visible={isLoading}
        />
        <Group position={"apart"} mb="md">
          <LargeBackButton
            text="Back to Articles"
            onClick={() => {
              router.push("/admin/articles");
            }}
            size="md"
          />

          {isPreviewing ? (
            <Button
              leftIcon={<IconEye size="1rem" />}
              miw={150}
              size="md"
              variant="light"
              onClick={() => toggleIsPreviewing()}
            >
              Exit Preview
            </Button>
          ) : (
            <Stack style={{ textAlign: "right" }}>
              <Text size="sm" color="dimmed" mb={-15}>
                Published by [{article?.createdBy.firstName}{" "}
                {article?.createdBy.lastName}]
              </Text>
              <Text size="sm" color="dimmed">
                {formatISODayDateTime(article?.dateCreated)}
              </Text>
            </Stack>
          )}
        </Group>

        <ArticleForm
          isPreviewing={isPreviewing}
          toggleIsPreviewing={toggleIsPreviewing}
          article={article}
          onSubmit={handleUpdateArticle}
          deleteComment={handleDeleteArticleComment}
        />
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;

  return { props: { userId, permissions } };
}
