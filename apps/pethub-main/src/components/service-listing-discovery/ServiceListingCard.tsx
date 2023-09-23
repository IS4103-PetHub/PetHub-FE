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
}));

interface ServiceListingCardProps {
  serviceListing: ServiceListing;
}

const ServiceListingCard = ({ serviceListing }: ServiceListingCardProps) => {
  const { classes, cx } = useStyles();

  const placeholderImage = "pethub-placeholder.png";

  const coverImage =
    serviceListing.attachmentURLs.length > 0 ? (
      <Image
        src={serviceListing.attachmentURLs[0]}
        height={180}
        alt="Service Listing Photo"
      />
    ) : (
      <Image src={placeholderImage} height={180} alt="Service Listing Photo" />
    );

  const tags = serviceListing.tags?.map((tag) => (
    <Badge color="gray" size="sm" key={tag.tagId}>
      {tag.name}
    </Badge>
  ));

  return (
    <Card radius="md" withBorder padding="lg" className={classes.listingCard}>
      <Card.Section>{coverImage}</Card.Section>

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
