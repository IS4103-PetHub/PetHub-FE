import { useMantineTheme } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { AccountStatusEnum, OrderItem, Pet } from "shared-utils";
import ViewOrderDetails from "web-ui/shared//order-management/viewOrderDetails";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import PBPendingAccountMessage from "@/components/common/PBPendingAccountMessage";

interface PBOrdersDetailsProps {
  order: OrderItem;
  pet: Pet;
  accountStatus: AccountStatusEnum;
}

export default function PBOrdersDetails({
  order,
  pet,
  accountStatus,
}: PBOrdersDetailsProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {order.orderItemId} - {order.itemName}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {accountStatus === AccountStatusEnum.Pending ? (
        <PBPendingAccountMessage />
      ) : (
        <>
          <LargeBackButton
            text="Back to Order Management"
            onClick={() => {
              router.push("/business/orders");
            }}
            size="sm"
            mb="md"
          />
          <ViewOrderDetails order={order} pet={pet} />
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const accountStatus = session.user["accountStatus"];
  const orderId = context.params.id;
  const { data: order } = await api.get(`/order-items/${orderId}`);
  let pet = null;
  if (order.booking) {
    if (order.booking.petId) {
      const { data: petData } = await api.get(`/pets/${order.booking.petId}`);
      pet = petData;
    }
  }
  return { props: { order, pet, accountStatus } };
}
