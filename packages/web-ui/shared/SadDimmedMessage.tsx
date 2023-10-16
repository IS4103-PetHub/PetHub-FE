import { Box, Center, Container, Text, useMantineTheme } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { ReactNode } from "react";

interface SadDimmedMessageProps {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  replaceIcon?: ReactNode;
}

const SadDimmedMessage = ({
  title,
  subtitle,
  disabled,
  replaceIcon,
}: SadDimmedMessageProps) => {
  const theme = useMantineTheme();

  if (disabled) return null;

  return (
    <Container fluid className="center-vertically">
      <Box>
        <Center mb={15}>
          {replaceIcon ? (
            replaceIcon
          ) : (
            <IconMoodSad
              size={80}
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.gray[6]
                  : theme.colors.gray[4]
              }
              strokeWidth="1.5"
            />
          )}
        </Center>
        <Text size="xl" weight={500} color="dimmed" align="center" mb={10}>
          {title}
        </Text>

        {subtitle && (
          <Text size="md" color="dimmed" align="center">
            {subtitle}
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default SadDimmedMessage;
