import { Container } from "@mantine/core";
import { Inter } from "next/font/google";
import Head from "next/head";
import Banner from "@/components/common/landing/Banner";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>PetHub - Main</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Banner />
        <Container fluid />
      </main>
    </>
  );
}
