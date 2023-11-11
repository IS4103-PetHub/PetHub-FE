import {
  Container,
  Grid,
  Group,
  LoadingOverlay,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState, useMemo, useRef } from "react";
import {
  Article,
  ArticleTypeEnum,
  OrderItem,
  Pet,
  ServiceCategoryEnum,
  formatStringToLetterCase,
} from "shared-utils";
import { getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import api from "@/api/axiosConfig";
import ArticleForm from "@/components/article/ArticleForm";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useCreateArticle } from "@/hooks/article";
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
  //   const RichTextEditor = useMemo(() => {
  //     return dynamic(() => import("@/components/article/RichTextEditor"), {
  //       loading: () => <></>,
  //       ssr: false,
  //     });
  //   }, []);

  // Permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  const createArticleMutation = useCreateArticle();

  // Data fetching
  const { data: tags = [] } = useGetAllTags();

  type FormValues = typeof form.values;
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      articleType: "",
      file: null,
      tags: [],
      categories: [],
      isPinned: false,
    },
    validate: {
      title: (value) => {
        const minLength = 1;
        const maxLength = 96;
        if (!value) return "Title is mandatory.";
        if (value.length < minLength || value.length > maxLength) {
          return `Title must be between ${minLength} and ${maxLength} characters.`;
        }
      },
      content: isNotEmpty("Content cannot be empty."),
      articleType: isNotEmpty("Article type is mandatory."),
    },
  });

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  //   const setFormFields = async () => {
  //     if (isUpdating) {
  //       form.setValues({
  //         title: post.title,
  //         description: post.description,
  //         requestType: post.requestType,
  //         lastSeenDate: new Date(post.lastSeenDate),
  //         lastSeenLocation: post.lastSeenLocation,
  //         contactNumber: post.contactNumber,
  //         petId: post.petId?.toString() ?? "",
  //         isResolved: post.isResolved,
  //       });

  //       if (post.attachmentURLs.length > 0) {
  //         const newFile: File = await downloadPromise(
  //           post.attachmentKeys[0],
  //           post.attachmentURLs[0],
  //         );
  //         if (newFile) {
  //           handleFileInputChange(newFile);
  //         }
  //       }
  //       return;
  //     }
  //     form.setFieldValue("contactNumber", petOwner?.contactNumber);
  //     form.setFieldValue("file", null);
  //   };

  const handleCreateArticle = async (values: FormValues) => {
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
      console.log("payload", payload);
      const data = await createArticleMutation.mutateAsync(payload);
      notifications.show({
        title: "Article Published",
        color: "green",
        icon: <IconCheck />,
        message: `This article will now be visible to all users`,
      });
      router.push(`/admin/articles`);
    } catch (error: any) {
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

        <ArticleForm form={form} tags={tags} onSubmit={handleCreateArticle} />
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
