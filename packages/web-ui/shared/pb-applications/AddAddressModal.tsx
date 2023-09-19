import {
  useMantineTheme,
  Modal,
  Box,
  TextInput,
  Button,
  Group,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AddAddressModal = ({
  opened,
  open,
  close,
  addAddressForm,
  handleAddAddress,
}) => {
  const router = useRouter();
  const theme = useMantineTheme();

  // Reset the entire modal (including forms, states etc) if it is closed and re-opened
  useEffect(() => {
    if (!opened) {
      // Let closing animation finish so it's not visible
      const timer = setTimeout(() => {
        addAddressForm.reset();
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
      title="Add a new address"
    >
      <form
        onSubmit={addAddressForm.onSubmit((values: any) =>
          handleAddAddress(values),
        )}
      >
        <Box>
          <TextInput
            mb="sm"
            withAsterisk
            label="Address name"
            placeholder="Service HQ"
            {...addAddressForm.getInputProps("addressName")}
          />
          <TextInput
            mb="sm"
            withAsterisk
            label="Address line 1"
            placeholder="2 Esplanade Road"
            {...addAddressForm.getInputProps("line1")}
          />
          <TextInput
            mb="sm"
            label="Address line 2"
            {...addAddressForm.getInputProps("line2")}
          />
          <TextInput
            mb="sm"
            withAsterisk
            label="Postal code"
            placeholder="123456"
            {...addAddressForm.getInputProps("postalCode")}
          />
          <Group position="right">
            <Button mt="xs" mb="sm" onClick={() => close()} color="gray">
              Cancel
            </Button>
            <Button mt="xs" type="submit" mb="sm">
              Add Address
            </Button>
          </Group>
        </Box>
      </form>
    </Modal>
  );
};

export default AddAddressModal;
