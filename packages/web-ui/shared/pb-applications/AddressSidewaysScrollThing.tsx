import { Box } from "@mantine/core";
import { Address } from "../../../../apps/pethub-main/src/types/types";
import AddAddressCard from "./AddAddressCard";
import AddressCard from "./AddressCard";

interface AddressSidewaysScrollThingProps {
  addressList: Address[];
  isDisabled: boolean;
  hasAddCard: boolean;
  openModal?: () => void;
  onRemoveAddress?: (address: Address) => void;
}

const AddressSidewaysScrollThing = ({
  addressList,
  isDisabled,
  hasAddCard,
  openModal,
  onRemoveAddress,
}: AddressSidewaysScrollThingProps) => {
  const enum ActionType {
    AddAddress = "ADDADDRESS",
    RemoveAddress = "REMOVEADDRESS",
  }

  const checkEditable = (actionType: ActionType) => {
    if (isDisabled) {
      return () => {};
    }
    return actionType === ActionType.AddAddress ? openModal : onRemoveAddress;
  };

  const addresses = addressList.map((address, idx) => (
    <Box
      key={idx}
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      <AddressCard
        address={address}
        onRemoveAddress={checkEditable(ActionType.RemoveAddress)}
        disabled={isDisabled}
      />
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
      pt="0.4rem"
    >
      <Box
        p="sm"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {!isDisabled && hasAddCard && (
          <Box
            style={{
              display: "inline-block",
              position: "relative",
            }}
            onClick={checkEditable(ActionType.AddAddress) as any}
          >
            <AddAddressCard />
          </Box>
        )}
        {addresses}
      </Box>
    </Box>
  );
};

export default AddressSidewaysScrollThing;
