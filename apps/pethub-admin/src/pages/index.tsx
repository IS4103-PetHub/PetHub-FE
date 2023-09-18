import { Container, Text } from "@mantine/core";
import axios from "axios";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";

interface HomeProps {
  name: string;
}

export default function Home({ name }: HomeProps) {
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
          <PageTitle title={`Welcome, ${name}`} />
        </Container>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const user = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/users/internal-users/${userId}`,
    )
  ).data;

  const name = `${user.firstName} ${user.lastName}`;

  return { props: { name } };
}
