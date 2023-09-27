import { Container, Alert, Center, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

const InactivePetBusinessMessage = () => {
  const router = useRouter();
  return (
    <Container mt={50}>
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Account Inactive"
        color="red"
      >
        This pet business account is inactive and cannot be viewed.
      </Alert>
      <Center>
        <Button mt="md" onClick={() => router.push("/")}>
          Return to home
        </Button>
      </Center>
    </Container>
  );
};

export default InactivePetBusinessMessage;
