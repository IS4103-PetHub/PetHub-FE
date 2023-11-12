import {
  useMantineTheme,
  Text,
  Divider,
  Card,
  Group,
  Box,
  Badge,
  Grid,
  Image,
  LoadingOverlay,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPin, IconPinFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  Article,
  displayArticleDate,
  formatStringToLetterCase,
} from "shared-utils";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import ArticleTypeBadge from "web-ui/shared/article/ArticleTypeBadge";
import PinnedArticleItem from "./PinnedArticleItem";

interface PinnedArticleSidebarProps {
  pinnedArticles: Article[];
}

const PinnedArticleSidebar = ({
  pinnedArticles,
}: PinnedArticleSidebarProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const Content = (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }} mb="md">
        <IconPinFilled size="1rem" />
        <Text fw={600} ml="xs">
          Pinned Items
        </Text>
      </Box>
      <Box pl="md" pr="md">
        {pinnedArticles?.map((article) => (
          <PinnedArticleItem article={article} key={article?.articleId} />
        ))}
      </Box>
    </>
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
