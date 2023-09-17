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
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import ApplicationDetails from "@/components/pbapplications/ApplicationDetails";
import {
  useApprovePetBusinessApplication,
  useGetPetBusinessApplicationById,
  useRejectPetBusinessApplication,
} from "@/hooks/pet-business-application";
import { BusinessApplicationStatusEnum } from "@/types/constants";
import {
  ApprovePetBusinessApplicationPayload,
  RejectPetBusinessApplicationPayload,
} from "@/types/types";

interface PetBusinessApplicationDetailsProps {
  userId: number;
}

export default function PetBusinessApplicationDetails({
  userId,
}: PetBusinessApplicationDetailsProps) {
  const router = useRouter();
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
        title: "Error approving application",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
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
        title: "Error rejecting application",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
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
        title: "The application is not in the PENDING state",
        color: "red",
        icon: <IconX />,
        message: `This action is not allowed. The application status is currently ${applicationStatus}.`,
      });
    }
  }

  if (!applicationId) {
    return null;
  }

  return (
    <Container fluid>
      <Group position="apart" mb="xl">
        <Group>
          <PageTitle title="Viewing Application Details" />
          <Badge variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
            <>Application ID: {applicationId}</>
          </Badge>
        </Group>
        <LargeBackButton
          text="Back to applications"
          onClick={() => {
            window.location.href = "/pb-applications";
          }}
        />
      </Group>
      <Box>
        <ApplicationDetails
          applicationStatus={applicationStatus}
          application={petBusinessApplication}
          actionButtonGroup={actionButtonGroup}
        />
        <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))} />
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
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  const userId = (session.user as any)["userId"];

  return { props: { userId } };
}
