import {
  Container,
  Grid,
  Group,
  LoadingOverlay,
  useMantineTheme,
} from "@mantine/core";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState, useMemo } from "react";
import {
  Article,
  ArticleTypeEnum,
  OrderItem,
  Pet,
  ServiceCategoryEnum,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import api from "@/api/axiosConfig";
import ArticleSettingsBar from "@/components/article/ArticleSettingsBar";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useGetAllTags } from "@/hooks/tag";
import { PermissionsCodeEnum } from "@/types/constants";
import { PetOwner, Permission } from "@/types/types";

interface CreateArticleProps {
  permissions: Permission[];
}

export default function CreateArticle({ permissions }: CreateArticleProps) {
  const router = useRouter();
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("@/components/article/RichTextEditor"), {
      loading: () => <></>,
      ssr: false,
    });
  }, []);

  // Permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  const [typeSelection, setTypeSelection] = useState<string>("");
  const [categorySelection, setCategorySelection] = useState<string>("");
  const [tagSelection, setTagSelection] = useState<string>("");
  const [isPinned, setIsPinned] = useState(false);
  const [article, setArticle] = useState("");

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>Create New Article</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid m="xl">
        <Group position="apart" mb="md">
          <LargeBackButton
            text="Back to Articles"
            onClick={() => {
              router.push("/admin/articles");
            }}
            size="md"
            mt={20}
          />
          <LargeCreateButton
            text="Publish Article"
            onClick={() => {
              router.push("/admin/articles");
            }}
            size="md"
            mt={20}
          />
        </Group>
        <Grid>
          <Grid.Col span={3}>
            <PageTitle title="Create Article" mt={15} />
          </Grid.Col>
          <Grid.Col span={9}>
            <ArticleSettingsBar
              typeSelection={typeSelection}
              categorySelection={categorySelection}
              tagSelection={tagSelection}
              isPinned={isPinned}
              setTypeSelection={setTypeSelection}
              setCategorySelection={setCategorySelection}
              setTagSelection={setTagSelection}
              handlePin={handlePin}
            />
          </Grid.Col>
        </Grid>

        <RichTextEditor article={article} setArticle={setArticle} />
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

  return { props: { permissions } };
}
