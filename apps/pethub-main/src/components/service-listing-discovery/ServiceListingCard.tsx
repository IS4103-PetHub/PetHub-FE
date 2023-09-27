import { Card, Group, Image, Text, createStyles, Box } from "@mantine/core";
import React from "react";
import { ServiceListing } from "shared-utils";
import { formatPriceForDisplay } from "@/util";
import ServiceCategoryBadge from "./ServiceCategoryBadge";
import ServiceListingTags from "./ServiceListingTags";

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

const IMAGE_HEIGHT = 180;

const ServiceListingCard = ({ serviceListing }: ServiceListingCardProps) => {
  const { classes, cx } = useStyles();

  const coverImage = (
    <Image
      src={
        serviceListing.attachmentURLs.length > 0
          ? serviceListing.attachmentURLs[0]
          : "pethub-placeholder.png"
      }
      height={IMAGE_HEIGHT}
      alt="Service Listing Photo"
    />
  );
  return (
    <Card radius="md" withBorder padding="lg" className={classes.listingCard}>
      <Card.Section>{coverImage}</Card.Section>

      <Box mt="md" mb="xs">
        <ServiceCategoryBadge category={serviceListing.category} mb="xs" />
        <Text weight={600} size="md" lineClamp={2} sx={{ lineHeight: 1.4 }}>
          {serviceListing.title}
        </Text>
      </Box>

      <ServiceListingTags tags={serviceListing.tags} />

      <Group position="apart" align="center" mt="md">
        <Text size="sm" color="dimmed" lineClamp={1} maw={180}>
          {serviceListing.petBusiness?.companyName}
        </Text>
        <Text size="md" weight={500}>
          ${formatPriceForDisplay(serviceListing.basePrice)}
        </Text>
      </Group>
    </Card>
  );
};

export default ServiceListingCard;
