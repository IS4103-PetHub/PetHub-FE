import {
  Grid,
  TextInput,
  NumberInput,
  Checkbox,
  Text,
  Box,
  Badge,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import { CommissionRule } from "@/types/types";

interface CommissionRuleInfoFormProps {
  commissionRule?: CommissionRule;
  form: UseFormReturnType<any>;
  isEditing: boolean;
  onCancel(): void;
  onClickEdit(): void;
  onSubmit(values: any): void;
  disabled?: boolean;
}

const CommissionRuleInfoForm = ({
  commissionRule,
  form,
  isEditing,
  onCancel,
  onClickEdit,
  onSubmit,
  disabled,
}: CommissionRuleInfoFormProps) => {
  return (
    <form onSubmit={form.onSubmit((values: any) => onSubmit(values))}>
      {isEditing ? (
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
      ) : (
        <>
          <Box mb="md">
            <Text weight="600">Name:</Text>
            <Text>
              {commissionRule?.name}
              {commissionRule?.default ? <Badge>Default</Badge> : null}
            </Text>
          </Box>
          <Box>
            <Text weight="600">Commission Rate:</Text>
            <Text>
              {commissionRule?.commissionRate
                ? `${commissionRule?.commissionRate}%`
                : "-"}
            </Text>
          </Box>
        </>
      )}
      {disabled ? null : (
        <EditCancelSaveButtons
          isEditing={isEditing}
          onClickCancel={onCancel}
          onClickEdit={onClickEdit}
        />
      )}
    </form>
  );
};

export default CommissionRuleInfoForm;
