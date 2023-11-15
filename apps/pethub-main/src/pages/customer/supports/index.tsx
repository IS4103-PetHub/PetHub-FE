import { Box, Card, Container, Grid, Group, Text } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  SupportTicketReason,
  formatEnumValueToLowerCase,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";

export default function Supports({}) {
  const router = useRouter();
  const cardTitles = Object.values(SupportTicketReason)
    .map((reason) => ({
      formattedValue: formatStringToLetterCase(reason),
      originalValue: reason,
    }))
    .sort((a, b) => a.formattedValue.localeCompare(b.formattedValue));

  return (
    <>
      <Head>
        <title>My Supports - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container mt={50} size="60vw" sx={{ overflow: "hidden" }}>
          <Box mb={"xl"}>
            <PageTitle title={"Welcome to PetHub Support Serivce"} mb="lg" />
            <Text size={"xl"}>
              What would you like help with today? <br /> You can quicky take
              care of most things here, or connect with us @pethub215@gmail.com
              when needed
            </Text>
          </Box>
          <Grid>
            {cardTitles.map((title, index) => (
              <Grid.Col span={3} key={index}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  onClick={() =>
                    router.push(
                      `/customer/supports/create?category=${title.originalValue}`,
                    )
                  }
                >
                  {title.formattedValue}
                </Card>
              </Grid.Col>
            ))}
          </Grid>
          <Container>
            here we will display the list of past support tickets and status
          </Container>
        </Container>
      </main>
    </>
  );
}
