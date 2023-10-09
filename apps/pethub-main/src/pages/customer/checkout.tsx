import { Container } from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Head from "next/head";
import { PageTitle } from "web-ui";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const stripePromise = loadStripe("pk_test_GvF3BSyx8RSXMK5yAFhqEd3H");

export default function Checkout() {
  return (
    <>
      <Head>
        <title>Checkout - PetHub</title>
        <meta name="description" content="PetHub Main Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} mb={50}>
        <PageTitle title="Checkout" mb="lg" />
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </Container>
    </>
  );
}
