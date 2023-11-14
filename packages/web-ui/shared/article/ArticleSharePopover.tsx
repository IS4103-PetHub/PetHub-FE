import {
  Button,
  useMantineTheme,
  Popover,
  Text,
  ActionIcon,
  Group,
  CopyButton,
  Divider,
  Box,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandTwitter,
  IconCopy,
  IconLink,
  IconMessageCircle2,
  IconPaperclip,
  IconShare,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

import React from "react";

interface ArticleSharePopoverProps {
  adminView?: boolean;
}

const ArticleSharePopover = ({ adminView }: ArticleSharePopoverProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [sharePopoverOpen, toggleSharePopoverOpen] = useToggle();

  const currentUrl = `${window?.location?.origin}${router.asPath}`;

  const SHARE_URL_LINKEDIN = `https://www.linkedin.com/sharing/share-offsite/?url=`;
  const SHARE_URL_FACEBOOK = `https://www.facebook.com/sharer/sharer.php?u=`;
  const SHARE_URL_TWITTER = `https://twitter.com/intent/tweet?url=`;
  const SHARE_URL_TELEGRAM = `https://telegram.me/share/url?url=`;

  // This dummy article link is used to replace all sharing instances for this application. This is because the application is not hosted on the public web yet.
  const DUMMY_MEDIUM_URL = `https://medium.com/@techcontentspecialist/the-abandoned-pet-1b15645cab5d`;

  const LINK_BUTTON_PROPS = {
    size: "sm",
    mb: 5,
    ml: -12,
    sx: { color: theme.colors.gray[6] },
    variant: "subtle",
    styles: {
      root: {
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
          color: theme.colors.gray[7],
        },
      },
      inner: {
        fontSize: "13px",
      },
    },
  };

  const openUrlInNewWindow = (url: string, id: string) => {
    window.open(url, id, "width=800,height=600");
  };

  const shareOnLinkedIn = () => {
    // LinkedIn does validation for SSL cert links, so gotta use this dummy article
    const url = SHARE_URL_LINKEDIN + encodeURIComponent(DUMMY_MEDIUM_URL);
    openUrlInNewWindow(url, "linkedin-share-dialog");
  };

  const shareOnFacebook = () => {
    const url = SHARE_URL_FACEBOOK + encodeURIComponent(DUMMY_MEDIUM_URL);
    openUrlInNewWindow(url, "facebook-share-dialog");
  };

  const shareOnTwitter = () => {
    const url = SHARE_URL_TWITTER + encodeURIComponent(currentUrl);
    openUrlInNewWindow(url, "twitter-share-dialog");
  };

  const shareOnTelegram = () => {
    const url = SHARE_URL_TELEGRAM + encodeURIComponent(currentUrl);
    openUrlInNewWindow(url, "telegram-share-dialog");
  };

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="lg"
      arrowSize={15}
      radius="xs"
      opened={sharePopoverOpen}
    >
      <Popover.Target>
        <ActionIcon mr="xs" onClick={() => toggleSharePopoverOpen()}>
          <IconShare size="1.25rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <CopyButton value={currentUrl}>
          {({ copied, copy }) => (
            <Button
              leftIcon={<IconPaperclip size="1.25rem" />}
              onClick={() => {
                if (adminView) return;
                copy();
                toggleSharePopoverOpen();
                notifications.show({
                  title: `Copied to Clipboard`,
                  color: "green",
                  icon: <IconCopy />,
                  message: "The article link has been copied to clipboard.",
                });
              }}
              {...LINK_BUTTON_PROPS}
            >
              Copy article link
            </Button>
          )}
        </CopyButton>
        <Divider mb={5} />
        <Button
          {...LINK_BUTTON_PROPS}
          leftIcon={<IconBrandLinkedin size="1.25rem" />}
          onClick={adminView ? null : shareOnLinkedIn}
        >
          Share on LinkedIn
        </Button>
        {/* I don't have facebook so can't test this 🗿 */}
        {/* <Button
          {...LINK_BUTTON_PROPS}
          leftIcon={<IconBrandFacebook size="1.25rem" />}
          onClick={shareOnFacebook}
        >
          Share on Facebook
        </Button> */}
        <Button
          {...LINK_BUTTON_PROPS}
          leftIcon={<IconBrandTwitter size="1.25rem" />}
          onClick={adminView ? null : shareOnTwitter}
        >
          Share on Twitter
        </Button>
        <Button
          {...LINK_BUTTON_PROPS}
          leftIcon={<IconBrandTelegram size="1.25rem" />}
          onClick={adminView ? null : shareOnTelegram}
        >
          Share on Telegram
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ArticleSharePopover;
