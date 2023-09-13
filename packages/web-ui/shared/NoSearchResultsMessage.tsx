import React from "react";
import SadDimmedMessage from "./SadDimmedMessage";

const NoSearchResultsMessage = () => {
  const title = "No search results";
  const subtitle = "Try searching something else";

  return <SadDimmedMessage title={title} subtitle={subtitle} />;
};

export default NoSearchResultsMessage;
