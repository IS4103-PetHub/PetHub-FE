import {
  Button,
  Container,
  Group,
  useMantineTheme,
  Image,
  Avatar,
  Stack,
  Text,
  Box,
  Divider,
  Badge,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import {
  Article,
  Tag,
  displayArticleDate,
  formatISODayDateTime,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "../PageTitle";

interface PublishedArticleViewProps {
  articleForm?: UseFormReturnType<{
    title: string;
    content: string;
    articleType: string;
    file: File | null;
    tags: string[];
    category: string;
    isPinned: boolean;
  }>;
  tagOptions?: { value: string; label: string }[];
  coverImageUrl?: string;
  article?: Article;
}

const PublishedArticleView = ({
  articleForm,
  coverImageUrl,
  article,
  tagOptions,
}: PublishedArticleViewProps) => {
  const theme = useMantineTheme();
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("web-ui/shared/article/RichTextEditor"), {
      loading: () => <></>,
      ssr: false,
    });
  }, []);

  function constructTags(tagIds) {
    return tagIds
      .map((id) => {
        const tagOption = tagOptions.find((option) => option.value === id);
        return tagOption ? ({ tagId: id, name: tagOption.label } as Tag) : null;
      })
      .filter((name) => name !== null); // Filter out any null names
  }

  // Depending on whether the form is passed in or the article, set the values to use
  const articleToUse = {
    title: articleForm?.values.title || article?.title || "[Title]",
    content: articleForm?.values.content || article?.content || "",
    articleType:
      articleForm?.values.articleType ||
      article?.articleType ||
      "[Article Type]",
    tags: articleForm?.values.tags
      ? constructTags(articleForm.values.tags)
      : article?.tags || [],
    category: articleForm?.values.category || article?.category || "[Category]",
    isPinned: articleForm?.values.isPinned || article?.isPinned || false,
    createdBy: {
      firstName: article?.createdBy?.firstName || "Author",
      lastName: article?.createdBy?.lastName || "Name",
    },
    dateCreated: article?.dateCreated ? article?.dateCreated : null,
    dateUpdated: article?.dateUpdated ? article?.dateUpdated : null,
    attachmentUrl: coverImageUrl
      ? coverImageUrl
      : (article?.attachmentUrls.length > 0 && article?.attachmentUrls[0]) ||
        null,
  };

  function calculateEstimatedReadingTime() {
    const text = articleToUse.content;
    const wpm = 238; // https://scholarwithin.com/average-reading-speed
    const words = text.trim().split(/\s+/).length;
    const estimatedTime = Math.ceil(words / wpm);

    if (estimatedTime < 1) {
      return "Under a minute read";
    } else {
      return `${estimatedTime} minute${estimatedTime > 1 ? "s" : ""} read`;
    }
  }

  const MetaInfo = (
    <Group position="apart" mb="xl" mt="md">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar radius="xl" size="lg" mr="md" />
        <Stack>
          <Text mb={-8}>
            {articleToUse?.createdBy?.firstName}{" "}
            {articleToUse?.createdBy.lastName}
          </Text>

          <Text color="dimmed" size="sm" mt={-8}>
            {formatStringToLetterCase(articleToUse.articleType)} ·{" "}
            {calculateEstimatedReadingTime()}
          </Text>
        </Stack>
      </Box>
      <Box>
        <Stack sx={{ textAlign: "right" }}>
          <Text color="dimmed" size="sm" mb={-8}>
            Published. {displayArticleDate(articleToUse?.dateCreated)}
          </Text>
          <Text
            color="dimmed"
            size="sm"
            mt={-8}
            display={article?.dateUpdated ? "block" : "none"}
          >
            Last updated. {displayArticleDate(articleToUse?.dateUpdated)}
          </Text>
        </Stack>
      </Box>
    </Group>
  );

  const BarInfo = (
    <Box mb="xl">
      <Divider mb={10} />
      <Group position={articleToUse.tags.length > 0 ? "apart" : "right"}>
        <Box>
          {articleToUse.tags.map((tag, index) => (
            <React.Fragment key={tag.tagId}>
              <Badge color="blue" radius="xs" mb={5}>
                {tag.name}
              </Badge>
              {index < articleToUse.tags.length - 1 && " · "}
            </React.Fragment>
          ))}
        </Box>
        <Badge variant="dot">
          {formatStringToLetterCase(articleToUse.category)}
        </Badge>
      </Group>
      <Divider mt={10} />
    </Box>
  );

  return (
    <>
      <Container mt="xs" mb="xs">
        <Group position="apart">
          <PageTitle title={`${articleToUse.title}`} fw={700} size={35} />
        </Group>
        {MetaInfo}
        {BarInfo}
        <Image
          src={articleToUse.attachmentUrl}
          alt="Article Cover Image"
          radius="md"
          mb="xl"
          display={articleToUse.attachmentUrl ? "block" : "none"}
        />
        <RichTextEditor article={articleToUse.content} viewOnly />
      </Container>
    </>
  );
};

export default PublishedArticleView;
