import React from "react";
import { Text } from "@mantine/core";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <Text size="2rem" weight={600}>
      {title}
    </Text>
  );
};

export default PageTitle;
