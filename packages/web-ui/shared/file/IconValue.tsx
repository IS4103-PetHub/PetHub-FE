import { rem, Center } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import React from "react";

interface IconValueProps {
  file: File;
}

/*
  This is the content for the cute mini file icon thing for FileMiniIcon
*/

export const IconValue = ({ file }: IconValueProps) => {
  return (
    <Center
      inline
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[1],
        fontSize: theme.fontSizes.xs,
        padding: `${rem(3)} ${rem(7)}`,
        borderRadius: theme.radius.sm,
      })}
    >
      <IconPhoto size={rem(14)} style={{ marginRight: rem(5) }} />
      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: rem(200),
          display: "inline-block",
        }}
      >
        {file.name}
      </span>
    </Center>
  );
};
