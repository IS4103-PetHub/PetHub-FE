import {
  useMantineTheme,
  Text,
  Card,
  Group,
  Grid,
  Button,
  CloseButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconExclamationCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { Article, formatISODateTimeShort } from "shared-utils";

interface AnnouncementArticleBannerProps {
  article: Article;
  closeBanner: () => void;
}

const AnnouncementArticleBanner = ({
  article,
  closeBanner,
}: AnnouncementArticleBannerProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [visible, { toggle }] = useDisclosure(false);

  if (!article) return null;

  return (
    <Card
      radius="lg"
      shadow="xs"
      sx={{ backgroundColor: theme.colors.gray[1] }}
    >
      <Grid columns={24}>
        <Grid.Col span={4}>
          <Group mt={2} align="center">
            <IconExclamationCircle size="1.5rem" color="gray" />
            <Text size="sm" color="dimmed">
              {formatISODateTimeShort(article?.dateCreated)}
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={16}>
          <Group mt={-2}>
            <Text fw={600}>{article?.title}</Text>
            <Button
              ml={-10}
              variant="subtle"
              leftIcon={
                <IconChevronRight size="1rem" style={{ marginRight: -10 }} />
              }
              size="xs"
              onClick={() => router.push(`/articles/${article.articleId}`)}
            >
              View
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={3} />
        <Grid.Col span={1}>
          <CloseButton onClick={closeBanner} size="md" mt={-1} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default AnnouncementArticleBanner;
