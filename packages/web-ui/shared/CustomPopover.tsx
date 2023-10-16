import {
  Popover,
  Text,
  ActionIcon,
  useMantineTheme,
  PopoverProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

interface CustomPopoverProps extends PopoverProps {
  text: string;
}

const CustomPopover = ({ text, ...props }: CustomPopoverProps) => {
  const theme = useMantineTheme();
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      width={350}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      offset={0}
      {...props}
    >
      <Popover.Target>
        <ActionIcon onMouseEnter={open} onMouseLeave={close} variant="subtle">
          <IconInfoCircle size="1rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        onMouseLeave={close}
        sx={{ backgroundColor: theme.colors.dark[6], border: 0 }}
      >
        <Text size="xs" align="center" c="white">
          {text}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default CustomPopover;
