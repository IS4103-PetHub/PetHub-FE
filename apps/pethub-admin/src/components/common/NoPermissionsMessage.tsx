import React from "react";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";

const NoPermissionsMessage = () => {
  return (
    <SadDimmedMessage
      title="Not authorised"
      subtitle="You do not have the permissions to access this page."
    />
  );
};

export default NoPermissionsMessage;
