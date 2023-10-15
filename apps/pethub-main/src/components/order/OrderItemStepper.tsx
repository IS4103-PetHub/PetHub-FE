import { Badge, Stepper } from "@mantine/core";
import React, { useState } from "react";
import { OrderItem, OrderItemStatusEnum } from "shared-utils";
import OrderItemStepperContent from "./OrderItemStepperContent";

interface OrderItemStepperProps {
  active: number;
  setActive: (current: number) => void;
  orderItem: OrderItem;
}

const OrderItemStepper = ({
  active,
  setActive,
  orderItem,
  ...props
}: OrderItemStepperProps) => {
  const STATUS = orderItem.status;

  const STEPPER_PROPS = {
    active: active,
    onStepClick: setActive,
    size: "md",
    color: "indigo",
    radius: "xl",
    styles: {
      step: {
        // We want icon to be positioned at the top, props only allow left and right sad
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      stepBody: {
        // Text must be aligned and spaced properly
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "1rem",
        marginRight: "0.5rem",
      },
      separator: {
        // make the line thing longer and move it in line with the icon, not the container
        transform: "scaleX(2.5)",
        transformOrigin: "center center",
        position: "relative",
        top: "-30px",
      },
    },
  };

  // Step up is for bigger stepper groups (with 4 steps)
  function getStepText(type: string, stepUp: boolean) {
    const index = stepUp ? active : active - 1;

    const steps = {
      Ordered: {
        label: "Ordered",
        description: "Order has been made",
      },
      Booked: {
        // The step for Booked is always the 2nd step no matter the step group
        label: index <= 1 ? "Not Booked" : "Booked",
        description: index <= 1 ? "Booking not made" : "Booking has been made",
      },
      Fulfilled: {
        // The step for Fulfilled is the 3rd step for happyBookingStepperGroup and refundedStepperGroup, and the 2nd step for happyNoBookingStepperGroup
        label: index <= 2 ? "Not Fulfilled" : "Fulfilled",
        description:
          index <= 2 ? "Pending order fulfillment" : "Order has been fulfilled",
      },
      Rated: {
        // The step for Rated is the 4th step for happyBookingStepperGroup and the 3rd step for happyNoBookingStepperGroup
        label: index <= 3 ? "Not Rated" : "Rated",
        description:
          index <= 3 ? "Pending order rating" : "Order has been rated",
      },
      Expired: {
        label: "Expired",
        description: "Order has expired",
      },
    };

    return steps[type] || {};
  }

  const stepGroups = {
    happyBooking: ["Ordered", "Booked", "Fulfilled", "Rated"],
    happyNoBooking: ["Ordered", "Fulfilled", "Rated"],
    expired: ["Ordered", "Booked", "Expired"],
    refunded: ["Ordered", "Booked", "Fulfilled", "Refunded"],
  };

  function renderSteps(group: string[]) {
    return group.map((stepType, idx) => {
      return (
        // If the length of the group is 4, then we are rendering the bigger stepper group, so we need to step up the index
        <Stepper.Step key={idx} {...getStepText(stepType, group.length === 4)}>
          <OrderItemStepperContent orderItem={orderItem} />
        </Stepper.Step>
      );
    });
  }

  function renderContent() {
    if (
      STATUS === OrderItemStatusEnum.Fulfilled ||
      STATUS === OrderItemStatusEnum.PendingBooking ||
      (STATUS === OrderItemStatusEnum.PendingFulfillment &&
        orderItem.serviceListing.requiresBooking)
    ) {
      return (
        <Stepper {...(STEPPER_PROPS as any)}>
          {renderSteps(stepGroups.happyBooking)}
        </Stepper>
      );
    }
    if (
      STATUS === OrderItemStatusEnum.PendingFulfillment &&
      !orderItem.serviceListing.requiresBooking
    ) {
      return (
        <Stepper {...(STEPPER_PROPS as any)}>
          {renderSteps(stepGroups.happyNoBooking)}
        </Stepper>
      );
    }
    if (STATUS === OrderItemStatusEnum.Expired) {
      return (
        <Stepper {...(STEPPER_PROPS as any)}>
          {renderSteps(stepGroups.expired)}
        </Stepper>
      );
    }
    if (STATUS === OrderItemStatusEnum.Refunded) {
      return (
        <Stepper {...(STEPPER_PROPS as any)}>
          {renderSteps(stepGroups.refunded)}
        </Stepper>
      );
    }
  }

  return <>{renderContent()}</>;
};

export default OrderItemStepper;
