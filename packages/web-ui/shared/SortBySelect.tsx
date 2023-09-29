import { Select, SelectProps } from "@mantine/core";
import React from "react";

interface SortBySelectProps extends SelectProps {
  data: any[];
  value: any;
  onChange(value: any): void;
}

const SortBySelect = ({
  data,
  value,
  onChange,
  ...props
}: SortBySelectProps) => {
  return (
    <Select
      dropdownPosition="bottom"
      w="20%"
      mt={-25}
      label="Sort by"
      size="md"
      placeholder="Select sort"
      data={data}
      value={value}
      onChange={(value) => onChange(value)}
      {...props}
    />
  );
};

export default SortBySelect;
