import {
  Box,
  Card,
  Text,
  Divider,
  Group,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { Address } from "@/types/types";

type AddressCardProps = {
  address: Address;
};

export const AddressCard = ({ address }: AddressCardProps) => {
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
    >
      <Card.Section>
        <Group position="apart">
          <Text size="sm" align="center" ml="sm" weight={500}>
            {address.addressName}
          </Text>
        </Group>
      </Card.Section>
      <Card.Section>
        <Divider mb="xs" />
        <Box ml="sm">
          <Text
            size="sm"
            color="dimmed"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {address.line1}
          </Text>
          <Text
            size="sm"
            color="dimmed"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {address.line2}
          </Text>
          <Text
            size="sm"
            color="dimmed"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {address.postalCode}
          </Text>
        </Box>
      </Card.Section>
    </Card>
  );
};
