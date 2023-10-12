import {
  Accordion,
  Container,
  Grid,
  Group,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import api from "@/api/axiosConfig";

interface OrderDetailsProps {
  userId: number;
}

export default function OrderDetails({ userId }: OrderDetailsProps) {
  const theme = useMantineTheme();

  // stub
  const order = {} as any;

  const ACCORDION_VALUES = ["description", "business"];

  return (
    <div>
      <Head>
        <title>{order.id} - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
        <Group position="apart">
          <PageTitle title={`Order xxx`} mb="lg" />
        </Group>
        <Grid gutter="xl" sx={{ border: "1px black solid" }}>
          <Grid.Col span={9} sx={{ border: "1px black solid" }}>
            Col 1
            {/* <ServiceListingBreadcrumbs
                title={serviceListing.title}
                id={serviceListing.serviceListingId}
              />
              <ServiceCategoryBadge
                category={serviceListing.category}
                size="lg"
                mt="xl"
                mb={5}
              /> */}
            <Group position="apart">
              <PageTitle
                title={order.title}
                mb="xs"
                size="2.25rem"
                weight={700}
              />
              Apart to the right
            </Group>
            Item here
            <Accordion
              radius="md"
              variant="filled"
              mt="xl"
              mb={80}
              multiple
              value={ACCORDION_VALUES}
              chevronSize={0}
              onChange={() => {}}
            >
              Accordion item
            </Accordion>
          </Grid.Col>
          <Grid.Col span={3} sx={{ border: "1px black solid" }}>
            Col 2
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;

  const serviceListing = await (await api.get(`/service-listings/${id}`)).data;
  const session = await getSession(context);
  if (!session) return { props: { serviceListing } };
  const userId = session.user["userId"];

  return { props: { userId, serviceListing } };
}
