import { Alert, Button, Modal, Text } from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { IconSparkles } from "@tabler/icons-react";
import React from "react";
import SpotlightListingCheckoutForm from "./SpotlightListingCheckoutForm";

const PK: string = `${process.env.NEXT_PUBLIC_STRIPE_PK_TEST}`;
const stripePromise = loadStripe(PK);

interface SpotlightListingModalProps {
  serviceListingId: number;
  opened: boolean;
  open(): void;
  close(): void;
}

const SpotlightListingModal = ({
  serviceListingId,
  opened,
  open,
  close,
}: SpotlightListingModalProps) => {
  return (
    <>
      <Button
        leftIcon={<IconSparkles size="1.2rem" />}
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        onClick={open}
      >
        Spotlight Listing
      </Button>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={close}
        size="xl"
        title={
          <Text fw={600} size="xl">
            Spotlight Service Listing
          </Text>
        }
      >
        <Alert mb="sm">
          <Text>
            Spotlight your service listing for just <strong>$5</strong>!
            Spotlighted service listings will be bumped once to the top of all
            service listings, and be displayed on the home page for up to 1
            week.
          </Text>
        </Alert>
        <Elements stripe={stripePromise}>
          <SpotlightListingCheckoutForm serviceListingId={serviceListingId} />
        </Elements>
      </Modal>
    </>
  );
};

export default SpotlightListingModal;
