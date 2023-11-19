import { Carousel } from "@mantine/carousel";
import { Box, Container, useMantineTheme, Text } from "@mantine/core";
import React from "react";
import { ServiceListing } from "shared-utils";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";
import { FeaturedServiceListing } from "@/types/types";

interface ServiceListingScrollCarouselProps {
  serviceListings: ServiceListing[] | FeaturedServiceListing[];
  title: string;
  description?: string;
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
    <Box sx={{ backgroundColor: "white" }}>
      <Container fluid w="80vw" h="100%" pt={50}>
        <Box>
          <Text fw={600} size="1.5rem" color={theme.colors.dark[9]}>
            {title}
          </Text>
          {description && <Text color="dimmed">{description}</Text>}
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
          {serviceListings.map(
            (serviceListing: ServiceListing | FeaturedServiceListing) => (
              <Carousel.Slide size="30%" key={serviceListing.serviceListingId}>
                <ServiceListingCard serviceListing={serviceListing} />
              </Carousel.Slide>
            ),
          )}
        </Carousel>
      </Container>
    </Box>
  );
};

export default ServiceListingScrollCarousel;
