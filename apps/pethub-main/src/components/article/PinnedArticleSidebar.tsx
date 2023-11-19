import { Text, Card, Box } from "@mantine/core";
import { IconPinFilled } from "@tabler/icons-react";
import React from "react";
import { Article } from "shared-utils";
import PinnedArticleItem from "./PinnedArticleItem";

interface PinnedArticleSidebarProps {
  pinnedArticles: Article[];
}

const PinnedArticleSidebar = ({
  pinnedArticles,
}: PinnedArticleSidebarProps) => {
  const Content = (
    <Box mah="50vh" sx={{ overflowY: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center" }} mb="md">
        <IconPinFilled size="1rem" opacity={0.4} />
        <Text fw={600} ml="xs">
          Pinned Items
        </Text>
      </Box>
      <Box pl="md" pr="md">
        {pinnedArticles?.map((article, index) => (
          <PinnedArticleItem
            article={article}
            key={article?.articleId}
            isLast={index === pinnedArticles.length - 1}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Card withBorder mih={200} radius="xs" shadow="xs">
      {pinnedArticles?.length === 0 ? (
        <Text color="dimmed">No pinned articles available</Text>
      ) : (
        Content
      )}
    </Card>
  );
};

export default PinnedArticleSidebar;
