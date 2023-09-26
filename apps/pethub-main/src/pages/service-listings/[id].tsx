import { Carousel } from "@mantine/carousel";
import {
  Container,
  Text,
  Image,
  Button,
  Group,
  Grid,
  Accordion,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import axios from "axios";
import { useState } from "react";
import { PageTitle } from "web-ui";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import ServiceListingBreadcrumbs from "@/components/service-listing-discovery/ServiceListingBreadcrumbs";
import ServiceListingTags from "@/components/service-listing-discovery/ServiceListingTags";
import { ServiceListing } from "@/types/types";
import { formatPriceForDisplay } from "@/util";

interface ServiceListingDetailsProps {
  serviceListing: ServiceListing;
}

const IMAGE_HEIGHT = 500;

export default function ServiceListingDetails({
  serviceListing,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const [showFullDescription, setShowFullDescription] = useToggle();

  const hasMultipleImages = serviceListing.attachmentURLs.length > 1;

  const slides =
    serviceListing.attachmentURLs.length > 0 ? (
      serviceListing.attachmentURLs.map((url) => (
        <Carousel.Slide key={url}>
          <Image src={url} height={IMAGE_HEIGHT} alt="Service Listing Photo" />
        </Carousel.Slide>
      ))
    ) : (
      <Carousel.Slide key="placeholder">
        <Image
          src="/pethub-placeholder.png"
          height={500}
          alt="Service Listing Photo"
        />
      </Carousel.Slide>
    );

  const listingCarousel = (
    <Carousel
      withControls={hasMultipleImages}
      withIndicators={hasMultipleImages}
      loop
    >
      {slides}
    </Carousel>
  );

  // TO-DO: Add section for business details

  // const businessSection = (
  //   <Accordion.Item value="business" p="sm">
  //     <Accordion.Control>
  //       <Text size="xl" weight={600}>
  //         Where to use
  //       </Text>
  //     </Accordion.Control>
  //     <Accordion.Panel ml={5} mr={5}>
  //       <Text>Placeholder Name</Text>
  //     </Accordion.Panel>
  //   </Accordion.Item>
  // );

  const descriptionSection = (
    <Accordion.Item value="description" p="sm">
      <Accordion.Control sx={{ "&:hover": { cursor: "default" } }}>
        <Text size="xl" weight={600}>
          Description
        </Text>
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        <Text
          sx={{ whiteSpace: "pre-line" }}
          lineClamp={showFullDescription ? 0 : 4}
        >
          {serviceListing.description}
        </Text>
        <Group position="right" mt="md">
          <Button
            variant="outline"
            sx={{ border: "1.5px solid" }}
            onClick={() => setShowFullDescription()}
            display={
              serviceListing.description?.length < 200 ? "none" : "block"
            }
          >
            {showFullDescription ? "View less" : "View more"}
          </Button>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
      <Grid gutter="xl">
        <Grid.Col span={9}>
          <ServiceListingBreadcrumbs
            title={serviceListing.title}
            id={serviceListing.serviceListingId}
          />
          <ServiceCategoryBadge
            category={serviceListing.category}
            size="lg"
            mt="xl"
            mb={5}
          />
          <PageTitle
            title={serviceListing.title}
            mb="xs"
            size="2.25rem"
            weight={700}
          />
          <ServiceListingTags tags={serviceListing.tags} size="md" mb="xl" />
          {listingCarousel}

          <Accordion
            radius="md"
            variant="filled"
            value="description"
            mt="xl"
            mb="xl"
            chevronSize={0}
            onChange={() => {}}
          >
            {/* {businessSection} */}
            {descriptionSection}
          </Accordion>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper
            radius="md"
            bg={theme.colors.gray[0]}
            p="lg"
            withBorder
            mt={50}
          >
            <Group position="apart">
              <Text size="xl" weight={500}>
                ${formatPriceForDisplay(serviceListing.basePrice)}
              </Text>
            </Group>
            <Button size="md" fullWidth mt="xs">
              Add to cart
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const serviceListing = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/service-listings/${id}`,
    )
  ).data;
  return { props: { serviceListing } };
}
