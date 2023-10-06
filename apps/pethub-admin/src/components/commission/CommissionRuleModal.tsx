import {
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Switch,
  Button,
  Group,
  Grid,
  Checkbox,
  Accordion,
  Text,
} from "@mantine/core";
import { AccordionControl } from "@mantine/core/lib/Accordion/AccordionControl/AccordionControl";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getErrorMessageProps } from "shared-utils";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import { CommissionRule } from "@/types/types";
import CommissionGroupAddPBModal from "./CommissionRuleAddPBModal";

interface CommissionRuleModalProps {
  opened: boolean;
  onClose(): void;
  canWrite: boolean;
  // refetch(): void;
}

const CommissionRuleModal = ({
  opened,
  onClose,
  canWrite, // refetch
}: CommissionRuleModalProps) => {
  /*
   * Component State
   */

  const formDefaultValues = {
    name: "",
    commissionRate: 0,
    default: false,
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      name: isNotEmpty("Name is required"),
      commissionRate: isNotEmpty("Commission Rate is required"),
    },
  });

  /*
   * Service Handlers
   */
  const handleAction = async (values) => {
    try {
      const payload = {
        ...values,
      };
      console.log("CREATING PAYLOAD", payload);
      // TODO: create endpoint, refetch
      notifications.show({
        message: "Commission Group Successfully Created",
        color: "green",
      });
      closeAndResetForm();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Pet", error),
      });
    }
  };

  /*
   * Helper Functions
   */

  const closeAndResetForm = async () => {
    form.reset();
    onClose();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeAndResetForm}
        title={"Create Commission Group"}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => handleAction(values))}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                withAsterisk
                label="Name"
                placeholder="Commission Group Name"
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <NumberInput
                withAsterisk
                label="Rate (%)"
                min={0}
                precision={2}
                {...form.getInputProps("commissionRate")}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Checkbox
                label="Default"
                checked={form.values.default}
                {...form.getInputProps("default")}
              />
            </Grid.Col>
          </Grid>
          {/* PET BUSINESS DETAILS */}
          <Stack>
            <Group position="right" mt="sm">
              <Button
                type="reset"
                color="gray"
                onClick={() => {
                  closeAndResetForm();
                }}
              >
                Cancel
              </Button>
              {canWrite && <Button type="submit">Create</Button>}
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default CommissionRuleModal;
