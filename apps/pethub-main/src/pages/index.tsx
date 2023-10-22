import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import nookies from "nookies";
import { useEffect } from "react";
import { ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";
import AppointmentReminderModal from "@/components/common/landing/AppointmentReminderModal";
import Banner from "@/components/common/landing/Banner";
import ServicesSection from "@/components/common/landing/ServicesSection";
import SimpleFooter from "@/components/common/landing/SimpleFooter";
import WhyPetHub from "@/components/common/landing/WhyPetHub";
import ServiceListingScrollCarousel from "@/components/service-listing-discovery/ServiceListingScrollCarousel";

const LIMIT_SIZE = 6;
interface HomeProps {
  newServiceListings: ServiceListing[];
}
export default function Home({ newServiceListings }: HomeProps) {
  // for appointment reminder modal
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => open(), []);

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
        <ServiceListingScrollCarousel
          serviceListings={newServiceListings}
          title="New listings"
        />
        <WhyPetHub />
        <AppointmentReminderModal opened={opened} close={close} />
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
