import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  FileInput,
  Grid,
  Group,
  Image,
  Modal,
  MultiSelect,
  NumberInput,
  Rating,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPaw, IconPawFilled, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  OrderItem,
  RefundRequest,
  downloadFile,
  formatISODateTimeShort,
  getErrorMessageProps,
} from "shared-utils";
import { RefundStatusEnum } from "shared-utils";
import {
  useApproveRefundRequest,
  useCancelRefundRequest,
  useCreateRefundRequest,
  useRejectRefundRequest,
} from "@/hooks/refund";
import {
  ApproveOrRejectRefundRequestPayload,
  CreateRefundRequestPayload,
} from "@/types/types";
import { validateRefundReason } from "@/util";
import OrderItemCardMini from "../order/OrderItemCardMini";
import OrderItemPopover from "../order/OrderItemPopover";

interface RefundModalProps {
  orderItem: OrderItem;
  opened: boolean;
  onClose: () => void;
  isBusinessView?: boolean;
  userId?: number;
  refetch?: () => Promise<any>;
}

const RefundModal = ({
  orderItem,
  userId,
  opened,
  onClose,
  refetch,
  isBusinessView,
}: RefundModalProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const [choice, setChoice] = useState<string>("");

  const createRefundMutation = useCreateRefundRequest();
  const cancelRefundMutation = useCancelRefundRequest();
  const approveRefundMutation = useApproveRefundRequest();
  const rejectRefundMutation = useRejectRefundRequest();

  const OPEN_FOREVER = ["content"];

  const isCreate = !orderItem?.RefundRequest;

  const popoverText = isBusinessView
    ? `Please ensure that you review this request fairly. Failure to reach an appropriate resolution might result in the customer filing for a support ticket and an investigation to be opened.`
    : isCreate
    ? `When requesting a refund, please provide a clear and concise explanation of your issue. Be sure to include any relevant details about your order. Refrain from using offensive language or uploading inappropriate photos. Do not share any personal information. Non-compliance may lead to the rejection of your refund request.`
    : `You are viewing the created refund request. The business should reach out to you shortly. If you have changed your mind, feel free to cancel the refund request.`;

  const statusTextMap = {
    [RefundStatusEnum.Pending]: isBusinessView
      ? "This refund request is pending your review."
      : "Your refund request is pending review from the business, please be patient.",
    [RefundStatusEnum.Approved]: isBusinessView
      ? "You have already approved this refund request."
      : "Your refund has been approved, the amount will be credited to your original payment method.",
    [RefundStatusEnum.Rejected]: isBusinessView
      ? "You have already rejected this refund request."
      : "Your refund request has been rejected, please file a support ticket should you feel that this is an error.",
  };

  const statusColorMap = {
    [RefundStatusEnum.Pending]: "orange",
    [RefundStatusEnum.Approved]: "green",
    [RefundStatusEnum.Rejected]: "red",
  };

  const form = useForm({
    initialValues: {
      reason: "",
      comment: "",
    },
    validate: {
      reason: (value) =>
        !orderItem?.RefundRequest ? validateRefundReason(value) : null,
      comment: (value) => (isBusinessView ? validateRefundReason(value) : null),
    },
  });

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (orderItem?.RefundRequest) {
      form.setValues({
        reason: orderItem?.RefundRequest?.reason,
        comment: orderItem?.RefundRequest?.comment,
      });
    } else {
      form.reset();
    }
  }, [orderItem, opened]);

  const createRefundRequest = async (payload: CreateRefundRequestPayload) => {
    try {
      await createRefundMutation.mutateAsync(payload);
      if (refetch) await refetch();
      handleModalClose();
      router.push(`/customer/orders/${orderItem?.orderItemId}`);
      notifications.show({
        title: `Refund Request Created`,
        color: "green",
        icon: <IconCheck />,
        message:
          "Please wait for the business to review the details of your refund request.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Creating Refund Request`, error),
      });
    }
  };

  const cancelRefundRequest = async () => {
    try {
      await cancelRefundMutation.mutateAsync(
        orderItem?.RefundRequest?.refundRequestId,
      );
      if (refetch) await refetch();
      handleModalClose();
      router.push(`/customer/orders/${orderItem?.orderItemId}`);
      notifications.show({
        title: `Refund Request Cancelled`,
        color: "green",
        icon: <IconCheck />,
        message: "Your refund request has been cancelled.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Cancelling Refund Request`, error),
      });
    }
  };

  const approveRefundRequest = async (
    payload: ApproveOrRejectRefundRequestPayload,
  ) => {
    try {
      await approveRefundMutation.mutateAsync(payload);
      if (refetch) await refetch();
      handleModalClose();
      notifications.show({
        title: `Refund Request Approved`,
        color: "green",
        icon: <IconCheck />,
        message:
          "The refund request has been approved. The balance will be refunded to the customer's original payment method.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Approving Refund Request`, error),
      });
    }
  };

  const rejectRefundRequest = async (
    payload: ApproveOrRejectRefundRequestPayload,
  ) => {
    try {
      await rejectRefundMutation.mutateAsync(payload);
      if (refetch) await refetch();
      handleModalClose();
      notifications.show({
        title: `Refund Request Rejected`,
        color: "green",
        icon: <IconCheck />,
        message: "The refund request has been rejected.",
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps(`Error Approving Refund Request`, error),
      });
    }
  };

  type formValues = typeof form.values;
  async function handleSubmit(values: formValues) {
    if (isBusinessView) {
      const payload: ApproveOrRejectRefundRequestPayload = {
        refundRequestId: orderItem?.RefundRequest?.refundRequestId,
        comment: values.comment,
      };
      if (choice === "approve") {
        await approveRefundRequest(payload);
      } else {
        await rejectRefundRequest(payload);
      }
      return;
    }
    if (isCreate) {
      await createRefundRequest({
        orderItemId: orderItem?.orderItemId,
        reason: values.reason,
      } as CreateRefundRequestPayload);
    } else {
      await cancelRefundRequest();
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      centered
      size="80vh"
      closeOnEscape={false}
      closeOnClickOutside={false}
      title={<Text size="sm">Order Item No. {orderItem?.orderItemId}</Text>}
    >
      <Accordion
        multiple
        variant="filled"
        value={OPEN_FOREVER}
        onChange={() => {}}
        chevronSize={0}
      >
        <Box mt={-25}>
          <OrderItemCardMini orderItem={orderItem} viewOnly={true} />
        </Box>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Accordion.Item
            value="content"
            mt={-35}
            pl={30}
            pr={30}
            pt={15}
            pb={5}
          >
            <Group mb="sm" position="apart">
              <Center>
                <Text fw={600} size="xl">
                  Refund Request{" "}
                  {isBusinessView &&
                    `ID. ${orderItem?.RefundRequest?.refundRequestId}`}
                </Text>
                {!orderItem?.RefundRequest?.processedAt && (
                  <OrderItemPopover text={popoverText} />
                )}
              </Center>
              <Badge
                variant="light"
                radius="sm"
                display={isCreate ? "none" : "block"}
              >
                APPLIED.{" "}
                {formatISODateTimeShort(orderItem?.RefundRequest?.createdAt)}
              </Badge>
            </Group>
            <Box mb="xs">
              <Textarea
                label="Reason"
                autosize
                minRows={3}
                maxRows={5}
                maxLength={2000}
                placeholder="Please describe the reason for your refund request. Be specific about any issues or concerns."
                readOnly={!isCreate}
                styles={(theme) =>
                  !isCreate
                    ? {
                        input: {
                          backgroundColor: "white",
                          color: theme.colors.dark[9],
                        },
                      }
                    : {}
                }
                {...form.getInputProps("reason")}
              />
              <Text
                color="dimmed"
                size="sm"
                align="right"
                display={isCreate ? "block" : "none"}
              >
                {form.values.reason.length} / 2000 characters
              </Text>
            </Box>
            {orderItem?.RefundRequest && (
              <Group mb="sm" mt="md" position="apart">
                <Center>
                  <Text fw={600} size="lg" mr="xs">
                    Status
                  </Text>
                  <Badge
                    variant="filled"
                    mr="xs"
                    radius="xs"
                    p={3}
                    color={statusColorMap[orderItem?.RefundRequest?.status]}
                  >
                    {orderItem?.RefundRequest?.status}
                  </Badge>
                </Center>
                {!isCreate && (
                  <Badge
                    variant="light"
                    radius="sm"
                    display={
                      orderItem?.RefundRequest?.processedAt ? "block" : "none"
                    }
                  >
                    UPDATED.{" "}
                    {formatISODateTimeShort(
                      orderItem?.RefundRequest?.createdAt,
                    )}
                  </Badge>
                )}
              </Group>
            )}
            <Box>
              <Text size="sm" mb="xs">
                {statusTextMap[orderItem?.RefundRequest?.status]}
              </Text>
              <Textarea
                mb="xs"
                label={
                  isBusinessView ? "Your comment" : "Comment from business"
                }
                autosize
                minRows={3}
                maxRows={5}
                display={
                  isBusinessView
                    ? "block"
                    : orderItem?.RefundRequest?.comment
                    ? "block"
                    : "none"
                }
                readOnly={!!orderItem?.RefundRequest?.comment}
                styles={(theme) =>
                  !!orderItem?.RefundRequest?.comment
                    ? {
                        input: {
                          backgroundColor: "white",
                          color: theme.colors.dark[9],
                        },
                      }
                    : {}
                }
                {...form.getInputProps("comment")}
              />
            </Box>
          </Accordion.Item>
          <Box mb="xs" mt="xl" display={isBusinessView ? "none" : "block"}>
            <Group position="right">
              {isCreate ? (
                <Button
                  fullWidth
                  color="dark"
                  className="gradient-hover"
                  type="submit"
                >
                  Submit Refund Request
                </Button>
              ) : (
                <Button
                  color="red"
                  type="submit"
                  display={
                    orderItem?.RefundRequest?.status ===
                    RefundStatusEnum.Pending
                      ? "block"
                      : "none"
                  }
                >
                  Cancel Refund Request
                </Button>
              )}
            </Group>
          </Box>
          <Box
            mb="xs"
            mt="xl"
            display={
              isBusinessView &&
              orderItem?.RefundRequest?.status === RefundStatusEnum.Pending
                ? "block"
                : "none"
            }
          >
            <Group position="right">
              <Button
                color="red"
                type="submit"
                miw={100}
                onClick={() => setChoice("reject")}
              >
                Reject
              </Button>
              <Button
                color="green"
                type="submit"
                miw={100}
                onClick={() => setChoice("approve")}
              >
                Approve
              </Button>
            </Group>
          </Box>
        </form>
      </Accordion>
    </Modal>
  );
};

export default RefundModal;
