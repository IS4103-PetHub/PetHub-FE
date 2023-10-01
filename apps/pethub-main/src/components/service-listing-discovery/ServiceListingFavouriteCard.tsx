import { Card, Group, Image, Text, createStyles, Box } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ServiceListing } from "shared-utils";
import { formatPriceForDisplay } from "@/util";
import FavouriteButton from "../favourites/FavouriteButton";
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
  relativeBox: {
    position: "relative",
    zIndex: 0, // Establish stacking context
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: "rgba(0,0,0,0.2)", // Uniform dark overlay
      zIndex: 1, // Above the image
      pointerEvents: "none",
      transition: "opacity 0.3s ease",
    },

    "&:hover::before": {
      opacity: 0, // Hide the overlay on hover
    },
    "& > img": {
      zIndex: -1, // Place the image below the overlay
    },
  },
  favouriteButton: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 2, // Above the overlay and image
  },
}));

interface ServiceListingFavouriteCardProps {
  serviceListing: ServiceListing;
  currentFavourite: boolean;
  onFavourite(serviceListing: ServiceListing, isFavourite: boolean): void;
}

const IMAGE_HEIGHT = 180;

const ServiceListingFavouriteCard = ({
  serviceListing,
  currentFavourite,
  onFavourite,
}: ServiceListingFavouriteCardProps) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(currentFavourite);

  if (!serviceListing) return null;

  const handleFavouriteToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFavourite(serviceListing, isFavourite);
    setIsFavourite(!isFavourite);
  };

  const coverImage = (
    <Box className={classes.relativeBox}>
      <Image
        src={
          serviceListing.attachmentURLs.length > 0
            ? serviceListing.attachmentURLs[0]
            : "/pethub-placeholder.png"
        }
        height={IMAGE_HEIGHT}
        alt="Service Listing Photo"
      />
      <FavouriteButton
        text=""
        isFavourite={isFavourite}
        onClick={handleFavouriteToggle}
        className={classes.favouriteButton}
        size={35}
      />
    </Box>
  );
  return (
    <Card
      radius="md"
      withBorder
      padding="lg"
      className={classes.listingCard}
      onClick={() =>
        router.push(`/service-listings/${serviceListing.serviceListingId}`)
      }
    >
      <Card.Section>{coverImage}</Card.Section>

      <Box mt="md" mb="xs">
        <ServiceCategoryBadge category={serviceListing.category} mb="xs" />
        <Text weight={600} size="md" lineClamp={1} sx={{ lineHeight: 1.4 }}>
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

export default ServiceListingFavouriteCard;
