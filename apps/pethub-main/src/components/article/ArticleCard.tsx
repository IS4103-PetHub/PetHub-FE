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
import ArticleTypeBadge from "web-ui/shared/article/ArticleTypeBadge";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [visible, { toggle }] = useDisclosure(false);

  // article.content is a HTML string containing HTML tags. We want to remove formatting tags and other stuff like img tags for the preview
  const createPreviewText = (htmlContent, maxLength = 200) => {
    let text = htmlContent.replace(
      /<img[^>]*src="data:image[^>]*>/g,
      "[Image]",
    ); // replace <img> tags

    // Replace line breaks or closing tags with space
    text = text.replace(/<\/[^>]+>/g, " ").replace(/<br\s*\/?>/gi, " ");

    // Remove any other HTML tags
    text = text.replace(/<[^>]+>/g, "");

    // Replace multiple spaces with single space
    text = text.replace(/\s\s+/g, " ");
    return text;
  };

  return (
    <Card
      withBorder
      mih={200}
      radius="lg"
      shadow="xs"
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
      <Group position="apart" mb={5} mt={-5}>
        <ArticleTypeBadge
          ArticleType={formatStringToLetterCase(article?.articleType)}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Text size="xs" mr="md" fw={500} mt={3} color="dimmed">
            {displayArticleDate(article?.dateCreated)}
          </Text>
          {article?.isPinned ? (
            <IconPinFilled size="1rem" />
          ) : (
            <IconPin size="1rem" />
          )}
        </Box>
      </Group>
      <Divider mt={1} mb="xs" />
      <Grid columns={24}>
        <LoadingOverlay
          visible={visible}
          overlayBlur={0.1}
          loaderProps={{ size: "sm", color: "indigo", variant: "bars" }}
        />
        <Grid.Col span={4} mih={125}>
          {article?.attachmentUrls?.length > 0 ? (
            <Image
              radius="md"
              src={article?.attachmentUrls[0]}
              fit="contain"
              w="auto"
              alt="Article Cover Image"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              fit="contain"
              w="auto"
              alt="Article Cover Image"
            />
          )}
        </Grid.Col>
        <Grid.Col span={16}>
          <Box>
            <Text fw={600} size={16} mb={5}>
              {article?.title}
            </Text>
            <Text lineClamp={3} size="xs">
              {createPreviewText(article?.content)}
            </Text>
          </Box>
        </Grid.Col>
        <Grid.Col
          span={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <Badge variant="dot" radius="xs">
            {formatStringToLetterCase(article?.category)}
          </Badge>
        </Grid.Col>
        <Grid.Col span={24}>
          <Group position="apart">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar size="sm" radius="lg" color="blue" mr="xs" />
              <Text size="xs">
                {article?.createdBy?.firstName} {article?.createdBy.lastName}
              </Text>
            </Box>
            <Box>
              {article?.tags.map((tag, index) => (
                <React.Fragment key={tag.tagId}>
                  <Badge color="blue" radius="xs" mb={5}>
                    {tag.name}
                  </Badge>
                  {index < article?.tags.length - 1 && " · "}
                </React.Fragment>
              ))}
            </Box>
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ArticleCard;
