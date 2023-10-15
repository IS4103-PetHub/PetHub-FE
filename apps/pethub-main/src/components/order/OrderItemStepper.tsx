import { Badge, Stepper } from "@mantine/core";
import {
  IconBrowserCheck,
  IconBulb,
  IconCalendarEvent,
  IconClockExclamation,
  IconCreditCard,
  IconMenu2,
  IconStar,
} from "@tabler/icons-react";
import React, { useEffect, useRef } from "react";
import { OrderItem, OrderItemStatusEnum } from "shared-utils";
import OrderItemStepperContent from "./OrderItemStepperContent";

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
        transform:
          numberOfSteps === 4
            ? "scaleX(2.5)"
            : numberOfSteps === 3
            ? "scaleX(1.5)"
            : null,
        transformOrigin: "center center",
        position: "relative",
        top: "-30px",
      },
    },
  };

  // These are the possible stepper steps for each flow
  const stepGroups = {
    happyBooking: ["Ordered", "Booked", "Fulfilled", "Rated"],
    happyNoBooking: ["Ordered", "Fulfilled", "Rated"],
    expiredBooking: ["Ordered", "Booked", "Expired"],
    expiredNoBooking: ["Ordered", "Expired"],
    refundedBooking: ["Ordered", "Booked", "Fulfilled", "Refunded"],
    refundedNoBooking: ["Ordered", "Fulfilled", "Refunded"],
  };

  const mapStatusToStepGroupStep = new Map([
    [OrderItemStatusEnum.PendingBooking, "Ordered"],
    [OrderItemStatusEnum.PendingFulfillment, "Ordered"],
    [OrderItemStatusEnum.Fulfilled, "Fulfilled"],
    [OrderItemStatusEnum.PaidOut, "Fulfilled"],
    [OrderItemStatusEnum.Expired, "Expired"],
    [OrderItemStatusEnum.Refunded, "Refunded"],
  ]);

  // Apparently JSX elements in a map need a unique key or husky will be mad
  const mapStepTypeToIcon = new Map([
    ["Ordered", null], // This will never be displayed anyways
    ["Booked", <IconBulb key="IconBulb" />],
    ["Fulfilled", <IconBrowserCheck key="IconBrowserCheck" />],
    ["Rated", <IconStar key="IconStar" />],
    ["Expired", <IconClockExclamation key="IconClockExclamation" />],
    ["Refunded", <IconCreditCard key="IconCreditCard" />],
  ]);

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

    const isRatedStep =
      stepGroups.happyBooking.includes(type) ||
      stepGroups.happyNoBooking.includes(type);
    const ratedStepNumber = isRatedStep ? (numberOfSteps === 4 ? 4 : 3) : -1;

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
            : "Order has been fulfilled",
      },
      Rated: {
        label: stepIndex < ratedStepNumber ? "Not Rated" : "Rated",
        description:
          stepIndex < ratedStepNumber
            ? "Pending order rating"
            : "Order has been rated",
      },
      Expired: {
        label: "Expired",
        description: "Order has expired",
      },
    };

    return steps[type] || {};
  }

  // Render the stepper steps based on the step group
  function renderSteps(group: string[]) {
    let mappedStatusToStepGroupStep = mapStatusToStepGroupStep.get(
      orderItem.status,
    );
    if (
      mappedStatusToStepGroupStep === "Ordered" &&
      orderItem.status === OrderItemStatusEnum.PendingFulfillment &&
      orderItem.serviceListing.requiresBooking
    ) {
      mappedStatusToStepGroupStep = "Booked";
    }
    activeStepIndexRef.current =
      group.findIndex((step) => step === mappedStatusToStepGroupStep) + 1;

    return group.map((stepType, idx) => (
      <Stepper.Step
        key={idx}
        {...getStepText(stepType, activeStepIndexRef.current)}
        icon={mapStepTypeToIcon.get(stepType)}
      >
        <OrderItemStepperContent orderItem={orderItem} userId={userId} />
      </Stepper.Step>
    ));
  }

  function renderContent() {
    const contentMap = {
      [OrderItemStatusEnum.PaidOut]: orderItem.serviceListing.requiresBooking
        ? stepGroups.happyBooking
        : stepGroups.happyNoBooking,
      [OrderItemStatusEnum.PendingFulfillment]: orderItem.serviceListing
        .requiresBooking
        ? stepGroups.happyBooking
        : stepGroups.happyNoBooking,
      [OrderItemStatusEnum.Fulfilled]: orderItem.serviceListing.requiresBooking
        ? stepGroups.happyBooking
        : stepGroups.happyNoBooking,
      [OrderItemStatusEnum.PendingBooking]: orderItem.serviceListing
        .requiresBooking
        ? stepGroups.happyBooking
        : stepGroups.happyNoBooking,
      [OrderItemStatusEnum.Expired]: orderItem.booking
        ? stepGroups.expiredBooking
        : stepGroups.expiredNoBooking,
      [OrderItemStatusEnum.Refunded]: orderItem.booking
        ? stepGroups.refundedBooking
        : stepGroups.refundedNoBooking,
    };

    const groupToRender = contentMap[orderItem.status];
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
