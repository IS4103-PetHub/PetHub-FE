import {
  useMantineTheme,
  Group,
  MultiSelect,
  Select,
  Grid,
  Button,
  TextInput,
  FileInput,
  rem,
  Text,
  Stack,
  Box,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconDeviceFloppy,
  IconEye,
  IconPin,
  IconPinFilled,
  IconUpload,
  IconWriting,
  IconX,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect } from "react";
import {
  Article,
  ArticleTypeEnum,
  ServiceCategoryEnum,
  Tag,
  downloadFile,
  extractFileName,
  formatISODayDateTime,
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import PublishedArticleView from "web-ui/shared/article/PublishedArticleView";
import FileIconBadge from "web-ui/shared/file/FileIconBadge";
import FileMiniIcon from "web-ui/shared/file/FileMiniIcon";
import { useGetAllTags } from "@/hooks/tag";
import { CreateOrUpdateArticlePayload } from "@/types/types";

interface ArticleFormProps {
  isPreviewing: boolean;
  toggleIsPreviewing: () => void;
  article?: Article;
  onSubmit: (payload: CreateOrUpdateArticlePayload) => void;
  deleteComment?: (articleCommentId: number) => Promise<void>;
}

const ArticleForm = ({
  isPreviewing,
  toggleIsPreviewing,
  article,
  onSubmit,
  deleteComment,
}: ArticleFormProps) => {
  const theme = useMantineTheme();
  const [existingFileUrl, setExistingFileUrl] = useState<string>("");
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("web-ui/shared/article/RichTextEditor"), {
      loading: () => <></>,
      ssr: false,
    });
  }, []);

  const isUpdating = !!article;

  // Data fetching
  const { data: tags = [] } = useGetAllTags();

  const tagOptions = tags.map((tag) => ({
    value: tag.tagId.toString(),
    label: tag.name,
  }));

  const CATEGORY_TYPE_DATA = Object.entries(ServiceCategoryEnum).map(
    ([key, value]) => ({
      value: value as string,
      label: `${formatStringToLetterCase(value)}`,
    }),
  );

  const ARTICLE_TYPE_DATA = Object.entries(ArticleTypeEnum).map(
    ([key, value]) => ({
      value: value as string,
      label: `${formatStringToLetterCase(value)}`,
    }),
  );

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      articleType: "",
      file: null,
      tags: [],
      category: "",
      isPinned: false,
    },
    validate: {
      title: (value) => {
        const minLength = 1;
        const maxLength = 96;
        if (!value) return "Title is mandatory.";
        if (value.length < minLength || value.length > maxLength) {
          return `Title must be between ${minLength} and ${maxLength} characters.`;
        }
      },
      content: (value) => {
        if (!value) {
          notifications.show({
            title: isUpdating
              ? "Error Updating Article"
              : "Error Creating Article",
            color: "red",
            icon: <IconX />,
            message: "Content cannot be empty.",
          });
          // Returning validation message
          return "Content is mandatory and cannot be empty.";
        }
        return null; // No error
      },
      articleType: isNotEmpty("Article type is mandatory."),
    },
  });

  useEffect(() => {
    setFormFields();
  }, [article]);

  const handlePin = () => {
    form.setFieldValue("isPinned", !form.values.isPinned);
  };

  const setArticle = (content: string) => {
    form.setFieldValue("content", content);
  };

  const downloadPromise = (fileKey: string, url: string) => {
    try {
      const fileName = extractFileName(fileKey);
      return downloadFile(url, fileName);
    } catch (error) {
      console.error(`Error downloading file:`, error);
      return null;
    }
  };

  const handleFileInputChange = (newFile: File) => {
    if (newFile) {
      const imageObjectUrl = URL.createObjectURL(newFile);
      setExistingFileUrl(imageObjectUrl);
      form.setFieldValue("file", newFile);
    } else {
      setExistingFileUrl("");
      form.setFieldValue("file", null);
    }
  };

  const setFormFields = async () => {
    if (isUpdating) {
      form.setValues({
        title: article.title,
        content: article.content,
        articleType: article.articleType,
        tags: article.tags.map((tag) => tag.tagId.toString()),
        category: article.category,
        isPinned: article.isPinned,
      });

      if (article.attachmentUrls?.length > 0) {
        const fileName = extractFileName(article.attachmentKeys[0]);
        const newFile: File = await downloadPromise(
          article.attachmentKeys[0],
          article.attachmentUrls[0],
        );
        if (newFile) {
          handleFileInputChange(newFile);
        }
      }
      return;
    }
    form.setFieldValue("file", null);
  };

  // Download a file to local disk
  const initiateDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ArticleForm = (
    <form onSubmit={form.onSubmit((values: any) => onSubmit(values))}>
      <Grid mb="xl" columns={48}>
        <Grid.Col span={12}>
          <PageTitle
            title={
              article ? `Article ID.${article?.articleId}` : "Create Article"
            }
            mt={15}
          />
        </Grid.Col>
        <Grid.Col span={20}>
          <MultiSelect
            size="sm"
            label="Tags"
            placeholder="None selected"
            data={tagOptions}
            {...form.getInputProps("tags")}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <Select
            clearable
            size="sm"
            label="Category"
            placeholder="None selected"
            data={CATEGORY_TYPE_DATA}
            {...form.getInputProps("category")}
          />
        </Grid.Col>
        <Grid.Col span={8}>
          <Select
            clearable
            size="sm"
            label="Type"
            placeholder="None selected"
            data={ARTICLE_TYPE_DATA}
            {...form.getInputProps("articleType")}
          />
        </Grid.Col>
        <Grid.Col span={32} mt={-10}>
          <TextInput
            label="Title"
            placeholder="Choose an engaging title to capture the attention of your readers"
            {...form.getInputProps("title")}
          />
        </Grid.Col>
        <Grid.Col span={10} mt={-10}>
          <Text size="0.875rem" fw={500} color="#212529" mt={3}>
            Upload Cover Image
          </Text>
          {form.values.file ? (
            <FileIconBadge
              size="xl"
              mt={2}
              fileName={form.values.file?.name}
              onClick={() =>
                initiateDownload(existingFileUrl, form.values.file?.name)
              }
              onRemove={() => form.setFieldValue("file", null)}
            />
          ) : (
            <FileInput
              clearable
              placeholder="Select the display image"
              accept="image/*"
              name="image"
              valueComponent={FileMiniIcon}
              onChange={(file) => handleFileInputChange(file)}
              capture={false}
            />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <Button
            mt={14}
            fullWidth
            onClick={handlePin}
            style={{
              backgroundColor: form.values.isPinned ? "green" : "gray",
              color: "white",
            }}
            leftIcon={
              form.values.isPinned ? (
                <IconPinFilled size="1rem" />
              ) : (
                <IconPin size="1rem" />
              )
            }
            {...form.getInputProps("isPinned")}
          >
            {form.values.isPinned ? "Pinned" : "Pin"}
          </Button>
        </Grid.Col>
        <Grid.Col span={48}>
          <RichTextEditor
            article={form.values.content}
            setArticle={setArticle}
            viewOnly={false}
          />
        </Grid.Col>
        <Grid.Col span={48} mt={40}>
          <Group position="apart">
            <Group>
              {isUpdating && article?.dateUpdated && (
                <Box mt={-5}>
                  <Text size="sm" color="dimmed">
                    Last updated by [{article?.updatedBy?.firstName}{" "}
                    {article?.updatedBy?.lastName}]
                  </Text>
                  <Text size="sm" color="dimmed">
                    {formatISODayDateTime(article?.dateUpdated)}
                  </Text>
                </Box>
              )}
            </Group>

            <Group>
              <Button
                leftIcon={<IconEye size="1rem" />}
                miw={150}
                variant="light"
                onClick={() => toggleIsPreviewing()}
              >
                Preview
              </Button>
              <Button
                leftIcon={
                  isUpdating ? (
                    <IconDeviceFloppy size="1rem" />
                  ) : (
                    <IconWriting size="1rem" />
                  )
                }
                miw={150}
                type="submit"
              >
                {isUpdating ? "Save Changes" : "Publish Article"}
              </Button>
            </Group>
          </Group>
        </Grid.Col>
      </Grid>
    </form>
  );

  return (
    <>
      {isPreviewing ? (
        <PublishedArticleView
          articleForm={form}
          coverImageUrl={existingFileUrl}
          article={article}
          tagOptions={tagOptions}
          adminView={true}
          deleteComment={deleteComment}
        />
      ) : (
        ArticleForm
      )}
    </>
  );
};

export default ArticleForm;
