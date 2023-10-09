import { Card, Grid, Text, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface BillingDetailsSectionProps {
  form: UseFormReturnType<any>;
}

const BillingDetailsSection = ({ form }: BillingDetailsSectionProps) => {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Text weight={500} size="lg" mb="md">
        Billing details
      </Text>
      {/* <form onSubmit={form.onSubmit((values) => console.log(values))}> */}
      <Grid>
        <Grid.Col span={12}>
          <TextInput
            withAsterisk
            label="Name on Card"
            placeholder="Name"
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="email@example.com"
            {...form.getInputProps("email")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            withAsterisk
            label="Phone Number"
            placeholder="Phone Number"
            {...form.getInputProps("phone")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            withAsterisk
            label="Address Line 1"
            placeholder="Address Line 1"
            {...form.getInputProps("address.line1")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Address Line 2"
            placeholder="Address Line 2"
            {...form.getInputProps("address.line2")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            withAsterisk
            label="Postal Code"
            placeholder="Postal Code"
            {...form.getInputProps("address.postal_code")}
          />
        </Grid.Col>
      </Grid>
      {/* </form> */}
    </Card>
  );
};
export default BillingDetailsSection;
