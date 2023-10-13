import { Accordion, Group, useMantineTheme, Text } from "@mantine/core";
import { IconBlockquote } from "@tabler/icons-react";
import React from "react";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";

interface DescriptionAccordionItemProps {
  title: string;
  description: string;
  showFullDescription: boolean;
  setShowFullDescription(): void;
}

const DescriptionAccordionItem = ({
  title,
  description,
  showFullDescription,
  setShowFullDescription,
}: DescriptionAccordionItemProps) => {
  const theme = useMantineTheme();
  return (
    <Accordion.Item value="description" p="sm">
      <Accordion.Control
        icon={<IconBlockquote color={theme.colors.indigo[5]} />}
        sx={{ "&:hover": { cursor: "default" } }}
      >
        <Text size="xl" weight={600}>
          {title}
        </Text>
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        <Text
          sx={{ whiteSpace: "pre-line" }}
          lineClamp={showFullDescription ? 0 : 4}
        >
          {description}
        </Text>
        <Group position="right" mt="md">
          <SimpleOutlineButton
            text={showFullDescription ? "View less" : "View more"}
            onClick={() => setShowFullDescription()}
            display={description.length < 350 ? "none" : "block"}
          />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default DescriptionAccordionItem;
