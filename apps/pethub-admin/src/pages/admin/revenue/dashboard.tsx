import { Button, Container, Group, useMantineTheme, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import Head from "next/head";
import { formatISODateTimeShort } from "shared-utils";
import { PageTitle } from "web-ui";

export default function RevenueTrackingDashboard() {
  const theme = useMantineTheme();
  return (
    <>
      <Head>
        <title>Revenue Dashboard - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid p="lg" h="100%" w="100%" bg={theme.colors.gray[0]}>
        <Container fluid mb="xl">
          <Group position="apart" mb="xl">
            <Group>
              <PageTitle title="Revenue Tracking Dashboard" />
              {/* <Text
                size="sm"
                color="dimmed"
              >{`Last Updated: ${formatISODateTimeShort(
                updatedDate.toISOString()
              )}`}</Text> */}
            </Group>
            <Button
              size="md"
              leftIcon={<IconRefresh />}
              className="gradient-hover"
              // onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Group>
        </Container>
      </Container>
    </>
  );
}
