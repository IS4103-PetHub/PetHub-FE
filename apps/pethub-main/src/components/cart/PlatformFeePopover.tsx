import { Popover, Text, ActionIcon, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";

const PlatformFeePopover = () => {
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
          <IconInfoCircle size="1rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        onMouseLeave={close}
        sx={{ backgroundColor: theme.colors.dark[6] }}
      >
        <Text size="xs" align="center" c="white">
          The platform fee covers operational costs to help keep PetHub up and
          running. PetHub strives to deliver a smooth and pleasant experience
          for all users.
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PlatformFeePopover;
