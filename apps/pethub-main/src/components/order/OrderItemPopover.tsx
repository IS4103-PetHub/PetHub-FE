import {
  Popover,
  Text,
  ActionIcon,
  useMantineTheme,
  PopoverProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";

interface OrderItemPopoverProps {
  text: string;
}

const OrderItemPopover = ({ text, ...props }: OrderItemPopoverProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      width={400}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      offset={0}
    >
      <Popover.Target>
        <ActionIcon onMouseEnter={open} onMouseLeave={close} variant="subtle">
          <IconInfoCircle size="1.2rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        onMouseLeave={close}
        sx={{ backgroundColor: theme.colors.dark[6] }}
      >
        <Text size="xs" align="center" c="white">
          {text}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default OrderItemPopover;
