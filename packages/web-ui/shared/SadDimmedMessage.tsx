import {
  Box,
  Button,
  Center,
  Container,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { ReactNode } from "react";

interface SadDimmedMessageProps {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  replaceIcon?: ReactNode;
  button?: ReactNode;
  replaceClass?: string;
  removeWidth?: boolean;
}

const SadDimmedMessage = ({
  title,
  subtitle,
  disabled,
  replaceIcon,
  button,
  replaceClass,
  removeWidth,
}: SadDimmedMessageProps) => {
  const theme = useMantineTheme();

  if (disabled) return null;

  return (
    <Container fluid className={replaceClass || "center-vertically"}>
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
        <Text
          size="xl"
          weight={500}
          color="dimmed"
          align="center"
          mb={10}
          style={removeWidth ? {} : { width: "50vw" }}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            size="md"
            color="dimmed"
            align="center"
            style={removeWidth ? {} : { width: "50vw" }}
          >
            {subtitle}
          </Text>
        )}
        {button && <Center mt="lg">{button}</Center>}
      </Box>
    </Container>
  );
};

export default SadDimmedMessage;
