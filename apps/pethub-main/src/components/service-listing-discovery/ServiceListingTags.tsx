import { Badge, BadgeProps, Group } from "@mantine/core";
import React from "react";
import { Tag } from "@/types/types";

interface ServiceListingTagsProps extends BadgeProps {
  tags: Tag[];
}

const ServiceListingTags = ({ tags, ...props }: ServiceListingTagsProps) => {
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
