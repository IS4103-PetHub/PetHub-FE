import { Badge, Grid, Stepper } from "@mantine/core";
import React, { useState } from "react";
import { OrderItem } from "shared-utils";

interface OrderItemStepperContentProps {
  orderItem: OrderItem;
}

const OrderItemStepperContent = ({
  orderItem,
  ...props
}: OrderItemStepperContentProps) => {
  return (
    <Grid>
      <Grid.Col span={8}>pos 1</Grid.Col>
      <Grid.Col span={4}>pos 2</Grid.Col>
    </Grid>
  );
};

export default OrderItemStepperContent;
