import { Container } from "@mantine/core";
import Head from "next/head";
import PageTitle from "@/components/common/PageTitle";

export default function Home() {
  return (
    <>
      <Head>
        <title>PetHub - Admin Portal</title>
        <meta name="description" content="Admin portal for PetHub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container fluid>
          <PageTitle title="Welcome" />
        </Container>
      </main>
    </>
  );
}
