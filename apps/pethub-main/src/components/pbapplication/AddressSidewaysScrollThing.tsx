import { Box } from "@mantine/core";
import { Address } from "@/types/types";
import { AddAddressCard } from "./AddAddressCard";
import { AddressCard } from "./AddressCard";

type AddressSidewaysScrollThingProps = {
  addressList: Address[];
  openModal: () => void;
  onRemoveAddress: (address: Address) => void;
};

export const AddressSidewaysScrollThing = ({
  addressList,
  openModal,
  onRemoveAddress,
}: AddressSidewaysScrollThingProps) => {
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
        onRemoveAddress={() => onRemoveAddress(address)}
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
        <Box
          style={{
            display: "inline-block",
            position: "relative",
          }}
          onClick={openModal}
        >
          <AddAddressCard />
        </Box>
        {addresses}
      </Box>
    </Box>
  );
};
