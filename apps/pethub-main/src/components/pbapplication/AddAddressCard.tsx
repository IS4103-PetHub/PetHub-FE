import { Box, Card, Center } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export const AddAddressCard = () => {
  return (
    <Card
      w={190}
      h={125}
      shadow="xs"
      withBorder
      radius="md"
      ml="xs"
      mr="xs"
      sx={(theme) => ({
        cursor: "pointer",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[2],
      })}
    >
      <Card.Section
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            transform: "translate(0,65%)",
          }}
        >
          <IconPlus size="3rem" color="gray" />
        </Box>
      </Card.Section>
    </Card>
  );
};
