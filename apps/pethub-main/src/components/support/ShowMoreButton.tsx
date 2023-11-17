import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

interface ShowMoreButtonProps {
  onClick(): void;
}

const ShowMoreButton = ({ onClick }: ShowMoreButtonProps) => {
  return (
    <Button
      sx={{ border: "1px solid" }}
      onClick={onClick}
      style={{ marginRight: 8 }}
      compact
      variant="light"
      leftIcon={<IconPlus size="0.8rem" />}
    >
      Show more
    </Button>
  );
};

export default ShowMoreButton;
