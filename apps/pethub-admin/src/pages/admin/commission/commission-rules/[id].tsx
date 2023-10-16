import {
  Accordion,
  Badge,
  Container,
  Group,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import api from "@/api/axiosConfig";
import CommissionGroupAddPBModal from "@/components/commission/CommissionRuleAddPBModal";
import CommissionRuleInfoForm from "@/components/commission/CommissionRuleInfoForm";
import CommissionRulePetBusinessesTable from "@/components/commission/CommissionRulePetBusinessesTable";
import {
  useDeleteCommissionRuleById,
  useGetCommissionRuleById,
  useUpdateCommissionRule,
} from "@/hooks/commission-rule";
import { PermissionsCodeEnum } from "@/types/constants";
import { Permission } from "@/types/types";

interface CommissionRuleDetailsProps {
  ruleId: number;
  permissions: Permission[];
}

export default function CommissionRuleDetails({
  ruleId,
  permissions,
}: CommissionRuleDetailsProps) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteCommissionRules,
  );
  const canRead = permissionCodes.includes(
    PermissionsCodeEnum.ReadCommissionRules,
  );

  const [isEditingGroupInfo, setIsEditingGroupInfo] = useToggle();
  const [openedAccordions, setOpenedAccordions] = useState<string[]>([
    "commissionInfo",
    "commissionPetBusinesses",
  ]);

  const { data: commissionRule, refetch } = useGetCommissionRuleById(ruleId);

  const handleChangeAccordion = (values: string[]) => {
    // prevent user from closing an accordion when updating
    if (!values.includes("commissionInfo") && isEditingGroupInfo) {
      return;
    }
    setOpenedAccordions(values);
  };

  const handleCancelEditGroupInfo = () => {
    setIsEditingGroupInfo(false);
    form.setValues({
      name: commissionRule?.name ?? "",
      commissionRate: commissionRule?.commissionRate * 100 ?? 0,
    });
  };

  const formDefaultValues = {
    name: commissionRule?.name ?? "",
    commissionRate: commissionRule?.commissionRate * 100 ?? 0,
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      name: isNotEmpty("Name is required"),
      commissionRate: isNotEmpty("Commission Rate is required"),
    },
  });

  useEffect(() => {
    form.setValues({
      name: commissionRule?.name ?? "",
      commissionRate: commissionRule?.commissionRate * 100 ?? 0,
    });
  }, [commissionRule]);

  // TODO: DELETE COMMISSION RULE
  const deleteCommissionRuleMutation = useDeleteCommissionRuleById(queryClient);
  const handleDeleteCommissionRule = async (id?: number) => {
    if (!id) return;
    if (id == 1) {
      notifications.show({
        title: "Error Deleting Commission Rule",
        color: "red",
        icon: <IconX />,
        message: "Unable to Delete a Default Commission Rule",
      });
      return;
    }
    try {
      await deleteCommissionRuleMutation.mutateAsync(id);
      router.push("/admin/commission");
      notifications.show({
        title: "Commission Rule Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Commission Rule ID: ${id} deleted successfully.`,
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Commission Rule", error),
      });
    }
  };

  const updateCommissionRuleMutation = useUpdateCommissionRule(queryClient);
  const handleUpdateCommissionRule = async (values: any) => {
    const payload = {
      commissionRuleId: commissionRule?.commissionRuleId,
      name: values?.name,
      commissionRate: Number((values?.commissionRate / 100).toFixed(4)),
    };
    try {
      const result = await updateCommissionRuleMutation.mutateAsync(payload);
      notifications.show({
        title: "Commission Rule Updated",
        color: "green",
        icon: <IconCheck />,
        message: "Commission Rule updated successfully!",
      });
      refetch();
      setIsEditingGroupInfo(false);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Updating Commission Rule", error),
      });
    }
  };

  return (
    <>
      <Head>
        <title>Commission Rule Details - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <Group position="left">
            <PageTitle title="Commission Rule Details" />
            <Badge size="lg">Rule Id: {ruleId}</Badge>
          </Group>
          {canWrite && (
            <DeleteActionButtonModal
              title={`Are you sure you want to delete ${commissionRule?.name}?`}
              subtitle={
                commissionRule && commissionRule.petBusinesses.length > 0
                  ? "Are you sure you want to delete the commission rule? There are existing Pet businesses assigned to this Commission Rule. The pet businessses would be reassigned to the default rule."
                  : "The commission rule would no longer exists."
              }
              onDelete={() =>
                handleDeleteCommissionRule(commissionRule?.commissionRuleId)
              }
              large
            />
          )}
        </Group>
      </Container>
      <Accordion
        multiple
        mb="xl"
        value={openedAccordions}
        onChange={(values) => handleChangeAccordion(values)}
      >
        <Accordion.Item value="commissionInfo">
          <Accordion.Control>
            <Group>
              <Text weight={600} size="xl">
                Commission Rule Information
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel mb="xs">
            <CommissionRuleInfoForm
              commissionRule={commissionRule}
              form={form}
              isEditing={isEditingGroupInfo}
              onCancel={handleCancelEditGroupInfo}
              onClickEdit={() => setIsEditingGroupInfo(true)}
              onSubmit={handleUpdateCommissionRule}
              disabled={!canWrite}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="commissionPetBusinesses">
          <Accordion.Control>
            <Group>
              <Text weight={600} size="xl">
                Pet Businesses
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel mb="xs">
            {canWrite && (
              <CommissionGroupAddPBModal
                commissionRule={commissionRule}
                refetch={refetch}
              />
            )}

            <CommissionRulePetBusinessesTable
              commissionRule={commissionRule}
              disabled={!canWrite}
              // refetch={refetch}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export async function getServerSideProps(context) {
  const ruleId = context.params.id;
  const session = await getSession(context);
  if (!session) return { props: { ruleId } };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { ruleId, permissions } };
}
