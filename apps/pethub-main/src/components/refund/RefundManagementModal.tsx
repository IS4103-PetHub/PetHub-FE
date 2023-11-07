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
import { CreateRefundRequestPayload } from "@/types/types";
import { validateRefundReason } from "@/util";
import OrderItemCardMini from "../order/OrderItemCardMini";
import OrderItemPopover from "../order/OrderItemPopover";

interface RefundModalProps {
  orderItem: OrderItem;
  opened: boolean;
  onClose: () => void;
  userId: number;
  refetch?: () => Promise<any>;
}

const RefundManagementModal = ({
  orderItem,
  userId,
  opened,
  onClose,
  refetch,
}: RefundModalProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const approveRefundMutation = useApproveRefundRequest();
  const rejectRefundMutation = useRejectRefundRequest();

  const OPEN_FOREVER = ["content"];

  const isProcessed = !!orderItem?.RefundRequest?.processedAt;

  const statusTextMap = {
    [RefundStatusEnum.Pending]: "This refund request is pending your review.",
    [RefundStatusEnum.Approved]:
      "You have approved this refund request, the balance will be refunded to the customer's original payment method.",
    [RefundStatusEnum.Rejected]: "You have rejected this refund request.",
  };

  const statusColorMap = {
    [RefundStatusEnum.Pending]: "orange",
    [RefundStatusEnum.Approved]: "green",
    [RefundStatusEnum.Rejected]: "red",
  };

  const form = useForm({
    initialValues: {
      reason: "",
    },
    validate: {
      reason: (value) => validateRefundReason(value),
    },
  });

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    console.log("orderItem?.refundRequest", orderItem);
    if (orderItem?.RefundRequest) {
      form.setValues({
        reason: orderItem?.RefundRequest?.reason,
      });
    } else {
      form.reset();
    }
  }, [orderItem, opened]);

  const approveRefundRequest = async () => {
    try {
      await approveRefundMutation.mutateAsync(
        orderItem?.RefundRequest?.refundRequestId,
      );
      if (refetch) await refetch();
      handleModalClose();
      router.push(`/customer/orders/${orderItem?.orderItemId}`);
      notifications.show({
        title: `Refund Request approved`,
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

  // type formValues = typeof form.values;
  // async function handleSubmit(values: formValues) {
  //   if (isCreate) {
  //     await approveRefundRequest({
  //       orderItemId: orderItem?.orderItemId,
  //       reason: values.reason,
  //     } as CreateRefundRequestPayload);
  //   } else {
  //     await cancelRefundRequest();
  //   }
  // }

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      centered
      size="80vh"
      closeOnEscape={false}
      closeOnClickOutside={false}
      title={<Text size="sm">Order Item No. {orderItem.orderItemId}</Text>}
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
        <form onSubmit={form.onSubmit((values) => {})}>
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
                  Refund Request
                </Text>
                {!orderItem?.RefundRequest?.processedAt && (
                  <OrderItemPopover
                    text={
                      "Please ensure that you review this request fairly. Failure to reach an appropriate situation might result in the customer filing for a support ticket and an investigation to be opened."
                    }
                  />
                )}
              </Center>
              <Badge variant="light" radius="sm">
                APPLIED.{" "}
                {formatISODateTimeShort(orderItem?.RefundRequest?.createdAt)}
              </Badge>
            </Group>
            <Box mb="xs">
              <Textarea
                label="Reason"
                autosize
                minRows={3}
                maxRows={3}
                maxLength={2000}
                value={orderItem?.RefundRequest?.reason}
                placeholder="Please describe the reason for your refund request. Be specific about any issues or concerns."
                readOnly={true}
                // styles={(theme) => {
                //         input: {
                //           backgroundColor: "white",
                //           color: theme.colors.dark[9],
                //         },
                //       }

                // }
              />
            </Box>
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
              {isProcessed && (
                <Badge
                  variant="light"
                  radius="sm"
                  display={
                    orderItem?.RefundRequest?.processedAt ? "block" : "none"
                  }
                >
                  UPDATED.{" "}
                  {formatISODateTimeShort(orderItem?.RefundRequest?.createdAt)}
                </Badge>
              )}
            </Group>
            <Box>
              <Text size="sm" mb="xs">
                {statusTextMap[orderItem?.RefundRequest?.status]}
              </Text>
              <Textarea
                mb="xs"
                label="Comment from Business"
                autosize
                minRows={3}
                maxRows={3}
                value={orderItem?.RefundRequest?.comment}
                display={orderItem?.RefundRequest?.comment ? "block" : "none"}
                readOnly={true}
                styles={(theme) => ({
                  input: {
                    backgroundColor: "white",
                    color: theme.colors.dark[9],
                  },
                })}
              />
            </Box>
          </Accordion.Item>
          <Box mb="xs" mt="xl">
            {!isProcessed && (
              <>
                <Button
                  fullWidth
                  color="dark"
                  className="gradient-hover"
                  type="submit"
                >
                  Approve
                </Button>
                <Button
                  fullWidth
                  color="dark"
                  className="gradient-hover"
                  type="submit"
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        </form>
      </Accordion>
    </Modal>
  );
};

export default RefundManagementModal;
