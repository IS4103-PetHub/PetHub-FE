import {
  Popover,
  Text,
  Button,
  Card,
  ScrollArea,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExclamationCircle, IconPointer } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useCartOperations } from "@/hooks/cart";
import CartIcon from "./CartIcon";
import MiniCartItemCard from "./MiniCartItemCard";

const PlatformFeePopover = () => {
  const router = useRouter();
  const [shortOpened, { close: closeShort, open: openShort }] =
    useDisclosure(false);
  const [longOpened, { close: closeLong, open: openLong }] =
    useDisclosure(false);

  const handleMouseLeave = () => {
    closeShort();
    closeLong();
  };

  return (
    <Popover
      width={400}
      position="bottom"
      withArrow
      shadow="md"
      opened={shortOpened || longOpened}
      offset={0}
    >
      <Popover.Target>
        <ActionIcon
          onMouseEnter={openShort}
          onClick={openLong}
          onMouseLeave={handleMouseLeave}
          variant="subtle"
        >
          <IconExclamationCircle size="1rem" />
        </ActionIcon>
      </Popover.Target>
      {shortOpened && !longOpened && (
        <Popover.Dropdown onMouseLeave={handleMouseLeave} p={0}>
          <Alert color="grape" variant="light">
            <Text size="xs" align="center">
              Click again to find out how our platform fees are calculated
            </Text>
          </Alert>
        </Popover.Dropdown>
      )}
      {longOpened && (
        <Popover.Dropdown onMouseLeave={handleMouseLeave} p={0}>
          <Alert color="grape" variant="light">
            <Text size="xs" align="center">
              To allow PetHub to continue operating, we take a commission fee.
              We also use stripe for our payments, which charges a 2.9% + 30¢
              fee for each transaction. This message is nonsense at the moment
              and will be updated once SR3s commissions module is done ( ́
              ◕◞ε◟◕`) Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industrys standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book.
            </Text>
          </Alert>
        </Popover.Dropdown>
      )}
    </Popover>
  );
};

export default PlatformFeePopover;
