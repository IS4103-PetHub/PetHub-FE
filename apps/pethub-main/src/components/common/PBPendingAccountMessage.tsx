import React from "react";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";

const PBPendingAccountMessage = () => {
  return (
    <SadDimmedMessage
      title="Your account status is Pending"
      subtitle="This feature can only be accessed after your business partner application has been approved."
    />
  );
};

export default PBPendingAccountMessage;
