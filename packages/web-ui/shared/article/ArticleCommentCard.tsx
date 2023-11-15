import {
  Button,
  Container,
  Group,
  useMantineTheme,
  Image,
  Avatar,
  ActionIcon,
  Stack,
  Text,
  Box,
  Divider,
  Badge,
  Drawer,
  rem,
  createStyles,
  Card,
  Textarea,
  Menu,
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Article,
  ArticleComment,
  PetOwner,
  Tag,
  calculateArticleEstimatedReadingTime,
  displayArticleCommentDate,
  displayArticleDate,
  formatISODateTimeShort,
  formatISODayDateTime,
  formatStringToLetterCase,
  validateArticleComment,
} from "shared-utils";
import { CreateUpdateArticleCommentPayload } from "../../../../apps/pethub-main/src/types/types";
import { PageTitle } from "../PageTitle";

interface ArticleCommentCardProps {
  articleComment: ArticleComment;
}

const ArticleCommentCard = ({ articleComment }: ArticleCommentCardProps) => {
  const theme = useMantineTheme();

  const [showFullComment, toggleShowFullComment] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);

  // This is a hacky way to check if the text exceeds 2 lines in the DOM
  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
  }, [articleComment?.comment]);

  return (
    <Card>
      <Group position="apart">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar radius="xl" size="md" mr={10} color="blue" />
          <Box>
            <Text size={13} fw={500}>
              {articleComment?.PetOwner?.firstName}{" "}
              {articleComment?.PetOwner?.lastName}
            </Text>
            <Text size={11}>
              {displayArticleCommentDate(articleComment?.dateCreated)}{" "}
              {articleComment?.dateUpdated && "(edited)"}
            </Text>
          </Box>
        </Box>
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon>
              <IconDots size="1rem" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconPencil size={rem(14)} />}>Edit</Menu.Item>
            <Menu.Item icon={<IconTrash size={rem(14)} />}>Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Box mt="sm">
        <Text size="sm" lineClamp={showFullComment ? 0 : 5} ref={textRef}>
          {articleComment?.comment}
        </Text>
        <Group position="right">
          <Button
            compact
            variant="subtle"
            color="blue"
            size="xs"
            onClick={() => toggleShowFullComment()}
            mt="xs"
            mr="xs"
            display={textExceedsLineClamp ? "block" : "none"}
          >
            {showFullComment ? "View less" : "View more"}
          </Button>
        </Group>
      </Box>
      <Divider mt="lg" mb={-10} />
    </Card>
  );
};

export default ArticleCommentCard;
