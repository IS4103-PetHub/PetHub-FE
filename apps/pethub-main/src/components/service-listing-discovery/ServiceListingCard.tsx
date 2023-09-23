import { Carousel } from "@mantine/carousel";
import {
  Card,
  Group,
  rem,
  Image,
  Text,
  createStyles,
  Badge,
  Box,
} from "@mantine/core";
import React from "react";
import { formatStringToLetterCase } from "shared-utils";
import { ServiceListing } from "@/types/types";
import { formatPriceForDisplay } from "@/util";
import ServiceCategoryBadge from "./ServiceCategoryBadge";

const useStyles = createStyles((theme) => ({
  listingCard: {
    "&:hover": {
      transition: "margin 200ms ease-in-out",
      marginTop: -2,
      boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
      cursor: "pointer",
    },
  },

  carouselControls: {
    transition: "opacity 150ms ease",
    opacity: 0,
    "&:hover": {
      opacity: 0.8,
    },
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: "width 250ms ease",

    "&[data-active]": {
      width: rem(16),
    },
  },
}));

interface ServiceListingCardProps {
  serviceListing: ServiceListing;
}

const ServiceListingCard = ({ serviceListing }: ServiceListingCardProps) => {
  const { classes, cx } = useStyles();

  const images = [
    "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
  ];

  const slides = images.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={180} alt="Service Listing Photo" />
    </Carousel.Slide>
  ));

  const tags = serviceListing.tags?.map((tag) => (
    <Badge color="gray" size="sm" key={tag.tagId}>
      {tag.name}
    </Badge>
  ));

  return (
    <Card radius="md" withBorder padding="lg" className={classes.listingCard}>
      <Card.Section>
        <Carousel
          controlSize={20}
          withControls={images.length > 1}
          withIndicators={images.length > 1}
          loop
          classNames={{
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {slides}
        </Carousel>
      </Card.Section>

      <Box mt="md" mb="xs">
        <ServiceCategoryBadge category={serviceListing.category} mb="xs" />
        <Text weight={600} size="md" lineClamp={2} sx={{ lineHeight: 1.4 }}>
          {serviceListing.title}
        </Text>
      </Box>

      <Group spacing={5}>
        {/* {tags} */}
        <Badge color="gray" size="sm">
          Tag 1
        </Badge>
        <Badge color="gray" size="sm">
          Tag 2
        </Badge>
        <Badge color="gray" size="sm">
          Tag 3
        </Badge>
      </Group>

      <Group position="apart" align="center" mt="md">
        <Text size="sm" color="dimmed" lineClamp={1} maw={180}>
          Placeholder Text
        </Text>
        <Text size="md" weight={500}>
          ${formatPriceForDisplay(serviceListing.basePrice)}
        </Text>
      </Group>
    </Card>
  );
};

export default ServiceListingCard;
