import { Container, Group, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Article, OrderItem, Pet } from "shared-utils";
import { getErrorMessageProps } from "shared-utils";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import ViewOrderDetails from "web-ui/shared/order-management/ViewOrderDetails";
import api from "@/api/axiosConfig";
import ArticleForm from "@/components/article/ArticleForm";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useGetArticleById, useUpdateArticle } from "@/hooks/article";
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

  const updateArticleMutation = useUpdateArticle();

  const { data: article, refetch: refetchArticle } =
    useGetArticleById(articleId);

  if (!articleId) {
    return null;
  }

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const handleUpdateArticle = async (values: any) => {
    try {
      const payload: CreateOrUpdateArticlePayload = {
        title: values.title,
        articleType: values.articleType,
        content: values.content,
        categories: values.categories,
        tags: values.tags,
        file: values.file,
        isPinned: values.isPinned,
        internalUserId: userId,
      };
      const data = await updateArticleMutation.mutateAsync(payload);
      notifications.show({
        title: "Article Updated",
        color: "green",
        icon: <IconCheck />,
        message: `This article has been updated`,
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Updating Article", error),
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
      <Container fluid mb="lg" mr="lg" ml="lg">
        <Group position="apart" mb="md">
          <LargeBackButton
            text="Back to Articles"
            onClick={() => {
              router.push("/admin/articles");
            }}
            size="md"
            mt={20}
          />
        </Group>

        <ArticleForm article={article} onSubmit={handleUpdateArticle} />
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
