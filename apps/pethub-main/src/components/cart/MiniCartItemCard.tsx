import {
  Card,
  Grid,
  Image,
  Text,
  Button,
  useMantineTheme,
} from "@mantine/core";

import { useRouter } from "next/router";
import { ServiceListing } from "shared-utils";
import { formatNumber2Decimals } from "shared-utils";

const IMAGE_SIZE = 50;

interface MiniCartItemCardProps {
  serviceListing: ServiceListing;
  closePopup: () => void;
  removeItem: () => void;
  quantity: number;
}

const MiniCartItemCard = ({
  serviceListing,
  closePopup,
  removeItem,
  quantity,
}: MiniCartItemCardProps) => {
  const router = useRouter();
  const theme = useMantineTheme();

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // We dont want the cart page link on headerbar to trigger
    router.push(`/service-listings/${serviceListing.serviceListingId}`);
    closePopup();
  };
  return (
    <Card
      withBorder
      mb="xs"
      radius="md"
      shadow="xs"
      h={90}
      sx={{ backgroundColor: theme.colors.gray[0] }}
      onClick={handleCardClick}
    >
      <Grid columns={24}>
        <Grid.Col span={4}>
          {serviceListing?.attachmentURLs?.length > 0 ? (
            <Image
              radius="md"
              src={serviceListing.attachmentURLs[0]}
              height={IMAGE_SIZE}
              alt="Cart Item Photo"
            />
          ) : (
            <Image
              radius="md"
              src="/pethub-placeholder.png"
              height={IMAGE_SIZE}
              alt="Cart Item Photo"
            />
          )}
        </Grid.Col>
        <Grid.Col span={15}>
          <Text fw={600} size={14} lineClamp={2}>
            {serviceListing.title} &nbsp;
          </Text>
          <Text size={14}>
            {"$" + formatNumber2Decimals(serviceListing.basePrice)}
            {quantity && quantity !== 1 && `(${quantity})`}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Button
            color="red"
            compact
            variant="light"
            sx={{ border: "1px solid" }}
            mr={0}
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
