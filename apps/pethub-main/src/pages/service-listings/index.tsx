import { Box, Container, Grid, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";
import ServiceListingsSideBar from "@/components/service-listing-discovery/ServiceListingsSideBar";
import { useGetAllServiceListings } from "@/hooks/service-listing";

export default function ServiceListings() {
  const isMobile = useMediaQuery("(max-width: 64em)");
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const { data: serviceListings = [] } = useGetAllServiceListings();
  const router = useRouter();

  useEffect(() => console.log(serviceListings), [serviceListings]);

  const listingCards = serviceListings.map((serviceListing) => (
    <Grid.Col
      key={serviceListing.serviceListingId}
      span={isMobile ? 12 : isTablet ? 4 : 3}
      onClick={() =>
        router.push(`${router.asPath}/${serviceListing.serviceListingId}`)
      }
    >
      <ServiceListingCard serviceListing={serviceListing} />
    </Grid.Col>
  ));

  return (
    <>
      <Head>
        <title>Service Listings - Pet Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <Grid m={isMobile ? 20 : 50}>
            <Grid.Col span={2} hidden={isMobile}>
              <ServiceListingsSideBar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </Grid.Col>
            <Grid.Col span={isMobile ? 12 : 10}>
              <Box ml="xl">
                <PageTitle title="All service listings" />
              </Box>
              <Grid gutter="lg" m="sm">
                {listingCards}
              </Grid>
            </Grid.Col>
          </Grid>
        </Container>
      </main>
    </>
  );
}
