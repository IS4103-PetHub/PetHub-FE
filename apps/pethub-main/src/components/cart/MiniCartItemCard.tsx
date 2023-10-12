import { Card, Grid, Image, Alert, Text, Button } from "@mantine/core";

import { useRouter } from "next/router";
import { ServiceListing, convertMinsToDurationString } from "shared-utils";
import { formatPriceForDisplay } from "@/util";
import CartItemBadge from "./CartItemBadge";

interface MiniCartItemCardProps {
  serviceListing: ServiceListing;
  closePopup: () => void;
  removeItem: () => void;
  quantity?: number;
}

const MiniCartItemCard = ({
  serviceListing,
  closePopup,
  removeItem,
  quantity,
}: MiniCartItemCardProps) => {
  const router = useRouter();

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // We dont want the cart page link on headerbar to trigger
    router.push(`/service-listings/${serviceListing.serviceListingId}`);
    closePopup();
  };
  return (
    <Card
      withBorder
      mb={4}
      radius="sm"
      shadow="xs"
      mah={90}
      mih={90}
      onClick={handleCardClick}
    >
      <Grid columns={24}>
        <Grid.Col span={4}>
          {serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={serviceListing.attachmentURLs[0]}
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              fit="contain"
              w="auto"
              alt="Cart Item Photo"
            />
          )}
        </Grid.Col>
        <Grid.Col span={14}>
          <Text fw={600} size={14} lineClamp={2}>
            {serviceListing.title} &nbsp;
          </Text>
          <Text size={14}>
            {"$" + formatPriceForDisplay(serviceListing.basePrice)}{" "}
            {quantity && quantity !== 1 && `(${quantity})`}
          </Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            color="red"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeItem();
            }}
          >
            Remove
          </Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default MiniCartItemCard;
