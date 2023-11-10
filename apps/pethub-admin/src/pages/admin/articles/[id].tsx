import { useMantineTheme } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Article, OrderItem, Pet } from "shared-utils";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import ViewOrderDetails from "web-ui/shared/order-management/ViewOrderDetails";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { PermissionsCodeEnum } from "@/types/constants";
import { PetOwner, Permission } from "@/types/types";

interface ArticleDetailsProps {
  article: Article;
  permissions: Permission[];
}

export default function ArticleDetails({
  article,
  permissions,
}: ArticleDetailsProps) {
  const router = useRouter();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>
          {article.articleId} - {article.title}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LargeBackButton
        text="Back to Articles"
        onClick={() => {
          router.push("/admin/articles");
        }}
        size="sm"
        mb="md"
      />
      Article details here
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

  return { props: { permissions } };
}
