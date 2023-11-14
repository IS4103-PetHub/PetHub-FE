import { useMantineTheme } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { OrderItem, Pet } from "shared-utils";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import ViewOrderDetails from "web-ui/shared/order-management/ViewOrderDetails";
import api from "@/api/axiosConfig";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { PermissionsCodeEnum } from "@/types/constants";
import { PetOwner, Permission } from "@/types/types";

interface PBOrdersDetailsProps {
  order: OrderItem;
  pet: Pet;
  permissions: Permission[];
}

export default function PBOrdersDetails({
  order,
  pet,
  permissions,
}: PBOrdersDetailsProps) {
  const router = useRouter();

  //permissions
  const permissionCodes = permissions.map((permission) => permission.code);
  const canWrite = permissionCodes.includes(
    PermissionsCodeEnum.WriteOrderItems,
  );
  const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadOrderItems);

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  return (
    <>
      <Head>
        <title>
          {order.orderItemId} - {order.itemName}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ViewOrderDetails
        order={order}
        pet={pet}
        isAdmin={true}
        router={router}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const orderId = context.params.id;
  const { data: order } = await api.get(`/order-items/${orderId}`);
  let pet = null;
  if (order.booking) {
    if (order.booking.petId) {
      const { data: petData } = await api.get(`/pets/${order.booking.petId}`);
      pet = petData;
    }
  }

  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;

  return { props: { order, pet, permissions } };
}
