import {
  Container,
  Grid,
  Group,
  MultiSelect,
  Select,
  Transition,
} from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  AccountTypeEnum,
  EMPTY_STATE_DELAY_MS,
  Article,
  ServiceCategoryEnum,
  TABLE_PAGE_SIZE,
  formatEnumValueToLowerCase,
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
  ArticleTypeEnum,
} from "shared-utils";
import { getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import ArticleManagementTable from "@/components/article/ArticleManagementTable";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { useDeleteArticle, useGetAllArticles } from "@/hooks/article";
import { useGetAllInternalUsers } from "@/hooks/internal-user";
import { useGetAllPetBusinesses } from "@/hooks/pet-business";
import { useGetAllTags } from "@/hooks/tag";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface ArticlesProps {
  permissions: Permission[];
}

export default function Articles({ permissions }: ArticlesProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteArticles);
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadArticles);

  // Data fetching hooks
  const {
    data: articles = [],
    refetch: refetchArticles,
    isLoading,
  } = useGetAllArticles();
  const { data: internalUsers = [] } = useGetAllInternalUsers();
  const { data: tags = [] } = useGetAllTags();

  // Filter states and options
  const ARTICLE_TYPE_LABELS = Object.values(ArticleTypeEnum).join(",");
  const ARTICLE_TYPE_VALUES = Object.values(ArticleTypeEnum).map((type) =>
    formatStringToLetterCase(type.toString()),
  );

  const CATEGORY_TYPE_LABELS = Object.values(ServiceCategoryEnum).join(",");
  const CATEGORY_TYPE_VALUES = Object.values(ServiceCategoryEnum).map(
    (category) => formatStringToLetterCase(category.toString()),
  );

  const [typeFilter, setTypeFilter] = useState<string>(ARTICLE_TYPE_LABELS);
  const [categoryFilter, setCategoryFilter] =
    useState<string>(CATEGORY_TYPE_LABELS);
  const [tagFilter, setTagFilter] = useState<string>("");
  const [internalUserFilter, setInternalUserFilter] =
    useState<number>(undefined);

  const internalUserOptions = internalUsers.map((internalUser) => ({
    value: internalUser.userId.toString(),
    label: internalUser.firstName + " " + internalUser.lastName,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.tagId.toString(),
    label: tag.name,
  }));

  // Search, sort and pagination states
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Article[]>(articles);
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "articleId",
    direction: "asc",
  });
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const deleteArticleMutation = useDeleteArticle(queryClient);

  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedArticles = sortBy(searchResults, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedArticles.reverse();
    }
    const newRecords = sortedArticles.slice(from, to);
    setRecords(newRecords);
  }, [page, sortStatus, articles, searchResults]);

  useEffect(() => {
    handleSearch(searchString);
    const timer = setTimeout(() => {
      if (articles.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [articles]);

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(articles);
      setPage(1);
      return;
    }

    setIsSearching(true);
    const results = searchArticles(articles, searchStr);
    setSearchResults(results);
    setPage(1);
  };

  function searchArticles(articles: Article[], searchStr: string) {
    return articles.filter((Article: Article) => {
      return (
        Article.title.toLowerCase().includes(searchStr.toLowerCase()) ||
        Article.articleId.toString().includes(searchStr.toLowerCase())
      );
    });
  }

  const handleDeleteArticle = async (articleId: number) => {
    try {
      await deleteArticleMutation.mutateAsync(articleId);
      notifications.show({
        title: `Article Deleted`,
        color: "green",
        icon: <IconCheck />,
        message:
          "This article has been removed and will no longer be available to view.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Deleting Article`, error),
      });
    }
  };

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const renderContent = () => {
    if (articles.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage title="No Articles Found" subtitle="" />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>
            <ArticleManagementTable
              records={records}
              totalNumArticle={searchResults.length}
              page={page}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              onPageChange={setPage}
              onDelete={handleDeleteArticle}
              canWrite={canWrite}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Articles - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart" mb="md">
          <PageTitle title="Article Management" />
          {canWrite && (
            <LargeCreateButton
              text="Create New Article"
              onClick={() => router.push(`${router.asPath}/create`)}
            />
          )}
        </Group>
        <Grid mb={5}>
          <Grid.Col span={6}>
            <Select
              size="md"
              label="Author"
              placeholder="Select author"
              data={internalUserOptions}
              clearable
              onChange={(selectedInternalUser) => {
                if (selectedInternalUser === null) {
                  setInternalUserFilter(undefined);
                } else {
                  setInternalUserFilter(Number(selectedInternalUser));
                }
              }}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              size="md"
              label="Filter by Tag"
              placeholder="Select tags"
              data={tagOptions}
              onChange={(selectedTag) => {
                if (selectedTag === null) {
                  setTagFilter(undefined);
                } else {
                  const tagFilterValues = selectedTag.map((tag) =>
                    formatLetterCaseToEnumString(tag),
                  );
                  setTagFilter(tagFilterValues.join(","));
                }
              }}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              size="md"
              label="Filter by Category"
              placeholder="Select categories"
              data={CATEGORY_TYPE_VALUES}
              onChange={(selectedCategory) => {
                if (selectedCategory.length === 0) {
                  setCategoryFilter(CATEGORY_TYPE_LABELS);
                } else {
                  const categoryFilterValues = selectedCategory.map(
                    (category) => formatLetterCaseToEnumString(category),
                  );
                  setCategoryFilter(categoryFilterValues.join(","));
                }
              }}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <SearchBar
              text="Search by Article ID or title"
              onSearch={handleSearch}
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              mt={-4.5}
              size="md"
              label="Filter by Type"
              placeholder="Select article type"
              data={ARTICLE_TYPE_VALUES}
              onChange={(selectedType) => {
                if (selectedType.length === 0) {
                  setTypeFilter(ARTICLE_TYPE_LABELS);
                } else {
                  // If selections are made, join them into a comma-separated string
                  const typeFilterValues = selectedType.map((type) =>
                    formatLetterCaseToEnumString(type),
                  );
                  setTypeFilter(typeFilterValues.join(","));
                }
              }}
            />
          </Grid.Col>
        </Grid>
        {renderContent()}
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
