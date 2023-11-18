import { Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import nookies from "nookies";
import { useEffect } from "react";
import { Article, ServiceListing } from "shared-utils";
import api from "@/api/axiosConfig";
import AppointmentReminderModal from "@/components/common/landing/AppointmentReminderModal";
import Banner from "@/components/common/landing/Banner";
import Newsletter from "@/components/common/landing/Newsletter";
import ServicesSection from "@/components/common/landing/ServicesSection";
import SimpleFooter from "@/components/common/landing/SimpleFooter";
import WhyPetHub from "@/components/common/landing/WhyPetHub";
import ServiceListingScrollCarousel from "@/components/service-listing-discovery/ServiceListingScrollCarousel";
import { FeaturedServiceListing } from "@/types/types";
import { flattenAndFilterFeaturedListingsResponse } from "@/util";

interface HomeProps {
  hottestListings: FeaturedServiceListing[];
  almostGoneListings: FeaturedServiceListing[];
  allTimeFavsListings: FeaturedServiceListing[];
  risingListings: FeaturedServiceListing[];
  latestAnnouncementArticle: Article;
  bumpedListings: ServiceListing[];
}
export default function Home({
  hottestListings,
  almostGoneListings,
  allTimeFavsListings,
  risingListings,
  latestAnnouncementArticle,
  bumpedListings,
}: HomeProps) {
  // for appointment reminder modal
  const [opened, { open, close }] = useDisclosure(false);
  const [
    newsletterOpened,
    { toggle: toggleNewsletter, close: closeNewsletter },
  ] = useDisclosure(true);
  useEffect(() => open(), []);

  return (
    <>
      <Head>
        <title>PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Banner announcementArticle={latestAnnouncementArticle} />
        <ServicesSection />
        {hottestListings.length > 0 && (
          <Stack spacing={0} mb={80}>
            <ServiceListingScrollCarousel
              serviceListings={bumpedListings}
              title="Spotlighted listings"
              description="These listings were recently spotlighted!"
            />
            <ServiceListingScrollCarousel
              serviceListings={hottestListings}
              title="Hottest listings"
              description="Check out these top active service listings bought by PetHub users last week!"
            />
            <ServiceListingScrollCarousel
              serviceListings={almostGoneListings}
              title="Almost gone listings"
              description="These listings are expiring soon, catch them before they disappear!"
            />
            <ServiceListingScrollCarousel
              serviceListings={allTimeFavsListings}
              title="All time favourite listings"
              description="Check out these most favourited service listings loved by the PetHub community!"
            />
            <ServiceListingScrollCarousel
              serviceListings={risingListings}
              title="Rising listings"
              description="Discover these up and coming new service listings!"
            />
          </Stack>
        )}
        <WhyPetHub />
        <AppointmentReminderModal opened={opened} close={close} />
        <Newsletter opened={newsletterOpened} close={closeNewsletter} />
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

  const latestAnnouncementArticle = await (
    await api.get(`/articles/latest-announcement`)
  ).data;

  const featuredServiceListings =
    (await (await api.get(`/service-listings/get-featured-listings`)).data) ??
    [];
  const hottestListings =
    flattenAndFilterFeaturedListingsResponse(
      featuredServiceListings["HOTTEST_LISTINGS"].featuredListings,
    ) ?? [];
  const almostGoneListings =
    flattenAndFilterFeaturedListingsResponse(
      featuredServiceListings["ALMOST_GONE"].featuredListings,
    ) ?? [];
  const allTimeFavsListings =
    flattenAndFilterFeaturedListingsResponse(
      featuredServiceListings["ALL_TIME_FAVS"].featuredListings,
    ) ?? [];
  const risingListings =
    flattenAndFilterFeaturedListingsResponse(
      featuredServiceListings["RISING_LISTINGS"].featuredListings,
    ) ?? [];

  const bumpedListings =
    (await (await api.get(`/service-listings/get-bumped-listings`)).data) ?? [];

  return {
    props: {
      hottestListings,
      almostGoneListings,
      allTimeFavsListings,
      risingListings,
      latestAnnouncementArticle,
      bumpedListings,
    },
  };
}
