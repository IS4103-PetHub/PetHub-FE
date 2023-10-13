import {
  Card,
  Grid,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconId } from "@tabler/icons-react";
import React from "react";

interface BillingDetailsSectionProps {
  form: UseFormReturnType<any>;
}

const BillingDetailsSection = ({ form }: BillingDetailsSectionProps) => {
  const theme = useMantineTheme();

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Group position="left" align="flex-start">
        <IconId color={theme.colors.indigo[5]} />
        <Text weight={500} size="lg" mb="md" ml={-5}>
          Billing details
        </Text>
      </Group>
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
    </Card>
  );
};
export default BillingDetailsSection;
