import { Badge, Stepper } from "@mantine/core";
import React, { useState } from "react";

interface OrderItemStepperProps {
  active: number;
  setActive: (current: number) => void;
}

const OrderItemStepper = ({
  active,
  setActive,
  ...props
}: OrderItemStepperProps) => {
  return (
    <Stepper active={active} onStepClick={setActive}>
      <Stepper.Step label="Ordered" description="Order has been made">
        Order content
      </Stepper.Step>
      <Stepper.Step label="Booked" description="Booking has been made">
        Booked content
      </Stepper.Step>
      <Stepper.Step label="Fulfilled" description="Order has been fulfilled">
        Fulfilled content
      </Stepper.Step>
      <Stepper.Step label="Expired" description="Order has expired">
        Expired content
      </Stepper.Step>
      <Stepper.Step label="Refunded" description="Order has been refunded">
        Refunded content
      </Stepper.Step>
      <Stepper.Completed>
        Completed, click back button to get to previous step
      </Stepper.Completed>
    </Stepper>
  );
};

export default OrderItemStepper;
