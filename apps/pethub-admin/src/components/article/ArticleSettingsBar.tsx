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
} from "@mantine/core";
import {
  IconPaw,
  IconPin,
  IconPinFilled,
  IconPinned,
  IconPinnedOff,
} from "@tabler/icons-react";
import React, { useState } from "react";
import {
  ArticleTypeEnum,
  ServiceCategoryEnum,
  formatLetterCaseToEnumString,
  formatStringToLetterCase,
} from "shared-utils";
import { useGetAllTags } from "@/hooks/tag";

interface ArticleSettingsBarProps extends RatingProps {
  typeSelection: string;
  setTypeSelection: (type: string) => void;
  categorySelection: string;
  setCategorySelection: (category: string) => void;
  tagSelection: string;
  setTagSelection: (tag: string) => void;
  isPinned: boolean;
  handlePin: () => void;
}

const ArticleSettingsBar = ({
  typeSelection,
  categorySelection,
  tagSelection,
  isPinned,
  setTypeSelection,
  setCategorySelection,
  setTagSelection,
  handlePin,
}: ArticleSettingsBarProps) => {
  const theme = useMantineTheme();

  // Data fetching
  const { data: tags = [] } = useGetAllTags();

  // Tag, category, type states and selections
  const tagOptions = tags.map((tag) => ({
    value: tag.tagId.toString(),
    label: tag.name,
  }));

  const ARTICLE_TYPE_LABELS = Object.values(ArticleTypeEnum).join(",");
  const ARTICLE_TYPE_VALUES = Object.values(ArticleTypeEnum).map((type) =>
    formatStringToLetterCase(type.toString()),
  );

  const CATEGORY_TYPE_LABELS = Object.values(ServiceCategoryEnum).join(",");
  const CATEGORY_TYPE_VALUES = Object.values(ServiceCategoryEnum).map(
    (category) => formatStringToLetterCase(category.toString()),
  );

  return (
    <Grid mb="md" columns={24}>
      <Grid.Col span={7}>
        <MultiSelect
          size="sm"
          label="Tags"
          placeholder="Select tags"
          data={tagOptions}
          onChange={(selectedTag) => {
            if (selectedTag === null) {
              setTagSelection(undefined);
            } else {
              const tagSelectionValues = selectedTag.map((tag) =>
                formatLetterCaseToEnumString(tag),
              );
              setTagSelection(tagSelectionValues.join(","));
            }
          }}
        />
      </Grid.Col>
      <Grid.Col span={7}>
        <MultiSelect
          size="sm"
          label="Category"
          placeholder="Select categories"
          data={CATEGORY_TYPE_VALUES}
          onChange={(selectedCategory) => {
            if (selectedCategory.length === 0) {
              setCategorySelection(CATEGORY_TYPE_LABELS);
            } else {
              const categorySelectionValues = selectedCategory.map((category) =>
                formatLetterCaseToEnumString(category),
              );
              setCategorySelection(categorySelectionValues.join(","));
            }
          }}
        />
      </Grid.Col>
      <Grid.Col span={7}>
        <Select
          clearable
          size="sm"
          label="Type"
          placeholder="Select article type"
          data={ARTICLE_TYPE_VALUES}
          onChange={(selectedType) => setTypeSelection(selectedType)}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Button
          mt={24}
          fullWidth
          onClick={handlePin}
          style={{
            backgroundColor: isPinned ? "green" : "gray",
            color: "white",
          }}
          leftIcon={
            isPinned ? <IconPinFilled size="1rem" /> : <IconPin size="1rem" />
          }
        >
          {isPinned ? "Pinned" : "Pin"}
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default ArticleSettingsBar;
