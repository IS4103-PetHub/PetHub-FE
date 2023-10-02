import { Box, Group, Text } from "@mantine/core";
import React from "react";

const SimpleFooter = () => {
  return (
    <Box sx={{ backgroundColor: "white", verticalAlign: "center" }} h={60}>
      <Group h="100%" w="100%" sx={{ borderTop: "0.5px solid lightgray" }}>
        <Text ml="xl" color="dimmed" size="sm">
          © 2023 PetHub. All Rights Reserved.
        </Text>
      </Group>
    </Box>
  );
};

export default SimpleFooter;
