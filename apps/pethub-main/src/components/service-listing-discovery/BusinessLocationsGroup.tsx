import { Divider, Group, Text } from "@mantine/core";
import React from "react";
import { Address } from "shared-utils";
import AddressCard from "web-ui/shared/pb-applications/AddressCard";

interface BusinessLocationsGroupProps {
  addresses: Address[];
}
const BusinessLocationsGroup = ({ addresses }: BusinessLocationsGroupProps) => {
  return (
    <>
      <Divider mt="lg" />
      <Text weight={600} mt="md">
        Locations ({addresses.length})
      </Text>
      <Group spacing={0}>
        {addresses.map((address) => (
          <AddressCard
            key={address.addressId}
            address={address}
            disabled
            ml={0}
            mt="md"
            mr="md"
          />
        ))}
      </Group>
    </>
  );
};

export default BusinessLocationsGroup;
