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
  onOpen(): void;
  onClose(): void;
  refetch: () => Promise<any>;
}

const SpotlightListingModal = ({
  serviceListingId,
  opened,
  onOpen,
  onClose,
  refetch,
}: SpotlightListingModalProps) => {
  return (
    <>
      <Button
        size="md"
        leftIcon={<IconSparkles size="1.2rem" />}
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        onClick={onOpen}
      >
        Spotlight Listing
      </Button>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={onClose}
        size="60%"
        title={
          <Text fw={600} size="xl">
            Spotlight Service Listing
          </Text>
        }
      >
        <Alert mb="sm">
          Spotlight your service listing for just <strong>$5</strong>!
          Spotlighted service listings will be bumped once to the top of all
          service listings, and be displayed on the home page for up to 1 week.
        </Alert>
        <Elements stripe={stripePromise}>
          <SpotlightListingCheckoutForm
            serviceListingId={serviceListingId}
            onClose={onClose}
            refetch={refetch}
          />
        </Elements>
      </Modal>
    </>
  );
};

export default SpotlightListingModal;
