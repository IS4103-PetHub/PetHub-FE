import { Center, Group, Loader, LoaderProps } from "@mantine/core";
import React from "react";

const CenterLoader = ({ ...props }: LoaderProps) => {
  return (
    <div className="center-vertically">
      <Center>
        <Loader mt="2rem" size="lg" {...props} opacity={0.5} />
      </Center>
    </div>
  );
};

export default CenterLoader;
