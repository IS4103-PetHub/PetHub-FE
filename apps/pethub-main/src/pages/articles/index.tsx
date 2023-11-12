import {
  Alert,
  Button,
  Container,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconExclamationCircle } from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Article, EMPTY_STATE_DELAY_MS, RefundStatusEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import ArticleCard from "@/components/article/ArticleCard";
import { useGetAllArticles } from "@/hooks/article";
import { useGetAllTags } from "@/hooks/tags";
import { articleSortOptions } from "@/types/constants";
import { sortRecords } from "@/util";

interface ArticlesProps {}

export default function Articles({}: ArticlesProps) {
  const theme = useMantineTheme();
  const [sortStatus, setSortStatus] = useState<string>("recent");
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  // States for infinite scroll and fake loading flag
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  // Data fetching
  const { data: articles = [], isLoading, refetch } = useGetAllArticles();
  const [records, setRecords] = useState<Article[]>(articles);

  useEffect(() => {
    // The reason we slice the array is because we want to display the records in batches for infinite scrolling
    setRecords(articles.slice(0, page * PAGE_SIZE));
  }, [articles, page, sortStatus]);

  useEffect(() => {
    document.body.style.background = theme.colors.gray[0];
    return () => {
      document.body.style.background = "";
    };
  }, []);

  // Scroll listeners for infinite scrolling, hooks into window scroll event
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [records, articles, sortStatus]);

  const setSortStatusWithReset = (status: string) => {
    setPage(1); // reset page when sorting
    setSortStatus(status);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (articles.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [articles]);

  // Display more records when user scrolls to bottom of page
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 && // 100px before the bottom of the page
      records.length < records.length // until not all records displayed yet
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const ArticleCards = records?.map((item) => (
    <Grid.Col key={item.articleId}>
      <ArticleCard article={item} />
    </Grid.Col>
  ));

  const renderContent = () => {
    if (articles.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return (
        <SadDimmedMessage
          title="No articles found"
          subtitle="Article that you place in the future will appear here"
        />
      );
    }

    return (
      <>
        {records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <Grid mb="xl">{ArticleCards}</Grid>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>My Articles - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container mt={50} size="80vw" sx={{ overflow: "hidden" }}>
          <Grid columns={24}>
            <Grid.Col span={24}>
              <Group position="apart">
                <PageTitle title={`Articles`} mb="lg" />
              </Group>
            </Grid.Col>
            <Grid.Col span={15}>Filters</Grid.Col>
            <Grid.Col span={1} />
            <Grid.Col span={8}>
              <SortBySelect
                data={articleSortOptions}
                value={sortStatus}
                onChange={setSortStatusWithReset}
                w="100%"
              />
            </Grid.Col>
            <Grid.Col span={15}>{renderContent()}</Grid.Col>
            <Grid.Col span={1} />
            <Grid.Col span={8}>Pinned articles here</Grid.Col>
          </Grid>
        </Container>
      </main>
    </>
  );
}
