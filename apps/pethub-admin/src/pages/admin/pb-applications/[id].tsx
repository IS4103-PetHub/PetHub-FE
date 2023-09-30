import {
  Container,
  Group,
  Box,
  Badge,
  Modal,
  Textarea,
  Button,
  Grid,
  Text,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import ApplicationDetails from "@/components/pb-applications/ApplicationDetails";
import {
  useApprovePetBusinessApplication,
  useGetPetBusinessApplicationById,
  useRejectPetBusinessApplication,
} from "@/hooks/pet-business-application";
import {
  BusinessApplicationStatusEnum,
  PermissionsCodeEnum,
} from "@/types/constants";
import {
  ApprovePetBusinessApplicationPayload,
  Permission,
  RejectPetBusinessApplicationPayload,
} from "@/types/types";

interface PetBusinessApplicationDetailsProps {
  userId: number;
  permissions: Permission[];
}

export default function PetBusinessApplicationDetails({
  userId,
  permissions,
}: PetBusinessApplicationDetailsProps) {
  const router = useRouter();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WritePBApplications,
  );
  const canRead = permissionCodes.includes(
    PermissionsCodeEnum.ReadPBApplications,
  );

  const [applicationStatus, setApplicationStatus] =
    useState<BusinessApplicationStatusEnum>();
  const queryClient = useQueryClient();
  const [isDisabled, setIsDisabled] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [rejectButtonChosen, setRejectButtonChosen] = useState(false);

  const applicationId = Number(router.query.id);

  const {
    data: petBusinessApplication,
    refetch: refetchPetBusinessApplication,
  } = useGetPetBusinessApplicationById(applicationId);

  useEffect(() => {
    if (!petBusinessApplication) {
      setApplicationStatus(BusinessApplicationStatusEnum.Notfound);
      setIsDisabled(false);
    } else {
      setApplicationStatus(petBusinessApplication.applicationStatus);
      setIsDisabled(
        petBusinessApplication.applicationStatus ===
          BusinessApplicationStatusEnum.Approved ||
          petBusinessApplication.applicationStatus ===
            BusinessApplicationStatusEnum.Pending,
      );
    }
  }, [petBusinessApplication]);

  const form = useForm({
    initialValues: {
      remark: "",
    },
    validate: {
      remark: (val) =>
        val.length > 1024
          ? "The input exceeds the character limit of 1024."
          : null,
    },
  });

  const ApproveButton = () => (
    <Button
      fullWidth
      variant="light"
      size="lg"
      onClick={() => {
        setRejectButtonChosen(false);
        open();
      }}
      color="green"
    >
      Approve
    </Button>
  );

  const RejectButton = () => (
    <Button
      fullWidth
      variant="light"
      size="lg"
      onClick={() => {
        setRejectButtonChosen(true);
        open();
      }}
      color="red"
    >
      Reject
    </Button>
  );

  const actionButtonGroup = (
    <Center>
      {applicationStatus === BusinessApplicationStatusEnum.Pending ? (
        <>
          <RejectButton />
          &nbsp;
          <ApproveButton />
        </>
      ) : null}
    </Center>
  );

  const approvePetBusinessApplicationMutation =
    useApprovePetBusinessApplication(queryClient);
  const approvePetBusinessApplication = async (
    payload: ApprovePetBusinessApplicationPayload,
  ) => {
    try {
      await approvePetBusinessApplicationMutation.mutateAsync(payload);
      notifications.show({
        title: "Application Approved",
        color: "green",
        icon: <IconCheck />,
        message: `Email notification sent to the Pet Business.`,
      });
      refetchPetBusinessApplication();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Approving Application", error),
      });
    }
  };

  const rejectPetBusinessApplicationMutation =
    useRejectPetBusinessApplication(queryClient);
  const rejectPetBusinessApplication = async (
    payload: RejectPetBusinessApplicationPayload,
  ) => {
    try {
      await rejectPetBusinessApplicationMutation.mutateAsync(payload);
      notifications.show({
        title: "Application Rejected",
        color: "green",
        icon: <IconCheck />,
        message: `Email notification sent to the Pet Business.`,
      });
      refetchPetBusinessApplication();
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Rejecting Application", error),
      });
    }
  };

  type formValues = typeof form.values;
  function handleSubmit(values: formValues) {
    if (
      applicationStatus === BusinessApplicationStatusEnum.Pending &&
      rejectButtonChosen
    ) {
      const rejectPayload: RejectPetBusinessApplicationPayload = {
        petBusinessApplicationId: applicationId,
        remark: values.remark,
      };
      rejectPetBusinessApplication(rejectPayload);
    } else if (
      applicationStatus === BusinessApplicationStatusEnum.Pending &&
      !rejectButtonChosen
    ) {
      const approvePayload: ApprovePetBusinessApplicationPayload = {
        petBusinessApplicationId: applicationId,
        approverId: userId,
      };
      approvePetBusinessApplication(approvePayload);
    } else {
      notifications.show({
        title: "Application not in Pending state",
        color: "red",
        icon: <IconX />,
        message: `This action is not allowed. The application status is currently ${applicationStatus}.`,
      });
    }
  }

  if (!applicationId) {
    return null;
  }

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>Pet Business Application Details - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart" mb="xl">
          <Group>
            <PageTitle title="Application Details" />
            <Badge variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
              <>Application ID: {applicationId}</>
            </Badge>
          </Group>
          <LargeBackButton
            text="Back to applications"
            onClick={() => {
              window.location.href = "/admin/pb-applications";
            }}
          />
        </Group>
        <Box>
          <ApplicationDetails
            applicationStatus={applicationStatus}
            application={petBusinessApplication}
            actionButtonGroup={actionButtonGroup}
            disabled={!canWrite}
          />
          <form
            onSubmit={form.onSubmit((values: any) => handleSubmit(values))}
          />
        </Box>
        <Modal
          opened={opened}
          onClose={close}
          title="Confirm Action"
          centered
          padding="1.5rem"
          size="md"
        >
          <Text>
            {rejectButtonChosen
              ? "Are you sure you want reject this application? You may specify an optional remark to help the pet business understand why their application was rejected and what they should update."
              : "Are you sure you want to approve this application?"}
          </Text>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Grid mt="md" mb="md">
              <Grid.Col span={12}>
                {rejectButtonChosen && (
                  <Textarea
                    label="Remark"
                    placeholder="Enter a remark here..."
                    {...form.getInputProps("remark")}
                  />
                )}
              </Grid.Col>
            </Grid>
            <Group mt="25px" position="right">
              <Button type="reset" color="gray" onClick={close}>
                Cancel
              </Button>
              {rejectButtonChosen ? (
                <Button type="submit" onClick={close} color="red">
                  Reject
                </Button>
              ) : (
                <Button type="submit" onClick={close} color="green">
                  Approve
                </Button>
              )}
            </Group>
          </form>
        </Modal>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { userId, permissions } };
}
