import { Group } from "@mantine/core";
import React from "react";
import { IconValue } from "./IconValue";

interface FileMiniIconProps {
  value: File | File[];
}

/*
  This is the cute mini file icon thing that you see when you upload a file in the small FileInput box from Mantine
  Pass it as the valueComponent={FileMiniIcon} prop in a FileInput
*/

const FileMiniIcon = ({ value }: FileMiniIconProps) => {
  if (Array.isArray(value)) {
    return (
      <Group spacing="sm" py="xs">
        {value.map((file, index) => (
          <IconValue file={file} key={index} />
        ))}
      </Group>
    );
  }
  return <IconValue file={value} />;
};

export default FileMiniIcon;
