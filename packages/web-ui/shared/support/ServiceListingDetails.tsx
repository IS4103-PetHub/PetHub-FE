import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconClipboardList } from "@tabler/icons-react";
import { IconPhotoPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ReactNode, useState, useRef, useEffect } from "react";
import {
  SupportTicket,
  formatNumber2Decimals,
  formatStringToLetterCase,
} from "shared-utils";

interface ServiceListingDetailsProps {
  supportTicket: SupportTicket;
  isAdmin?: boolean;
}

export default function ServiceListingDetails({
  supportTicket,
  isAdmin,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [showFullDescriptionDescription, toggleShowFullDescriptionDescription] =
    useToggle();
  const [textExceedsLineClampDescription, setTextExceedsLineClampDescription] =
    useState(false);
  const textRefDescription = useRef(null);

  useEffect(() => {
    if (textRefDescription.current) {
      const lineHeight = parseInt(
        getComputedStyle(textRefDescription.current).lineHeight,
      );
      const textHeight = textRefDescription.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClampDescription(true);
      }
    }
  }, [supportTicket.serviceListing?.description]);

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={7} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={17} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  return (
    <Box mb="md">
      <Group position="apart">
        <Text fw={600} size="md">
          <IconClipboardList size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Service Listing Details
        </Text>
        {isAdmin && (
          <Button
            color="indigo"
            onClick={() =>
              router.push(
                `/admin/service-listings/${supportTicket.serviceListingId}`,
              )
            }
          >
            View
          </Button>
        )}
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Service Listing ID",
          <Text>{supportTicket.serviceListing.serviceListingId}</Text>,
        )}
        {generateItemGroup(
          "Title",
          <Text>{supportTicket.serviceListing.title}</Text>,
        )}
        {generateItemGroup(
          "Description",
          <Box>
            <Text
              lineClamp={showFullDescriptionDescription ? 0 : 2}
              ref={textRefDescription}
            >
              {supportTicket.serviceListing?.description}
            </Text>
            <Group position="right">
              <Button
                compact
                variant="subtle"
                color="blue"
                size="xs"
                onClick={() => toggleShowFullDescriptionDescription()}
                mt="xs"
                mr="xs"
                display={textExceedsLineClampDescription ? "block" : "none"}
              >
                {showFullDescriptionDescription ? "View less" : "View more"}
              </Button>
            </Group>
          </Box>,
        )}
        {generateItemGroup(
          "Category",
          <Badge ml={-2}>
            {formatStringToLetterCase(supportTicket.serviceListing?.category)}
          </Badge>,
        )}
        {generateItemGroup(
          "Price",
          <Text>
            $ {formatNumber2Decimals(supportTicket.serviceListing?.basePrice)}
          </Text>,
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );
}
