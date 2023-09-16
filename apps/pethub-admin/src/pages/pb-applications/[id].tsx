import { Container, Group, Box, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import ApplicationDetails from "@/components/pbapplications/ApplicationDetails";
import ApplicationStatusAlert from "@/components/pbapplications/ApplicationStatusAlert";
import {
  useApprovePetBusinessApplication,
  useGetPetBusinessApplicationById,
  useRejectPetBusinessApplication,
} from "@/hooks/pet-business-application";
import { BusinessApplicationStatusEnum } from "@/types/constants";
import {
  ApprovePetBusinessApplicationPayload,
  PetBusinessApplication,
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

  console.log("PET APP", petBusinessApplication);

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
    const payload: RejectPetBusinessApplicationPayload = {
      petBusinessApplicationId: 1,
      remark: values.remark,
    };
    if (applicationStatus === BusinessApplicationStatusEnum.Pending) {
      rejectPetBusinessApplication(payload);
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
          onClick={() => router.back()}
        />
      </Group>
      <Box>
        <ApplicationDetails
          applicationStatus={applicationStatus}
          application={petBusinessApplication}
        />
        <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))} />
      </Box>
    </Container>
  );
}
