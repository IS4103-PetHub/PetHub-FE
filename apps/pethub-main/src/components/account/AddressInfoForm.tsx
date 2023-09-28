import { Grid } from "@mantine/core";
import { TransformedValues, useForm } from "@mantine/form";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Address } from "shared-utils";
import EditCancelSaveButtons from "web-ui/shared/EditCancelSaveButtons";
import AddAddressModal from "web-ui/shared/pb-applications/AddAddressModal";
import AddressSidewaysScrollThing from "web-ui/shared/pb-applications/AddressSidewaysScrollThing";
import { useUpdatePetBusiness } from "@/hooks/pet-business";
import { PetBusiness } from "@/types/types";
import { validateAddressName } from "@/util";

interface AddressInfoFormProps {
  petBusiness: PetBusiness;
  refetch(): void;
}

const AddressInfoForm = ({ petBusiness, refetch }: AddressInfoFormProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useToggle();
  const [isAddAddressModalOpened, { open, close }] = useDisclosure(false);

  const addressForm = useForm({
    initialValues: {
      addressName: "",
      line1: "",
      line2: "",
      postalCode: "",
    },
    validate: {
      addressName: (value) => validateAddressName(value),
      line1: (value) => (!value ? "Address is required." : null),
      postalCode: (value) =>
        !value ? "Address postal code is required." : null,
    },
  });

  const formDefaultValues = {
    businessAddresses: petBusiness.businessAddresses || [],
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      businessAddresses: (value) => null,
    },
  });

  useEffect(() => {
    form.setValues(formDefaultValues);
  }, [petBusiness]);

  const updatePetBusinessMutation = useUpdatePetBusiness(queryClient);

  if (!petBusiness) {
    return null;
  }

  const updateAccount = async (payload: any) => {
    try {
      await updatePetBusinessMutation.mutateAsync(payload);
      setIsEditing(false);
      notifications.show({
        title: "Addresses Updated",
        color: "green",
        icon: <IconCheck />,
        message: `Addresses updated successfully!`,
      });
      refetch();
      form.setValues(formDefaultValues);
    } catch (error: any) {
      notifications.show({
        title: "Error Updating addresses",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  type addressFormValues = typeof addressForm.values;
  function handleAddAddress(values: addressFormValues) {
    const updatedAddresses = [...form.values.businessAddresses, values];
    form.setValues({
      ...form.values,
      businessAddresses: updatedAddresses,
    });
    close();
    addressForm.reset();
  }

  function handleRemoveAddress(address: Address) {
    const updatedAddresses = form.values.businessAddresses.filter(
      (a) => a !== address,
    );
    form.setValues({
      ...form.values,
      businessAddresses: updatedAddresses,
    });
  }

  const handleCancel = () => {
    setIsEditing(false);
    form.setValues(formDefaultValues);
  };

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    let payload = {
      userId: petBusiness.userId,
      businessAddresses: values.businessAddresses,
    };
    updateAccount(payload);
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid>
          <Grid.Col>
            <AddressSidewaysScrollThing
              hasAddCard={true}
              addressList={form.values.businessAddresses}
              openModal={open}
              onRemoveAddress={handleRemoveAddress}
              isDisabled={!isEditing}
            />
          </Grid.Col>
        </Grid>
        <EditCancelSaveButtons
          isEditing={isEditing}
          onClickCancel={handleCancel}
          onClickEdit={() => setIsEditing(true)}
        />
      </form>
      <AddAddressModal
        opened={isAddAddressModalOpened}
        open={open}
        close={close}
        addAddressForm={addressForm}
        handleAddAddress={handleAddAddress}
      />
    </>
  );
};

export default AddressInfoForm;
