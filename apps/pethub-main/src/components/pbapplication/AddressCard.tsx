import {
  Box,
  Card,
  Text,
  Divider,
  Group,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { IconTrash, IconPencil, IconDots, IconStar } from "@tabler/icons-react";
import { Address } from "@/types/types";

type AddressCardProps = {
  address: Address;
  onRemoveAddress: (address: Address) => void;
};

export const AddressCard = ({ address, onRemoveAddress }: AddressCardProps) => {
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
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon>
                <IconDots size="1rem" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconTrash size="1rem" />}
                color="red"
                onClick={() => onRemoveAddress(address)}
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
