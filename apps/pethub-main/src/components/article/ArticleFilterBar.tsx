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
  Button,
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
  ArticleTypeEnum,
  displayArticleDate,
  formatStringToLetterCase,
} from "shared-utils";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import ArticleTypeBadge from "web-ui/shared/article/ArticleTypeBadge";

interface ArticleFilterBarProps {
  onFilterChange: (filter: string) => void;
}

const ArticleFilterBar = ({ onFilterChange }: ArticleFilterBarProps) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const FILTER_BUTTON_PROPS = {
    variant: "filled",
    size: "xs",
    radius: "lg",
    miw: 120,
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };
  return (
    <Group>
      <Button
        {...FILTER_BUTTON_PROPS}
        variant={activeFilter === "All" ? "filled" : "outline"}
        onClick={() => handleFilterClick("All")}
      >
        All
      </Button>
      {Object.values(ArticleTypeEnum).map((type) => (
        <Button
          {...FILTER_BUTTON_PROPS}
          key={type}
          variant={activeFilter === type ? "filled" : "outline"}
          onClick={() => handleFilterClick(type)}
        >
          {formatStringToLetterCase(type)}
        </Button>
      ))}
    </Group>
  );
};

export default ArticleFilterBar;
