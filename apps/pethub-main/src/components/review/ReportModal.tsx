import {
  Button,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  OrderItem,
  ReviewReportReasonEnum,
  getErrorMessageProps,
} from "shared-utils";
import { useReportReview } from "@/hooks/review";
import { ReportReviewPayload } from "@/types/types";

interface ReportModalProps {
  reviewId: number;
  opened: boolean;
  onClose: () => void;
  onReported?: () => Promise<any>;
}

const ReportModal = ({
  reviewId,
  opened,
  onClose,
  onReported,
}: ReportModalProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [reportReason, setReportReason] =
    useState<ReviewReportReasonEnum>(null);
  const [error, setError] = useState(null);

  const ReviewReportReasonLabelMap = {
    [ReviewReportReasonEnum.RudeOrAbusive]: "Rude or abusive review",
    [ReviewReportReasonEnum.Pornographic]: "Pornopgraphic content",
    [ReviewReportReasonEnum.Spam]: "Spam review",
    [ReviewReportReasonEnum.ExposingPersonalInformation]:
      "Exposes personal information",
    [ReviewReportReasonEnum.UnauthorizedAdvertisement]:
      "Unauthorized advertisement",
    [ReviewReportReasonEnum.InaccurateOrMisleading]:
      "Review is inaccurate or misleading",
    [ReviewReportReasonEnum.Others]: "Other violations",
  };

  function handleCloseModal() {
    setReportReason(null);
    onClose();
  }

  const createReportReviewMutation = useReportReview();
  const reportReview = async (payload: ReportReviewPayload) => {
    try {
      await createReportReviewMutation.mutateAsync(payload);
      notifications.show({
        title: `Review Reported`,
        color: "green",
        icon: <IconCheck />,
        message:
          "PetHub staff will investigate this review and take the appropriate action.",
      });
      if (onReported) onReported();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Reporting Review`, error),
      });
    }
  };

  const handleReportClick = async () => {
    if (!reportReason) {
      setError("No reason selected");
      return;
    }
    const payload: ReportReviewPayload = {
      reviewId: reviewId,
      reportReason: reportReason,
    };
    await reportReview(payload);
    handleCloseModal();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      centered
      size="50vh"
      title="Report Review"
    >
      <Radio.Group
        name="reportReason"
        label="Please select the reason for this report"
        description="Ensure that you only report reviews for valid violations, not personal disagreements."
        value={reportReason}
        onChange={(value) => {
          setError(null);
          setReportReason(value as ReviewReportReasonEnum);
        }}
      >
        <Stack mt="xl">
          {Object.entries(ReviewReportReasonLabelMap).map(([key, label]) => (
            <Radio key={key} value={key} label={label} />
          ))}
        </Stack>
      </Radio.Group>
      {error && (
        <Text mt="sm" size="sm" color={theme.colors.red[6]} align="right">
          {error}
        </Text>
      )}
      <Group position="right" mt="sm">
        <Button variant="light" mr={-5} onClick={handleCloseModal} color="gray">
          Cancel
        </Button>
        <Button color="red" onClick={async () => handleReportClick()}>
          Report
        </Button>
      </Group>
    </Modal>
  );
};

export default ReportModal;
