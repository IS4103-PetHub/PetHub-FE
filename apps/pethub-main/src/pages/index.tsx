import Head from "next/head";
import nookies from "nookies";
import { ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";
import Banner from "@/components/common/landing/Banner";
import NewListings from "@/components/common/landing/NewListings";
import ServicesSection from "@/components/common/landing/ServicesSection";
import SimpleFooter from "@/components/common/landing/SimpleFooter";
import WhyPetHub from "@/components/common/landing/WhyPetHub";

const LIMIT_SIZE = 6;
interface HomeProps {
  newServiceListings: ServiceListing[];
}
export default function Home({ newServiceListings }: HomeProps) {
  return (
    <>
      <Head>
        <title>PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Banner />
        <ServicesSection />
        <NewListings serviceListings={newServiceListings} />
        <WhyPetHub />
      </main>
      <SimpleFooter />
    </>
  );
}

export async function getServerSideProps(context) {
  const originalPath = context.query.originalPath || context.req.url;
  nookies.set(context, "originalPath", originalPath, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  const newServiceListings =
    (await (
      await api.get(`/service-listings/active?limit=${LIMIT_SIZE}`)
    ).data) ?? [];

  return { props: { newServiceListings } };
}
