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

  const articleOptions: any[] = [
    ...Object.values(ArticleTypeEnum).map((type) => ({
      value: type.toString(),
      label: formatStringToLetterCase(type),
    })),
  ];

  const categoryOptions: any[] = [
    ...Object.values(ServiceCategoryEnum).map((type) => ({
      value: type.toString(),
      label: formatStringToLetterCase(type),
    })),
    {
      value: null,
      label: "No Category",
    },
  ];

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [internalUserFilter, setInternalUserFilter] =
    useState<string>(undefined);

  const internalUserOptions = internalUsers.map((internalUser) => ({
    value: internalUser.firstName + " " + internalUser.lastName,
    label: internalUser.firstName + " " + internalUser.lastName,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.name,
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
    let filteredArticle = searchResults;
    if (tagFilter.length > 0) {
      filteredArticle = filteredArticle.filter(
        (article) =>
          article.tags &&
          article.tags.some((tag) => tagFilter.includes(tag.name)),
      );
      setIsSearching(true);
    }

    if (typeFilter.length > 0) {
      filteredArticle = filteredArticle.filter(
        (article) =>
          article.articleType && typeFilter.includes(article.articleType),
      );
      setIsSearching(true);
    }

    if (categoryFilter.length > 0) {
      filteredArticle = filteredArticle.filter((article) =>
        categoryFilter.includes(article.category),
      );
      setIsSearching(true);
    }

    if (internalUserFilter) {
      filteredArticle = filteredArticle.filter(
        (article) =>
          internalUserFilter ==
          `${article.createdBy.firstName} ${article.createdBy.lastName}`,
      );
      setIsSearching(true);
    }

    const sortedArticles = sortBy(filteredArticle, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedArticles.reverse();
    }
    const newRecords = sortedArticles.slice(from, to);
    setRecords(newRecords);
  }, [
    page,
    sortStatus,
    articles,
    searchResults,
    tagFilter,
    typeFilter,
    categoryFilter,
    internalUserFilter,
  ]);

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
                  setInternalUserFilter(selectedInternalUser);
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
              onChange={setTagFilter}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              size="md"
              label="Filter by Category"
              placeholder="Select categories"
              data={categoryOptions}
              onChange={setCategoryFilter}
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
              data={articleOptions}
              onChange={setTypeFilter}
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
