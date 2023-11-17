import { Group, Button } from "@mantine/core";
import React, { useState } from "react";
import { ArticleTypeEnum, formatStringToLetterCase } from "shared-utils";

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
