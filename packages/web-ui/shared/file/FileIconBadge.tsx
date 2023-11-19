import { Badge, BadgeProps, Group } from "@mantine/core";
import { CloseButton } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import React from "react";
import { IconValue } from "./IconValue";

interface FileIconBadgeProps extends BadgeProps {
  fileName: string;
  onClick?: () => void;
  onRemove: () => void;
}

const FileIconBadge = ({
  fileName,
  onClick,
  onRemove,
  ...props
}: FileIconBadgeProps) => {
  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove();
  };
  return (
    <Badge
      radius="xs"
      color="gray"
      {...props}
      fullWidth
      rightSection={
        <CloseButton onClick={handleRemoveClick} sx={{ cursor: "pointer" }} />
      }
      leftSection={<IconFileDownload size="1rem" style={{ marginTop: 5 }} />}
      onClick={onClick}
    >
      {fileName}
    </Badge>
  );
};

export default FileIconBadge;
