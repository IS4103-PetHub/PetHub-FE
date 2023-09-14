import { Card, Center } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

// WHY CANT I CENTER THE PLUS BUTTON VERTICALLY WHAT note: come back to this

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
      <Card.Section sx={{ height: "100%" }}>
        <Center sx={{ height: "100%" }} pt="md">
          <IconPlus size="3rem" />
        </Center>
      </Card.Section>
    </Card>
  );
};
