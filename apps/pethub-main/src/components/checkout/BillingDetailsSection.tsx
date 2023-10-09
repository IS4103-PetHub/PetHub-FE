import { Card, Text } from "@mantine/core";
import React from "react";

const BillingDetailsSection = () => {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Text weight={500} size="lg" mb="md">
        Billing details
      </Text>
    </Card>
  );
};
export default BillingDetailsSection;
