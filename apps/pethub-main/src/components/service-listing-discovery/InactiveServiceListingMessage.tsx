import { Container, Alert, Center, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

const InactiveServiceListingMessage = () => {
  const router = useRouter();
  return (
    <Container mt={50}>
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Inactive Pet Business"
        color="red"
      >
        This service listing cannot be viewed at the moment as the pet business
        account is inactive.
      </Alert>
      <Center>
        <Button
          mt="md"
          color="dark"
          onClick={() => router.push("/service-listings")}
        >
          Browse other listings
        </Button>
      </Center>
    </Container>
  );
};

export default InactiveServiceListingMessage;
