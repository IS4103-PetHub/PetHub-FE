import { Container, Text } from "@mantine/core";
import Head from "next/head";
import { PageTitle } from "web-ui";

export default function Home() {
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
