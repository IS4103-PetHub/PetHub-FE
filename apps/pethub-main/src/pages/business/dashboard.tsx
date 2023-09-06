import { Container } from "@mantine/core";
import React from "react";
import { PageTitle } from "web-ui";

export default function Dashboard() {
  /* 
    Remember to do a server-side check that the logged-in user's current role is a PB, else set the redirect destination.
    This is because client data can be easily tampered with.
  */

  return (
    <Container fluid>
      <PageTitle title="Business Dashboard" />
    </Container>
  );
}
