import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface SearchBarProps {
  text: string;
  onSearch(searchStr: string): void;
}

const SearchBar = ({ text, onSearch }: SearchBarProps) => {
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
          <IconX size={"1.25rem"} />
        </ActionIcon>
      }
    />
  );
};

export default SearchBar;
