import { Badge, BadgeProps } from "@mantine/core";
import React from "react";

interface ArticleTypeBadgeProps extends BadgeProps {
  ArticleType: string;
}

const ArticleTypeBadge = ({ ArticleType, ...props }: ArticleTypeBadgeProps) => {
  const colourMap = new Map([
    ["Announcements", "orange"],
    ["Tips And Tricks", "purple"],
    ["Events", "green"],
    ["Others", "blue"],
  ]);

  return (
    <Badge
      color={colourMap.has(ArticleType) ? colourMap.get(ArticleType) : "gray"}
      {...props}
      radius="xs"
    >
      {ArticleType}
    </Badge>
  );
};
export default ArticleTypeBadge;
