import { Carousel } from "@mantine/carousel";
import { Box, Container, useMantineTheme, Text } from "@mantine/core";
import React from "react";
import { ServiceListing } from "shared-utils";
import { PageTitle } from "web-ui";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";

interface ServiceListingScrollCarouselProps {
  serviceListings: ServiceListing[];
  title: string;
  description: string;
}

const ServiceListingScrollCarousel = ({
  serviceListings,
  title,
  description,
}: ServiceListingScrollCarouselProps) => {
  const theme = useMantineTheme();

  if (!serviceListings || serviceListings.length === 0) {
    return null;
  }

  return (
    <Box h={600} sx={{ backgroundColor: "white" }}>
      <Container fluid w="80vw" h="100%" pt={50}>
        <Box>
          <Text fw={600} pt="xl" size="1.5rem" color={theme.colors.dark[9]}>
            {title}
          </Text>
          <Text color="dimmed">{description}</Text>
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

export default ServiceListingScrollCarousel;
