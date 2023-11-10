import { Card, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface MiniSummaryCardProps {
  title: string;
  body: string;
  subbody?: string;
  link?: string;
}

const MiniSummaryCard = ({
  title,
  body,
  subbody,
  link,
}: MiniSummaryCardProps) => {
  return (
    <Card shadow="sm" p="md" mih={135} withBorder>
      {link ? (
        <Link href={link}>
          <Text mb={6} size="lg" align="center">
            {title}
          </Text>
        </Link>
      ) : (
        <Text mb={6} size="lg" align="center">
          {title}
        </Text>
      )}
      <Text size={"1.75rem"} fw={600} align="center" mt={subbody ? 0 : "md"}>
        {body}
      </Text>
      {subbody && (
        <Text align="center" color="dimmed" mt={-3}>
          {subbody}
        </Text>
      )}
    </Card>
  );
};

export default MiniSummaryCard;
