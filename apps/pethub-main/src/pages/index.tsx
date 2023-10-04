import { Container } from "@mantine/core";
import Head from "next/head";
import nookies from "nookies";
import Banner from "@/components/common/landing/Banner";

export default function Home() {
  return (
    <>
      <Head>
        <title>PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Banner />
        <Container fluid />
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const originalPath = ctx.query.originalPath || ctx.req.url;
  nookies.set(ctx, "originalPath", originalPath, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  return { props: { originalPath } };
}
