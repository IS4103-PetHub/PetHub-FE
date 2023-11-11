import {
  useMantineTheme,
  RatingProps,
  Rating,
  Group,
  MultiSelect,
  Select,
  Grid,
  Button,
  Checkbox,
  TextInput,
  FileInput,
} from "@mantine/core";
import {
  IconEye,
  IconPaw,
  IconPin,
  IconPinFilled,
  IconPinned,
  IconPinnedOff,
  IconWriting,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React, { useState, useMemo } from "react";
import {
  ArticleTypeEnum,
  ServiceCategoryEnum,
  Tag,
  downloadFile,
  extractFileName,
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import { useGetAllTags } from "@/hooks/tag";
import { CreateOrUpdateArticlePayload } from "@/types/types";
import RichTextEditor from "./RichTextEditor";

interface ArticleFormProps {
  form: any;
  tags: Tag[];
  onSubmit: (payload: CreateOrUpdateArticlePayload) => void;
}

const ArticleForm = ({ form, tags, onSubmit }: ArticleFormProps) => {
  const theme = useMantineTheme();
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("@/components/article/RichTextEditor"), {
      loading: () => <></>,
      ssr: false,
    });
  }, []);

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
      form.setFieldValue("file", newFile);
    } else {
      form.setFieldValue("file", null);
    }
  };

  return (
    <form onSubmit={form.onSubmit((values: any) => onSubmit(values))}>
      <Grid mb="xl" columns={48}>
        <Grid.Col span={12}>
          <PageTitle title="Create Article" mt={15} />
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
          <FileInput
            label="Upload Cover Image"
            clearable
            placeholder={"Select the display image"}
            accept="image/*"
            name="image"
            onChange={(file) => handleFileInputChange(file)}
            capture={false}
          />
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
