import { useMantineTheme } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { OrderItem, Pet } from "shared-utils";
import ViewOrderDetails from "web-ui/shared//order-management/viewOrderDetails";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import { PetOwner } from "@/types/types";

interface PBOrdersDetailsProps {
  order: OrderItem;
  pet: Pet;
}

export default function PBOrdersDetails({ order, pet }: PBOrdersDetailsProps) {
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <>
      <Head>
        <title>
          {order.orderItemId} - {order.itemName}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LargeBackButton
        text="Back to Order Management"
        onClick={() => {
          router.push("/business/orders");
        }}
        size="sm"
        mb="md"
      />
      <ViewOrderDetails order={order} pet={pet} theme={theme} />
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
  return { props: { order, pet } };
}
