import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconHandMiddleFinger, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Address } from "@/types/types";
import { AddAddressModal } from "./AddAddressModal";
import { AddressCard } from "./AddressCard";

type AddressSidewaysScrollThingProps = {
  addressList: Address[];
  openModal: () => void;
};

export const AddressSidewaysScrollThing = ({
  addressList,
  openModal,
}: AddressSidewaysScrollThingProps) => {
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
        onClick={openModal}
      >
        Add an address
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
    </Box>
  );
};
