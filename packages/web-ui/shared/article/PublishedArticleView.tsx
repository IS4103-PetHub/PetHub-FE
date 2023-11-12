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
  formatISODayDateTime,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "../PageTitle";

interface PublishedArticleViewProps {
  articleForm: UseFormReturnType<{
    title: string;
    content: string;
    articleType: string;
    file: File | null;
    tags: string[];
    category: string;
    isPinned: boolean;
  }>;
  tagOptions: { value: string; label: string }[];
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

  function getTagNames(tagIds) {
    return tagIds
      .map((id) => {
        const tagOption = tagOptions.find((option) => option.value === id);
        return tagOption ? tagOption.label : null;
      })
      .filter((name) => name !== null); // Filter out any null names
  }

  function calculateEstimatedReadingTime() {
    const text = articleForm.values.content;
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
          {article ? (
            <Text mb={-8}>
              {article?.createdBy?.firstName} {article?.createdBy.lastName}
            </Text>
          ) : (
            <Text mb={-8}>Author Name</Text>
          )}
          <Text color="dimmed" size="sm" mt={-8}>
            {articleForm.values.articleType
              ? formatStringToLetterCase(articleForm.values.articleType)
              : "[Article Type]"}{" "}
            · {calculateEstimatedReadingTime()}
          </Text>
        </Stack>
      </Box>
      <Box>
        <Stack sx={{ textAlign: "right" }}>
          <Text color="dimmed" size="sm" mb={-8}>
            Published on. {formatISODayDateTime(article?.dateCreated)}
          </Text>
          <Text
            color="dimmed"
            size="sm"
            mt={-8}
            display={article?.dateUpdated ? "block" : "none"}
          >
            Last updated. {formatISODayDateTime(article?.dateUpdated)}
          </Text>
        </Stack>
      </Box>
    </Group>
  );

  const tagNames = getTagNames(articleForm.values.tags);

  const BarInfo = (
    <Box mb="xl">
      <Divider mb={10} />
      <Group position={tagNames.length > 0 ? "apart" : "right"}>
        <Box>
          {tagNames.map((tagName, index) => (
            <React.Fragment key={tagName}>
              <Badge color="blue" radius="xs" mb={5}>
                {tagName}
              </Badge>
              {index < tagNames.length - 1 && " · "}
            </React.Fragment>
          ))}
        </Box>
        <Badge variant="dot">
          {articleForm.values.category
            ? formatStringToLetterCase(articleForm.values.category)
            : "[Category]"}
        </Badge>
      </Group>
      <Divider mt={10} />
    </Box>
  );

  return (
    <>
      <Container mt="xs" mb="xs">
        <Group position="apart">
          <PageTitle title={`${articleForm.values.title}`} fw={700} size={35} />
        </Group>
        {MetaInfo}
        {BarInfo}
        <Image
          src={coverImageUrl}
          alt="Article Cover Image"
          radius="md"
          mb="xl"
          display={coverImageUrl ? "block" : "none"}
        />
        <RichTextEditor article={articleForm.values.content} viewOnly />
      </Container>
    </>
  );
};

export default PublishedArticleView;
