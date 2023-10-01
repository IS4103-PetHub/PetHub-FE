import {
  Card,
  Group,
  Image,
  Text,
  createStyles,
  Box,
  Button,
} from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
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
  },
  favouriteButton: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
}));

interface ServiceListingFavouriteCardProps {
  serviceListing: ServiceListing;
  currentFavourite: boolean;
  onFavourite(serviceListingId: number, isFavourite: boolean): void;
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
    onFavourite(serviceListing.serviceListingId, isFavourite);
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
      {/* <Button
        className={classes.favouriteButton}
        onClick={handleFavouriteToggle}
        variant={"subtle"}
        color={isFavourite ? null : "gray"}
      >
        <IconHeart size={35} fill={isFavourite ? "red" : "none"} />
      </Button> */}
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

export default ServiceListingFavouriteCard;
