import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Address } from "@/types/types";
import { AddAddressModal } from "./AddAddressModal";
import { AddressCard } from "./AddressCard";

type AddressSidewaysScrollThingProps = {
  addressList: Address[];
};

export const AddressSidewaysScrollThing = ({
  addressList,
}: AddressSidewaysScrollThingProps) => {
  const [isAddAddressModalOpened, { open, close }] = useDisclosure(false);
  const addresses = addressList.map((address, idx) => (
    <Box
      key={idx}
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      <AddressCard address={address} />
    </Box>
  ));

  const form = useForm({
    initialValues: {
      addressName: "",
      addressLine1: "",
      addressLine2: "",
      addressPostalCode: "",
    },
    validate: {
      addressName: (value) => (!value ? "Address name is required." : null),
      addressLine1: (value) => (!value ? "Address is required." : null),
      addressPostalCode: (value) =>
        !value ? "Address postal code is required." : null,
    },
  });

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        borderRadius: theme.radius.md,
        borderWidth: "10px",
      })}
    >
      <Button
        fullWidth
        variant="light"
        leftIcon={<IconPlus size="1rem" />}
        onClick={open}
      >
        Add another address
      </Button>
      <Box
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "10px 0",
          width: "100%",
        }}
      >
        {addresses}
      </Box>
      <AddAddressModal
        opened={isAddAddressModalOpened}
        open={open}
        close={close}
        addAddressForm={form}
      />
    </Box>
  );
};
