import {
  useMantineTheme,
  Modal,
  Box,
  TextInput,
  Text,
  Title,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { AccountTypeEnum } from "@/types/constants";

export const AddAddressModal = ({
  opened,
  open,
  close,
  addAddressForm,
  handleAddAddress,
}) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [isForgotPasswordSuccessful, setIsForgotPasswordSuccessful] =
    useState(false);

  // Reset the entire modal (including forms, states etc) if it is closed and re-opened
  useEffect(() => {
    if (!opened) {
      // Let closing animation finish so it's not visible
      const timer = setTimeout(() => {
        addAddressForm.reset();
        setIsForgotPasswordSuccessful(false);
      }, 800);
    }
  }, [opened]);

  return (
    <Modal
      centered
      size="md"
      overlayProps={{
        color:
          theme.colorScheme === "light"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
      opened={opened}
      onClose={close}
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "linear",
      }}
    >
      <form
        onSubmit={addAddressForm.onSubmit((values: any) =>
          handleAddAddress(values),
        )}
      >
        <Box>
          <Title align="center" mb="sm">
            Add a new address
          </Title>
          <TextInput
            withAsterisk
            label="Address Name"
            placeholder="Service HQ"
            {...addAddressForm.getInputProps("addressName")}
          />
          <TextInput
            withAsterisk
            label="Address Line 1"
            placeholder="2 Esplanade Road"
            {...addAddressForm.getInputProps("addressLine1")}
          />
          <TextInput
            label="Address Line 2"
            {...addAddressForm.getInputProps("addressLine2")}
          />
          <TextInput
            withAsterisk
            label="Address Postal Code"
            placeholder="SG123456"
            {...addAddressForm.getInputProps("addressPostalCode")}
          />
          <Button mt="xs" type="submit" fullWidth mb="sm">
            Add Address
          </Button>
        </Box>
      </form>
    </Modal>
  );
};
