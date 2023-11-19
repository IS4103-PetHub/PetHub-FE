import {
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Button,
  Group,
  Grid,
  Checkbox,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { formatNumberCustomDecimals, getErrorMessageProps } from "shared-utils";
import { useCreateCommissionRule } from "@/hooks/commission-rule";

interface CommissionRuleModalProps {
  opened: boolean;
  onClose(): void;
  canWrite: boolean;
  refetch(): void;
}

const CommissionRuleModal = ({
  opened,
  onClose,
  canWrite, // refetch
  refetch,
}: CommissionRuleModalProps) => {
  /*
   * Component State
   */

  const formDefaultValues = {
    name: "",
    commissionRate: 0,
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      name: isNotEmpty("Name is required."),
      commissionRate: isNotEmpty("Commission Rate is required."),
    },
  });

  /*
   * Service Handlers
   */
  const queryClient = useQueryClient();
  const createCommissionRule = useCreateCommissionRule(queryClient);

  type FormValues = typeof form.values;
  const handleAction = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        commissionRate: Number(
          formatNumberCustomDecimals(Number(values.commissionRate / 100), 4),
        ),
      };
      await createCommissionRule.mutateAsync(payload);
      notifications.show({
        message: "Commission Rule Successfully Created",
        color: "green",
      });
      closeAndResetForm();
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Creating Commission Rule", error),
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
        title={"Create Commission Rule"}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => handleAction(values))}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                withAsterisk
                label="Name"
                placeholder="Commission Rule Name"
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
          </Grid>
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
