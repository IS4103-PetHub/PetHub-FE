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
  onSetDefaultAddress: (address: Address) => void;
};

export const AddressCard = ({
  address,
  onRemoveAddress,
  onSetDefaultAddress,
}: AddressCardProps) => {
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
      sx={{
        backgroundColor: address.isDefault ? "#f0f0f0" : "#f7ffff",
      }}
    >
      <Card.Section>
        <Group position="apart">
          <Text size="sm" align="center" ml="sm" weight={500}>
            {address.name} {address.isDefault ? "(Default)" : ""}
          </Text>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon>
                <IconDots size="1rem" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconStar size="1rem" />}
                color="indigo"
                onClick={() => onSetDefaultAddress(address)}
              >
                Set as default
              </Menu.Item>
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
          <Text size="sm" color="dimmed">
            {address.line1}
          </Text>
          <Text size="sm" color="dimmed">
            {address.line2}
          </Text>
          <Text size="sm" color="dimmed">
            {address.postal}
          </Text>
        </Box>
      </Card.Section>
    </Card>
  );
};
