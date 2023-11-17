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
import { useRouter } from "next/router";
import { useState, useRef, ReactNode, useEffect } from "react";
import {
  SupportTicketStatus,
  SupportTicketReason,
  SupportTicket,
  extractFileName,
  downloadFile,
  formatISODayDateTime,
  Priority,
  formatEnumValueToLowerCase,
  getErrorMessageProps,
  formatStringToLetterCase,
} from "shared-utils";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import ImageCarousel from "web-ui/shared/ImageCarousel";
import BookingDetails from "web-ui/shared/support/BookingDetails";
import OrderItemDetails from "web-ui/shared/support/OrderItemDetails";
import PayoutInvoiceDetails from "web-ui/shared/support/PayoutInvoiceDetails";
import RefundRequestDetails from "web-ui/shared/support/RefundRequestDetails";
import ServiceListingDetails from "web-ui/shared/support/ServiceListingDetails";
import { useReopenRefundRequest } from "@/hooks/refund";
import {
  useCloseResolveSupportTicket,
  useCloseUnresolveSupportTicket,
} from "@/hooks/support";

interface SupportAccordionDetailsProps {
  supportTicket: SupportTicket;
  refetch(): void;
  canWrite: boolean;
  refetchTableData(): void;
}

export default function SupportAccordionDetails({
  supportTicket,
  refetch,
  canWrite,
  refetchTableData,
}: SupportAccordionDetailsProps) {
  const router = useRouter();
  const theme = useMantineTheme();

  const [showFullDescription, toggleShowFullDescription] = useToggle();
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);
  const textRef = useRef(null);

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

  const priorityColorMap = new Map([
    [Priority.High, "red"],
    [Priority.Medium, "orange"],
    [Priority.Low, "green"],
  ]);

  const canEdit = [
    SupportTicketStatus.Pending,
    SupportTicketStatus.InProgress,
  ].includes(supportTicket?.status);

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

  const generatePBDetails = () => {
    return (
      <>
        {generateItemGroup(
          "User ID",
          <Text>{supportTicket.petBusiness.userId}</Text>,
        )}
        {generateItemGroup(
          "Company Name",
          <Text>{supportTicket.petBusiness.companyName}</Text>,
        )}
        {generateItemGroup(
          "Email",
          <Text>{supportTicket.petBusiness.user.email}</Text>,
        )}
        {generateItemGroup(
          "Business Type",
          <Badge>{supportTicket.petBusiness.businessType}</Badge>,
        )}
        {generateItemGroup(
          "Contact Number",
          <Text>{supportTicket.petBusiness.contactNumber}</Text>,
        )}
        {generateItemGroup(
          "Website",
          <Text>{supportTicket.petBusiness.websiteURL}</Text>,
        )}
        {generateItemGroup("UEN", <Text>{supportTicket.petBusiness.uen}</Text>)}
        {generateItemGroup(
          "Account Status",
          <Text>
            {formatEnumValueToLowerCase(
              supportTicket.petBusiness.user.accountStatus,
            )}
          </Text>,
        )}
      </>
    );
  };

  const generatePODetails = () => {
    return (
      <>
        {generateItemGroup(
          "User ID",
          <Text>{supportTicket.petOwner.userId}</Text>,
        )}
        {generateItemGroup(
          "Name",
          <Text>
            {supportTicket.petOwner.firstName} {supportTicket.petOwner.lastName}
          </Text>,
        )}
        {generateItemGroup(
          "Points",
          <Text>{supportTicket.petOwner.points}</Text>,
        )}
        {generateItemGroup(
          "Email",
          <Text>{supportTicket.petOwner.user.email}</Text>,
        )}
        {generateItemGroup(
          "Status",
          <Text>
            {formatEnumValueToLowerCase(
              supportTicket.petOwner.user.accountStatus,
            )}
          </Text>,
        )}
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

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      // Check if text exceeds 2 lines
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
  }, [supportTicket?.reason]);

  const closeResolvedMutation = useCloseResolveSupportTicket(
    supportTicket.supportTicketId,
  );
  async function handleCloseResolved() {
    try {
      await closeResolvedMutation.mutateAsync();
      notifications.show({
        title: "Support Ticket Closed as Resolved",
        color: "green",
        icon: <IconCheck />,
        message: `Support Ticket successfully closed`,
      });
      refetch();
      refetchTableData();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Closing Support Ticket", error),
      });
    }
  }

  const closeUnresolvedMutation = useCloseUnresolveSupportTicket(
    supportTicket.supportTicketId,
  );
  async function handleCloseUnresolved() {
    try {
      await closeUnresolvedMutation.mutateAsync();
      notifications.show({
        title: "Support Ticket Closed as Unresolved",
        color: "green",
        icon: <IconCheck />,
        message: `Support Ticket successfully closed`,
      });
      refetch();
      refetchTableData();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Closing Support Ticket", error),
      });
    }
  }

  const reopenRefundRequest = useReopenRefundRequest();
  async function handleReopenRefundRequests() {
    try {
      await reopenRefundRequest.mutateAsync(supportTicket?.refundRequestId);
      notifications.show({
        title: "Reopen Refund Request",
        color: "green",
        icon: <IconCheck />,
        message: `Refund Request successfully reopened`,
      });
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
        {supportTicket.status != SupportTicketStatus.ClosedResolved &&
          supportTicket.status != SupportTicketStatus.ClosedUnresolved && (
            <Group>
              <DeleteActionButtonModal
                title="Close Support Ticket"
                onDelete={() => handleCloseResolved()}
                subtitle="Are you sure you want to close the support ticket as resolved? Once the support ticket is closed, it cannot be reopened."
                large
                largeText="Close as Resolved"
                removeIcon
                overrideDeleteButtonText="Close"
                buttonColor="green"
              />
              <DeleteActionButtonModal
                title="Close Support Ticket"
                onDelete={() => handleCloseUnresolved()}
                subtitle="Are you sure you want to close the support ticket as unresolved?"
                large
                largeText="Close as Unresolved"
                removeIcon
                overrideDeleteButtonText="Close"
                buttonColor="red"
              />
            </Group>
          )}
      </Group>
      <Box>
        <Divider mb="lg" mt="lg" />
        <Group>
          <IconListDetails size="1rem" color={theme.colors.indigo[5]} />
          <Text fw={600} size="md" ml={-5}>
            Support Ticket Overview
          </Text>
        </Group>
        <Grid columns={24} mt="xs">
          {generateItemGroup(
            "Reason",
            <Box>
              <Text lineClamp={showFullDescription ? 0 : 2} ref={textRef}>
                {supportTicket?.reason}
              </Text>
              <Group position="right">
                <Button
                  compact
                  variant="subtle"
                  color="blue"
                  size="xs"
                  onClick={() => toggleShowFullDescription()}
                  mt="xs"
                  mr="xs"
                  display={textExceedsLineClamp ? "block" : "none"}
                >
                  {showFullDescription ? "View less" : "View more"}
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
            "Priority",
            <Badge
              color={
                priorityColorMap.has(supportTicket?.priority)
                  ? priorityColorMap.get(supportTicket.priority)
                  : "gray"
              }
            >
              {formatStringToLetterCase(supportTicket?.priority)}
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

      <Box mb="md">
        <Group>
          <IconPhotoPlus size="1rem" color={theme.colors.indigo[5]} />
          <Text fw={600} size="md" ml={-5}>
            User Details
          </Text>
        </Group>
        <Grid columns={24} mt="xs">
          {supportTicket.petBusiness
            ? generatePBDetails()
            : generatePODetails()}
        </Grid>
        <Divider mt="lg" mb="lg" />
      </Box>

      {supportTicket.serviceListing && (
        <ServiceListingDetails supportTicket={supportTicket} isAdmin />
      )}

      {supportTicket.orderItem && (
        <OrderItemDetails supportTicket={supportTicket} isAdmin={true} />
      )}

      {supportTicket.booking && (
        <BookingDetails supportTicket={supportTicket} isAdmin={true} />
      )}

      {supportTicket.payoutInvoice && (
        <PayoutInvoiceDetails supportTicket={supportTicket} isAdmin={true} />
      )}

      {supportTicket.refundRequest && (
        <RefundRequestDetails
          supportTicket={supportTicket}
          isAdmin={true}
          handleReopenRefund={handleReopenRefundRequests}
        />
      )}

      <Box mb="md">
        <Group>
          <IconPhotoPlus size="1rem" color={theme.colors.indigo[5]} />
          <Text fw={600} size="md" ml={-5}>
            Attachments
          </Text>
        </Group>
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
