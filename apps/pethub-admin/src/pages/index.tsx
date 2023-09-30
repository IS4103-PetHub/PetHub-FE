import { Container, Text } from "@mantine/core";
import Head from "next/head";
import { useEffect } from "react";
import { PageTitle } from "web-ui";
import { useLoadingOverlay } from "web-ui/shared/LoadingOverlayContext";

export default function Home() {
  const { showOverlay, hideOverlay } = useLoadingOverlay();

  useEffect(() => {
    hideOverlay(); // Hide the overlay that was triggered via a login
  }, []);

  return (
    <>
      <Head>
        <title>Admin Portal - PetHub</title>
        <meta name="description" content="Admin portal for PetHub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <Text color="dimmed" w="50vw" size="md">
            Admin Management Portal
          </Text>
          <PageTitle title="Welcome" />
        </Container>
      </main>
    </>
  );
}
