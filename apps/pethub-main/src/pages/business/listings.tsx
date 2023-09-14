import {
  Container,
  Card,
  Image,
  Group,
  Text,
  Badge,
  Button,
  Modal,
  TextInput,
  Checkbox,
  Select,
  FileInput,
  NumberInput,
  Slider,
  MultiSelect,
  Grid,
  Col,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import ServiceListingModal from "@/components/service/ServiceListingModal";
import ServiceListTable from "@/components/service/ServiceListingTable";
import { useGetServiceListingByPetBusinessIdAndAccountType } from "@/hooks/serviceListingHooks";
import { AccountTypeEnum } from "@/types/constants";

// https://zumvet.com/blog/wp-content/uploads/2023/06/Pet-Angel-Blog-2022-14-1080x648-1.png

interface MyAccountProps {
  userId: number;
  accountType: AccountTypeEnum;
}

export default function Listings({ userId, accountType }: MyAccountProps) {
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] =
    useState(false);

  const openCreateServiceModal = () => {
    setIsCreateServiceModalOpen(true);
  };

  const closeCreateServiceModal = () => {
    setIsCreateServiceModalOpen(false);
  };

  const { data: serviceListings, refetch: refetchServiceListings } =
    useGetServiceListingByPetBusinessIdAndAccountType(userId);

  return (
    <Container fluid>
      <PageTitle title="Service Listings Management" />

      <Group mt="xl" position="right">
        <LargeCreateButton
          text="Create Service Listing"
          onClick={openCreateServiceModal}
        />
      </Group>

      <Group mt="xs">
        <ServiceListingModal
          opened={isCreateServiceModalOpen}
          onClose={closeCreateServiceModal}
          isView={false}
          isUpdate={false}
          serviceListing={null}
          userId={userId}
          refetch={refetchServiceListings}
        />
      </Group>

      <ServiceListTable
        serviceListings={serviceListings}
        userId={userId}
        refetch={refetchServiceListings}
      />
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return null;

  const userId = session.user["userId"];
  const accountType = session.user["accountType"];

  return { props: { userId, accountType } };
}
