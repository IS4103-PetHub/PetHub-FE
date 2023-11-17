import { useMantineTheme, Text, Divider, Group, Box } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import {
  Article,
  displayArticleDate,
  formatStringToLetterCase,
} from "shared-utils";
import ArticleTypeBadge from "web-ui/shared/article/ArticleTypeBadge";

interface PinnedArticleItemProps {
  article: Article;
  isLast?: boolean;
}

const PinnedArticleItem = ({ article, isLast }: PinnedArticleItemProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[1],
        },
      }}
      onClick={() => router.push(`/articles/${article.articleId}`)}
    >
      <Box p="xs">
        <Group position="apart" mb={5}>
          <ArticleTypeBadge
            ArticleType={formatStringToLetterCase(article?.articleType)}
          />
          <Text size="xs" fw={500} color="dimmed">
            {displayArticleDate(article?.dateCreated)}
          </Text>
        </Group>
        <Text size="sm" fw={600}>
          {article?.title}
        </Text>
      </Box>

      {!isLast && <Divider mt="sm" mb="sm" />}
    </Box>
  );
};

export default PinnedArticleItem;
