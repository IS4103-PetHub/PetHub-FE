import { Group, Loader } from "@mantine/core";
import React from "react";

const CenterLoader = () => {
  return (
    <div className="center-vertically">
      <Group position="center">
        <Loader size="lg" style={{ marginTop: "2rem" }} />
      </Group>
    </div>
  );
};

export default CenterLoader;
