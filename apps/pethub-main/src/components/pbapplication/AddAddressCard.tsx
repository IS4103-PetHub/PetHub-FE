import { Card, Center } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

// WHY CANT I CENTER THE PLUS BUTTON VERTICALLY WHAT note: come back to this

export const AddAddressCard = () => {
  return (
    <Card
      w={190}
      h={125}
      padding="md"
      shadow="xs"
      withBorder
      radius="md"
      ml="xs"
      mr="xs"
      sx={{ backgroundColor: "rgba(231, 245, 255, 1)", cursor: "pointer" }}
    >
      <Card.Section sx={{ height: "100%" }}>
        <Center sx={{ height: "100%" }}>
          <IconPlus size="4rem" color="#228be6" />
        </Center>
      </Card.Section>
    </Card>
  );
};
