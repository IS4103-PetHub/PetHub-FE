import { Text, TextProps } from "@mantine/core";
import React from "react";

interface PageTitleProps extends TextProps {
  title: string;
}

export const PageTitle = ({ title, ...props }: PageTitleProps) => {
  return (
    <Text size="2rem" weight={600} {...props}>
      {title}
    </Text>
  );
};
