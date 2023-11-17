import { Button } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import React from "react";

interface ShowLessButtonProps {
  onClick(): void;
}
const ShowLessButton = ({ onClick }: ShowLessButtonProps) => {
  return (
    <Button
      color="gray"
      sx={{ border: "1px solid" }}
      onClick={onClick}
      style={{ marginRight: 8 }}
      compact
      variant="light"
      leftIcon={<IconMinus size="0.8rem" />}
    >
      Show less
    </Button>
  );
};

export default ShowLessButton;
