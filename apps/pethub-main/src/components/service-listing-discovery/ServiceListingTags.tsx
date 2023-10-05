import { Badge, BadgeProps, Box, Group } from "@mantine/core";
import React from "react";
import { Tag } from "shared-utils";

interface ServiceListingTagsProps extends BadgeProps {
  tags: Tag[];
}

const ServiceListingTags = ({ tags, ...props }: ServiceListingTagsProps) => {
  if (tags.length === 0) {
    // add a small gap if no tags to render
    return <Box h={18} />;
  }
  return (
    <Group spacing={5}>
      {tags?.map((tag) => (
        <Badge color="gray" size="sm" key={tag.tagId} {...props}>
          # {tag.name}
        </Badge>
      ))}
    </Group>
  );
};

export default ServiceListingTags;
