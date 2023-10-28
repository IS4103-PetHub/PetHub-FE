import { Container, Alert, Center, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";

interface ViewServiceListingErrorMessageProps {
  title: string;
  description: string;
}

const ViewServiceListingErrorMessage = ({
  title,
  description,
}: ViewServiceListingErrorMessageProps) => {
  const router = useRouter();
  return (
    <Container mt={50}>
      <Alert icon={<IconAlertCircle size="1rem" />} title={title} color="red">
        {description}
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

export default ViewServiceListingErrorMessage;
