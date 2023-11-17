import { Button, Container, Group, LoadingOverlay } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState, useMemo, useRef } from "react";
import { getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import ArticleForm from "@/components/article/ArticleForm";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useCreateArticle, useGetAllArticles } from "@/hooks/article";
import { useGetAllTags } from "@/hooks/tag";
import { PermissionsCodeEnum } from "@/types/constants";
import {
  PetOwner,
  Permission,
  CreateOrUpdateArticlePayload,
} from "@/types/types";

interface CreateArticleProps {
  userId: number;
  permissions: Permission[];
}

export default function CreateArticle({
  userId,
  permissions,
}: CreateArticleProps) {
  const router = useRouter();
  // Permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  const [isPreviewing, toggleIsPreviewing] = useToggle();
  const [loading, setLoading] = useState<boolean>(false);

  // Data fetching hooks
  const {
    data: articles = [],
    refetch: refetchArticles,
    isLoading,
  } = useGetAllArticles();

  const createArticleMutation = useCreateArticle();

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const handleCreateArticle = async (values: any) => {
    try {
      const payload: CreateOrUpdateArticlePayload = {
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
      const data = await createArticleMutation.mutateAsync(payload);
      notifications.show({
        title: "Article Published",
        color: "green",
        icon: <IconCheck />,
        message: `This article will now be visible to all users. This article has also been emailed to all PetHub newsletter subscribers.`,
      });
      setLoading(false);
      await refetchArticles();
      router.push(`/admin/articles/${data.articleId}`);
    } catch (error: any) {
      setLoading(false);
      notifications.show({
        ...getErrorMessageProps("Error Publishing Article", error),
      });
    }
  };

  return (
    <>
      <Head>
        <title>Create New Article</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid mb="lg" mr="lg" ml="lg" mt="md">
        <LoadingOverlay
          loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
          overlayBlur={2}
          visible={isLoading}
        />
        <Group position={isPreviewing ? "right" : "apart"} mb="md">
          <LargeBackButton
            display={isPreviewing ? "none" : "block"}
            text="Back to Articles"
            onClick={() => {
              router.push("/admin/articles");
            }}
            size="md"
          />

          {isPreviewing && (
            <Button
              leftIcon={<IconEye size="1rem" />}
              miw={150}
              size="md"
              variant="light"
              onClick={() => toggleIsPreviewing()}
            >
              Exit Preview
            </Button>
          )}
        </Group>

        <ArticleForm
          isPreviewing={isPreviewing}
          toggleIsPreviewing={toggleIsPreviewing}
          onSubmit={handleCreateArticle}
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
