import { Container } from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/types/types";

const PK = `${process.env.NEXT_PUBLIC_STRIPE_PK_TEST}`;
loadStripe.setLoadParameters({ advancedFraudSignals: false });
const stripePromise = loadStripe(PK);

interface CheckoutProps {
  userId: number;
  checkoutSummary: CheckoutSummary;
}

export default function Checkout({ userId, checkoutSummary }: CheckoutProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Checkout - PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} mb={50}>
        <LargeBackButton
          text="Back to Cart"
          size="sm"
          mb="md"
          onClick={() => router.push("/customer/cart")}
        />
        <PageTitle title="Checkout" mb="lg" />
        <Elements stripe={stripePromise}>
          <CheckoutForm userId={userId} checkoutSummary={checkoutSummary} />
        </Elements>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const checkoutSummary = context.query;
  return { props: { checkoutSummary } };
}
