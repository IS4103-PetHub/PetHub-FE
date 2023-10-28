import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface SearchBarProps extends TextInputProps {
  text: string;
  onSearch(searchStr: string): void;
}

const SearchBar = ({ text, onSearch, ...props }: SearchBarProps) => {
  const [currentSearchStr, setCurrentSearchStr] = useState("");

  const handleSearch = (searchStr: string) => {
    setCurrentSearchStr(searchStr);
    onSearch(searchStr);
  };

  const handleClear = () => {
    setCurrentSearchStr("");
    onSearch("");
  };

  return (
    <TextInput
      size="lg"
      placeholder={text}
      icon={<IconSearch size={"1.25rem"} />}
      sx={{ marginTop: 20, marginBottom: 20 }}
      value={currentSearchStr}
      onChange={(event) => handleSearch(event.currentTarget.value)}
      rightSection={
        <ActionIcon onClick={handleClear}>
          <IconX size={"1.25rem"} color="gray" />
        </ActionIcon>
      }
      {...props}
    />
  );
};

export default SearchBar;
