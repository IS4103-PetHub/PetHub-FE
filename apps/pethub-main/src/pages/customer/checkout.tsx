import { Container } from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Head from "next/head";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const PK = `${process.env.NEXT_PUBLIC_STRIPE_PK_TEST}`;
const stripePromise = loadStripe(PK);

export default function Checkout() {
  return (
    <>
      <Head>
        <title>Checkout - PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} mb={50}>
        <LargeBackButton text="Back to Cart" size="sm" mb="md" />
        <PageTitle title="Checkout" mb="lg" />
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </Container>
    </>
  );
}
