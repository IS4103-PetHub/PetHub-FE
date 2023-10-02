import { Carousel } from "@mantine/carousel";
import { Box, Container, useMantineTheme } from "@mantine/core";
import React from "react";
import { ServiceListing } from "shared-utils";
import { PageTitle } from "web-ui";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";

interface NewListingsProps {
  serviceListings: ServiceListing[];
}

const NewListings = ({ serviceListings }: NewListingsProps) => {
  const theme = useMantineTheme();
  return (
    <Box h={600} sx={{ backgroundColor: "white" }}>
      <Container fluid w="80vw" h="100%" pt={50}>
        <Box>
          <PageTitle
            title="New listings"
            pt="xl"
            color={theme.colors.dark[9]}
          />
        </Box>
        <Carousel
          mt="xl"
          slideSize="70%"
          height="100%"
          align="start"
          slideGap="md"
          loop
          controlSize={18}
        >
          {serviceListings.map((serviceListing) => (
            <Carousel.Slide size="30%" key={serviceListing.serviceListingId}>
              <ServiceListingCard serviceListing={serviceListing} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default NewListings;
