import {
  Card,
  Group,
  Image,
  Text,
  createStyles,
  Box,
  Badge,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ServiceListing } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";
import { FeaturedServiceListing } from "@/types/types";
import FavouriteButton from "../favourites/FavouriteButton";
import StarRating from "../review/StarRating";
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
    right: 2,
    zIndex: 2, // Above the overlay and image
  },
}));

interface ServiceListingCardProps {
  serviceListing: ServiceListing | FeaturedServiceListing;
  isFavourite?: boolean;
  onFavourite?(serviceListing: ServiceListing, isFavourite: boolean): void;
}

const IMAGE_HEIGHT = 180;

const ServiceListingCard = ({
  serviceListing,
  isFavourite: initialFavourite,
  onFavourite,
}: ServiceListingCardProps) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(initialFavourite);

  const isFeaturedListing = "featuredDescription" in serviceListing;

  if (!serviceListing) return null;

  const handleFavouriteToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onFavourite) {
      onFavourite(serviceListing, isFavourite);
    }
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
      {initialFavourite && (
        <FavouriteButton
          text=""
          isFavourite={isFavourite}
          onClick={handleFavouriteToggle}
          className={classes.favouriteButton}
          size={35}
        />
      )}
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
        <Group position="apart" mb="xs">
          <ServiceCategoryBadge category={serviceListing.category} />
          {serviceListing.listingTime !== serviceListing.dateCreated &&
            !isFavourite &&
            !isFeaturedListing && (
              <Badge
                color="indigo"
                leftSection={
                  <IconSparkles size="0.8rem" style={{ marginBottom: -2 }} />
                }
              >
                Bumped
              </Badge>
            )}
        </Group>
        <Text weight={600} size="md" lineClamp={1} sx={{ lineHeight: 1.4 }}>
          {serviceListing.title}
        </Text>
      </Box>

      <Box mb="xs" display="flex">
        <Text mr={5} fw={500} size="xs">
          {serviceListing?.overallRating === 0
            ? "No reviews"
            : `${serviceListing.overallRating.toFixed(1)}/5`}
        </Text>
        <StarRating
          value={serviceListing.overallRating}
          viewOnly
          allowFractions
          iconSize="1.15rem"
        />
        <Text mr={5} fw={500} size="xs" ml={3}>
          {serviceListing?.overallRating === 0 || !serviceListing.reviews
            ? ""
            : `(${serviceListing?.reviews?.length})`}
        </Text>
      </Box>
      {isFeaturedListing ? (
        <Text color="dimmed" size="sm" lineClamp={1}>
          {serviceListing.featuredDescription.toString()}
        </Text>
      ) : (
        <ServiceListingTags tags={serviceListing.tags} />
      )}

      <Group position="apart" align="center" mt="md">
        <Text size="sm" color="dimmed" lineClamp={1} maw={180}>
          {serviceListing.petBusiness?.companyName}
        </Text>
        <Text size="md" weight={500}>
          ${formatNumber2Decimals(serviceListing.basePrice)}
        </Text>
      </Group>
    </Card>
  );
};

export default ServiceListingCard;
