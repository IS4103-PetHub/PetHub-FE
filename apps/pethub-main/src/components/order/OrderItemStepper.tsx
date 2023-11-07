import { Badge, Stepper } from "@mantine/core";
import {
  IconBrowserCheck,
  IconBulb,
  IconCalendarEvent,
  IconCheck,
  IconClipboardCheck,
  IconClockExclamation,
  IconCreditCard,
  IconDots,
  IconMenu2,
  IconStar,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import {
  OrderItem,
  OrderItemStatusEnum,
  RefundStatusEnum,
  formatISODateTimeShort,
} from "shared-utils";

interface OrderItemStepperProps {
  userId: number;
  active: number;
  setActive: (current: number) => void;
  orderItem: OrderItem;
  numberOfSteps: number;
}

const OrderItemStepper = ({
  userId,
  active,
  setActive,
  orderItem,
  numberOfSteps,
  ...props
}: OrderItemStepperProps) => {
  const activeStepIndexRef = useRef<number | null>(null);

  // A user can only make a review 15 days after the order item has been fulfilled
  const REVIEW_HOLDING_PERIOD_DAYS = 15;

  useEffect(() => {
    if (activeStepIndexRef.current !== null) {
      setActive(activeStepIndexRef.current);
    }
  }, [setActive, activeStepIndexRef.current]);

  const STEPPER_PROPS = {
    active: active,
    size: "md",
    color: "indigo",
    radius: "xl",
    // styles API override for stepper
    styles: {
      // override stepper to have icon at the top, props only allow left and right
      step: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      // center text
      stepBody: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "1rem",
        marginRight: "0.5rem",
      },
      // push separator up to be beside stepper icon
      separator: {
        position: "relative",
        top: "-30px",
      },
    },
  };

  // These are the possible stepper steps for each flow
  const stepGroups = {
    happyBooking: ["Ordered", "Booked", "Fulfilled", "Reviewed"],
    happyNoBooking: ["Ordered", "Fulfilled", "Reviewed"],
    expiredBooking: ["Ordered", "Booked", "Expired"],
    expiredNoBooking: ["Ordered", "Expired"],
    refunds: ["RefundRequested", "RefundPending", "RefundOutcome"],
    // refundedBooking: ["Ordered", "Booked", "Fulfilled", "Refunded"],
    // refundedNoBooking: ["Ordered", "Fulfilled", "Refunded"],
  };

  // These are the steps that should be active depending on the status of the order item
  const mapStatusToStepGroupStep = new Map([
    [OrderItemStatusEnum.PendingBooking, "Ordered"],
    [OrderItemStatusEnum.PendingFulfillment, "Ordered"],
    [OrderItemStatusEnum.Fulfilled, "Fulfilled"],
    [OrderItemStatusEnum.PaidOut, "Fulfilled"],
    [OrderItemStatusEnum.Expired, "Expired"],
    [OrderItemStatusEnum.Refunded, "RefundOutcome"],
  ]);

  // Apparently JSX elements in a map need a unique key or husky will be mad
  const mapStepTypeToIcon = new Map([
    ["Ordered", <IconClipboardCheck key="IconClipboardCheck" />],
    ["Booked", <IconCalendarEvent key="IconCalendarEvent" />],
    ["Fulfilled", <IconBrowserCheck key="IconBrowserCheck" />],
    ["Reviewed", <IconStar key="IconStar" />],
    ["Expired", <IconClockExclamation key="IconClockExclamation" />],
    // ["Refunded", <IconCreditCard key="IconCreditCard" />],
    ["RefundRequested", <IconCreditCard key="IconCreditCard" />],
    ["RefundPending", <IconDots key="IconDots" />],
    ["RefundOutcome", <IconCheck key="IconCheck" />],
  ]);

  // A user can only leave a review max 15 days after the order item has been fulfilled
  const lastReviewDate = formatISODateTimeShort(
    dayjs(orderItem?.dateFulfilled || new Date())
      .add(REVIEW_HOLDING_PERIOD_DAYS, "day")
      .endOf("day")
      .toISOString(),
  );
  const eligibleForReview = dayjs().isBefore(
    dayjs(orderItem?.dateFulfilled || new Date())
      .add(REVIEW_HOLDING_PERIOD_DAYS, "day")
      .endOf("day"),
  );
  const pendingReviewString = () => {
    if (orderItem.status !== OrderItemStatusEnum.Fulfilled)
      return "Pending review";
    if (eligibleForReview) {
      return `Review by ${lastReviewDate}`;
    }
    return "Review window expired";
  };

  // Get the appropriate text for a stepper step based on the step group and current index
  function getStepText(type: string, stepIndex: number) {
    const isBookingStep = stepGroups.happyBooking.includes(type);
    const bookingStepNumber = isBookingStep ? 2 : -1;

    const isFulfilledStep =
      stepGroups.happyBooking.includes(type) ||
      stepGroups.happyNoBooking.includes(type);
    const fulfilledStepNumber = isFulfilledStep
      ? numberOfSteps === 4
        ? 3
        : 2
      : -1;

    const isReviewedStep =
      stepGroups.happyBooking.includes(type) ||
      stepGroups.happyNoBooking.includes(type);
    const ReviewedStepNumber = isReviewedStep
      ? numberOfSteps === 4
        ? 4
        : 3
      : -1;

    const steps = {
      Ordered: {
        label: "Ordered",
        description: "Order has been made",
      },
      Booked: {
        label: stepIndex < bookingStepNumber ? "Not Booked" : "Booked",
        description:
          stepIndex < bookingStepNumber
            ? "Booking not made"
            : "Booking has been made",
      },
      Fulfilled: {
        label: stepIndex < fulfilledStepNumber ? "Not Fulfilled" : "Fulfilled",
        description:
          stepIndex < fulfilledStepNumber
            ? "Pending order fulfillment"
            : `${formatISODateTimeShort(orderItem?.dateFulfilled)}`,
      },
      Reviewed: {
        label: stepIndex < ReviewedStepNumber ? "Not Reviewed" : "Reviewed",
        description:
          stepIndex < ReviewedStepNumber
            ? pendingReviewString()
            : "Review has been made",
      },
      Expired: {
        label: "Expired",
        description: "Order has expired",
      },
      // Refunded: {
      //   label: "Refunded",
      //   description: "Order has been refunded",
      // },
      RefundRequested: {
        label: "Refund Requested",
        description: formatISODateTimeShort(
          orderItem?.RefundRequest?.createdAt,
        ),
      },
      RefundPending: {
        label: "Pending",
        description: "Pending business review",
      },
      RefundOutcome: {
        label:
          orderItem?.RefundRequest?.status === RefundStatusEnum.Approved
            ? "Approved"
            : orderItem?.RefundRequest?.status === RefundStatusEnum.Rejected
            ? "Rejected"
            : "Outcome",
        description: orderItem?.RefundRequest?.processedAt
          ? formatISODateTimeShort(orderItem?.RefundRequest?.processedAt)
          : "Pending outcome",
      },
    };

    return steps[type] || {};
  }

  function getStepDetails(
    stepType: string,
    orderItem: OrderItem,
    group: string[],
  ) {
    let icon = mapStepTypeToIcon.get(stepType); // default icon
    let stepDetails = getStepText(stepType, activeStepIndexRef.current);

    // Override step color and text if the order item is not booked, fulfilled or reviewed
    if (
      stepType === "Booked" &&
      !orderItem?.booking &&
      group === stepGroups.expiredBooking
    ) {
      stepDetails = {
        color: "red",
        label: "Not Booked",
        description: "Booking not made",
      };
    }

    if (stepType === "Fulfilled" && !orderItem?.dateFulfilled) {
      stepDetails = {
        color: "red",
        label: "Not Fulfilled",
        description: "Order not fulfilled",
      };
    }

    if (
      stepType === "Reviewed" &&
      orderItem?.review &&
      group !== stepGroups.expiredBooking &&
      group !== stepGroups.expiredNoBooking
    ) {
      stepDetails = {
        label: "Reviewed",
        description: orderItem?.review?.lastUpdated
          ? formatISODateTimeShort(orderItem?.review?.lastUpdated)
          : formatISODateTimeShort(orderItem?.review?.dateCreated),
      };
    }

    if (stepType.startsWith("Refund") && orderItem?.RefundRequest) {
      const refundRequest = orderItem.RefundRequest;
      if (refundRequest.status === RefundStatusEnum.Pending) {
        activeStepIndexRef.current = group.indexOf("RefundPending") + 1;
      } else if (
        refundRequest.status === RefundStatusEnum.Approved ||
        refundRequest.status === RefundStatusEnum.Rejected
      ) {
        activeStepIndexRef.current = group.indexOf("RefundOutcome") + 1;
      }
    }

    return { icon, ...stepDetails };
  }

  // Render the stepper steps based on the step group
  function renderSteps(group: string[]) {
    let mappedStatusToStepGroupStep = mapStatusToStepGroupStep.get(
      orderItem?.status,
    );

    // If the order item is pending fulfillment and requires booking, override the step to booked
    if (
      mappedStatusToStepGroupStep === "Ordered" &&
      orderItem?.status === OrderItemStatusEnum.PendingFulfillment &&
      orderItem?.serviceListing.requiresBooking
    ) {
      mappedStatusToStepGroupStep = "Booked";
    }

    activeStepIndexRef.current =
      group.findIndex((step) => step === mappedStatusToStepGroupStep) + 1;

    return group.map((stepType, idx) => {
      const { icon, label, description, color } = getStepDetails(
        stepType,
        orderItem,
        group,
      );

      // If item has a review and the focused step is before the reviewed step
      if (
        orderItem?.review &&
        activeStepIndexRef.current < group.indexOf("Reviewed") + 1
      ) {
        activeStepIndexRef.current = group.indexOf("Reviewed") + 1;
      }

      if (orderItem?.status === OrderItemStatusEnum.Refunded) {
        activeStepIndexRef.current =
          group.findIndex(
            (step) =>
              step ===
              mapStatusToStepGroupStep.get(OrderItemStatusEnum.Refunded),
          ) + 1;
      }

      return (
        <Stepper.Step
          key={idx}
          label={label}
          description={description}
          icon={icon}
          completedIcon={icon}
          color={color}
        />
      );
    });
  }

  function renderContent() {
    // const contentMap = {
    //   [OrderItemStatusEnum.PaidOut]: orderItem?.serviceListing.requiresBooking
    //     ? stepGroups.happyBooking
    //     : stepGroups.happyNoBooking,
    //   [OrderItemStatusEnum.PendingFulfillment]: orderItem?.serviceListing.requiresBooking
    //     ? stepGroups.happyBooking
    //     : stepGroups.happyNoBooking,
    //   [OrderItemStatusEnum.Fulfilled]: orderItem?.serviceListing.requiresBooking
    //     ? stepGroups.happyBooking
    //     : stepGroups.happyNoBooking,
    //   [OrderItemStatusEnum.PendingBooking]: orderItem?.serviceListing.requiresBooking
    //     ? stepGroups.happyBooking
    //     : stepGroups.happyNoBooking,
    //   [OrderItemStatusEnum.Expired]: orderItem?.serviceListing.requiresBooking
    //     ? stepGroups.expiredBooking
    //     : stepGroups.expiredNoBooking,
    //   [OrderItemStatusEnum.Refunded]: stepGroups.refunds,
    // };

    let groupToRender;

    // Check if there's a pending refund request, then override
    if (orderItem?.RefundRequest?.status === RefundStatusEnum.Pending) {
      groupToRender = stepGroups.refunds;
    } else {
      const contentMap = {
        [OrderItemStatusEnum.PaidOut]: orderItem?.serviceListing.requiresBooking
          ? stepGroups.happyBooking
          : stepGroups.happyNoBooking,
        [OrderItemStatusEnum.PendingFulfillment]: orderItem?.serviceListing
          .requiresBooking
          ? stepGroups.happyBooking
          : stepGroups.happyNoBooking,
        [OrderItemStatusEnum.Fulfilled]: orderItem?.serviceListing
          .requiresBooking
          ? stepGroups.happyBooking
          : stepGroups.happyNoBooking,
        [OrderItemStatusEnum.PendingBooking]: orderItem?.serviceListing
          .requiresBooking
          ? stepGroups.happyBooking
          : stepGroups.happyNoBooking,
        [OrderItemStatusEnum.Expired]: orderItem?.serviceListing.requiresBooking
          ? stepGroups.expiredBooking
          : stepGroups.expiredNoBooking,
        [OrderItemStatusEnum.Refunded]: stepGroups.refunds,
      };

      groupToRender = contentMap[orderItem?.status];
    }

    return (
      groupToRender && (
        <Stepper {...(STEPPER_PROPS as any)}>
          {renderSteps(groupToRender)}
        </Stepper>
      )
    );
  }

  return <>{renderContent()}</>;
};

export default OrderItemStepper;
