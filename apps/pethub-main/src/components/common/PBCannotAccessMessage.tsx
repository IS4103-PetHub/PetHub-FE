import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";

const PBCannotAccessMessage = () => {
  const router = useRouter();
  return (
    <>
      <SadDimmedMessage
        title="You cannot access this feature yet"
        subtitle="This feature can only be accessed after your business partner application has been approved. If you have not yet created an application, click the button below to apply!"
        button={
          <Button
            color="dark"
            onClick={() => router.push("/business/application")}
          >
            Go to partner application
          </Button>
        }
      />
    </>
  );
};

export default PBCannotAccessMessage;
