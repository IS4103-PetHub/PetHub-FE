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
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  IconEye,
  IconPin,
  IconPinFilled,
  IconUpload,
  IconWriting,
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
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import FileIconBadge from "web-ui/shared/file/FileIconBadge";
import FileMiniIcon from "web-ui/shared/file/FileMiniIcon";
import { useGetAllTags } from "@/hooks/tag";
import { CreateOrUpdateArticlePayload } from "@/types/types";

interface ArticleFormProps {
  article?: Article;
  onSubmit: (payload: CreateOrUpdateArticlePayload) => void;
}

const ArticleForm = ({ article, onSubmit }: ArticleFormProps) => {
  const theme = useMantineTheme();
  const [existingFileUrl, setExistingFileUrl] = useState<string>("");
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("@/components/article/RichTextEditor"), {
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
      categories: [],
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
      content: isNotEmpty("Content cannot be empty."),
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
        categories: article.category,
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

  const initiateDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={form.onSubmit((values: any) => onSubmit(values))}>
      <Grid mb="xl" columns={48}>
        <Grid.Col span={12}>
          <PageTitle
            title={article ? "Update Article" : "Create Article"}
            mt={15}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiSelect
            size="sm"
            label="Tags"
            placeholder="No tags selected"
            data={tagOptions}
            {...form.getInputProps("tags")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiSelect
            size="sm"
            label="Category"
            placeholder="No categories selected"
            data={CATEGORY_TYPE_DATA}
            {...form.getInputProps("categories")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            clearable
            size="sm"
            label="Type"
            placeholder="No article type selected"
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
        <Grid.Col span={11} mt={-10}>
          <Text size="0.875rem" fw={500} color="#212529" mt={3}>
            Upload Cover Image
          </Text>
          {form.values.file ? (
            <FileIconBadge
              size="xl"
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
        <Grid.Col span={5}>
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
          />
        </Grid.Col>
        <Grid.Col span={48} mt={40}>
          <Group position="right">
            <Button
              leftIcon={<IconEye size="1rem" />}
              miw={150}
              variant="light"
            >
              Preview
            </Button>
            <Button
              leftIcon={<IconWriting size="1rem" />}
              miw={150}
              type="submit"
            >
              Publish
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default ArticleForm;
