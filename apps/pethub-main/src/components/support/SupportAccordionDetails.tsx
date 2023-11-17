import {
  Accordion,
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
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { IconListDetails, IconPhotoPlus } from "@tabler/icons-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  SupportTicket,
  SupportTicketReason,
  SupportTicketStatus,
  downloadFile,
  extractFileName,
  formatEnumValueToLowerCase,
  formatISODayDateTime,
  getErrorMessageProps,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import BookingDetails from "web-ui/shared/support/BookingDetails";
import OrderItemDetails from "web-ui/shared/support/OrderItemDetails";
import PayoutInvoiceDetails from "web-ui/shared/support/PayoutInvoiceDetails";
import RefundRequestDetails from "web-ui/shared/support/RefundRequestDetails";
import ServiceListingDetails from "web-ui/shared/support/ServiceListingDetails";
import {
  useCloseResolveSupportTicket,
  useReopenSupportTicket,
} from "@/hooks/support";

interface SupportAccordionDetailsProps {
  supportTicket: SupportTicket;
  refetch(): void;
  canEdit: boolean;
  refetchTableData(): void;
}

export default function SupportAccordionDetails({
  supportTicket,
  refetch,
  canEdit,
  refetchTableData,
}: SupportAccordionDetailsProps) {
  const theme = useMantineTheme();

  const [showFullDescriptionReason, toggleShowFullDescriptionReason] =
    useToggle();
  const [textExceedsLineClampReason, setTextExceedsLineClampReason] =
    useState(false);
  const textRefReason = useRef(null);

  const [imagePreview, setImagePreview] = useState([]);

  const statusColorMap = new Map([
    [SupportTicketStatus.Pending, "orange"],
    [SupportTicketStatus.InProgress, "orange"],
    [SupportTicketStatus.ClosedResolved, "green"],
    [SupportTicketStatus.ClosedUnresolved, "red"],
  ]);

  const categoryColorMap = new Map([
    [SupportTicketReason.GeneralEnquiry, "blue"],
    [SupportTicketReason.ServiceListing, "cyan"],
    [SupportTicketReason.Orders, "grape"],
    [SupportTicketReason.Appointments, "green"],
    [SupportTicketReason.Payments, "indigo"],
    [SupportTicketReason.Refunds, "orange"],
    [SupportTicketReason.Accounts, "lime"],
    [SupportTicketReason.Others, "gray"],
  ]);

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

  useEffect(() => {
    const fetchAndSetImages = async () => {
      if (supportTicket) {
        await setImages();
      }
    };
    fetchAndSetImages();
  }, [supportTicket]);

  useEffect(() => {
    if (textRefReason.current) {
      const lineHeight = parseInt(
        getComputedStyle(textRefReason.current).lineHeight,
      );
      const textHeight = textRefReason.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClampReason(true);
      }
    }
  }, [supportTicket?.reason]);

  const setImages = async () => {
    const fileNames = supportTicket.attachmentKeys.map((keys) =>
      extractFileName(keys),
    );

    const downloadPromises = fileNames.map((filename, index) => {
      const url = supportTicket.attachmentURLs[index];
      return downloadFile(url, filename).catch((error) => {
        console.error(`Error downloading file ${filename}:`, error);
        return null; // Return null for failed downloads
      });
    });
    const downloadedFiles: File[] = await Promise.all(downloadPromises);
    const imageUrls = downloadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(imageUrls);
  };

  const closeSupportTicketMutation = useCloseResolveSupportTicket(
    supportTicket.supportTicketId,
  );
  const reopenSupportTicketMutation = useReopenSupportTicket(
    supportTicket.supportTicketId,
  );
  async function handleAction() {
    try {
      if (canEdit) {
        await closeSupportTicketMutation.mutateAsync();
        notifications.show({
          title: "Support Ticket Closed",
          color: "green",
          icon: <IconCheck />,
          message: `Support Ticket successfully closed`,
        });
      } else {
        await reopenSupportTicketMutation.mutateAsync();
        notifications.show({
          title: "Support Ticket Reopened",
          color: "green",
          icon: <IconCheck />,
          message: `Support Ticket successfully Reopened`,
        });
      }
      refetch();
      refetchTableData();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Closing Support Ticket", error),
      });
    }
  }

  return (
    <Accordion.Item value="details" pl={30} pr={30} pt={15} pb={10}>
      <Group position="apart" mt={5}>
        <Text size="xl">
          <b>Support Ticket Details</b> | ID. {supportTicket?.supportTicketId}
        </Text>
        {supportTicket.status != SupportTicketStatus.ClosedResolved && (
          <DeleteActionButtonModal
            title={canEdit ? "Close Support Ticket" : "Reopen Support Ticket"}
            onDelete={() => handleAction()}
            subtitle={
              canEdit
                ? "Are you sure you want to close the support ticket? Once the support ticket is closed, it cannot be reopened."
                : "Are you sure you want to reopen the support ticket?"
            }
            large
            largeText={canEdit ? "Close as Resolved" : "Reopen"}
            removeIcon
            overrideDeleteButtonText={canEdit ? "Close" : "Reopen"}
            buttonColor={canEdit ? "red" : "teal"}
          />
        )}
      </Group>
      <Box>
        <Divider mb="lg" mt="lg" />
        <Group>
          <IconListDetails size="1rem" color={theme.colors.indigo[5]} />
          <Text fw={600} size="md">
            Support Ticket Overview
          </Text>
        </Group>
        <Grid columns={24} mt="xs">
          {generateItemGroup(
            "Reason",
            <Box>
              <Text
                lineClamp={showFullDescriptionReason ? 0 : 2}
                ref={textRefReason}
              >
                {supportTicket?.reason}
              </Text>
              <Group position="right">
                <Button
                  compact
                  variant="subtle"
                  color="blue"
                  size="xs"
                  onClick={() => toggleShowFullDescriptionReason()}
                  mt="xs"
                  mr="xs"
                  display={textExceedsLineClampReason ? "block" : "none"}
                >
                  {showFullDescriptionReason ? "View less" : "View more"}
                </Button>
              </Group>
            </Box>,
          )}
          {generateItemGroup(
            "Status",
            <Badge
              color={
                statusColorMap.has(supportTicket?.status)
                  ? statusColorMap.get(supportTicket.status)
                  : "gray"
              }
            >
              {formatEnumValueToLowerCase(supportTicket?.status)}
            </Badge>,
          )}
          {generateItemGroup(
            "Category",
            <Badge
              color={
                categoryColorMap.has(supportTicket?.supportCategory)
                  ? categoryColorMap.get(supportTicket.supportCategory)
                  : "gray"
              }
            >
              {formatEnumValueToLowerCase(supportTicket?.supportCategory)}
            </Badge>,
          )}
          {generateItemGroup(
            "Created At",
            <Text>{formatISODayDateTime(supportTicket?.createdAt)}</Text>,
          )}
          {generateItemGroup(
            "Updated At",
            <Text>{formatISODayDateTime(supportTicket?.updatedAt)}</Text>,
          )}
        </Grid>
        <Divider mt="lg" mb="lg" />
      </Box>

      {supportTicket.serviceListing && (
        <ServiceListingDetails supportTicket={supportTicket} />
      )}

      {supportTicket.orderItem && (
        <OrderItemDetails supportTicket={supportTicket} />
      )}

      {supportTicket.booking && (
        <BookingDetails supportTicket={supportTicket} />
      )}

      {supportTicket.payoutInvoice && (
        <PayoutInvoiceDetails supportTicket={supportTicket} />
      )}

      {supportTicket.refundRequest && (
        <RefundRequestDetails supportTicket={supportTicket} />
      )}

      <Box mb="md">
        <Text fw={600} size="md">
          <IconPhotoPlus size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Attachments
        </Text>
        <Grid columns={24} mt="xs">
          {generateItemGroup(
            "Images",
            imagePreview.length == 0 ? (
              <Text color="dimmed">No images uploaded</Text>
            ) : (
              <ImageCarousel
                attachmentURLs={imagePreview}
                altText="Service listing image"
                imageHeight={400}
              />
            ),
          )}
        </Grid>
      </Box>
      <Divider mt="lg" mb="lg" />
    </Accordion.Item>
  );
}
