import {
  Container,
  Text,
  Button,
  Group,
  Grid,
  Accordion,
  Paper,
  useMantineTheme,
  Box,
  Stack,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { ServiceListing } from "shared-utils";
import { PageTitle } from "web-ui";
import SimpleOutlineButton from "web-ui/shared/SimpleOutlineButton";
import api from "@/api/axiosConfig";
import SelectTimeslotModal from "@/components/appointment-booking/SelectTimeslotModal";
import BusinessLocationsGroup from "@/components/service-listing-discovery/BusinessLocationsGroup";
import DescriptionAccordionItem from "@/components/service-listing-discovery/DescriptionAccordionItem";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import ServiceListingBreadcrumbs from "@/components/service-listing-discovery/ServiceListingBreadcrumbs";
import ServiceListingCarousel from "@/components/service-listing-discovery/ServiceListingCarousel";
import ServiceListingTags from "@/components/service-listing-discovery/ServiceListingTags";
import { formatPriceForDisplay } from "@/util";

interface ServiceListingDetailsProps {
  userId: number;
  serviceListing: ServiceListing;
}

export default function ServiceListingDetails({
  userId,
  serviceListing,
}: ServiceListingDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useToggle();
  // for select timeslot modal
  const [opened, { open, close }] = useDisclosure(false);

  const ACCORDION_VALUES = ["description", "business"];

  const handleClickBuyNow = async () => {
    const session = await getSession();
    if (!session) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to buy!",
        color: "red",
      });
    }
    // display select timeslot modal
    open();
  };

  const businessSection = (
    <Accordion.Item value="business" p="sm" mb="xl">
      <Accordion.Control
        icon={<IconMapPin color={theme.colors.indigo[5]} />}
        sx={{ "&:hover": { cursor: "default" } }}
      >
        <Text size="xl" weight={600}>
          Where to use
        </Text>
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        <Group>
          <Box>
            <Text weight={500}>{serviceListing.petBusiness.companyName}</Text>
            <Text color="dimmed" size="sm">
              UEN: {serviceListing.petBusiness.uen}
            </Text>
          </Box>
          <SimpleOutlineButton
            text="View business"
            ml={5}
            onClick={() =>
              router.push(`/pet-businesses/${serviceListing.petBusinessId}`)
            }
          />
        </Group>

        <Stack mt="lg" spacing={5}>
          <Group spacing="xs">
            <IconPhone color="gray" size="1.2rem" />
            <Text size="sm">{serviceListing.petBusiness.contactNumber}</Text>
          </Group>
          <Group spacing="xs">
            <IconMail color="gray" size="1.2rem" />
            <Text size="sm">{serviceListing.petBusiness.businessEmail}</Text>
          </Group>
        </Stack>

        {/*if there are addresses*/}
        {serviceListing.addresses.length > 0 ? (
          <BusinessLocationsGroup addresses={serviceListing.addresses} />
        ) : null}
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <>
      <Head>
        <title>{serviceListing.title} - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
        <Grid gutter="xl">
          <Grid.Col span={9}>
            <ServiceListingBreadcrumbs
              title={serviceListing.title}
              id={serviceListing.serviceListingId}
            />
            <ServiceCategoryBadge
              category={serviceListing.category}
              size="lg"
              mt="xl"
              mb={5}
            />
            <PageTitle
              title={serviceListing.title}
              mb="xs"
              size="2.25rem"
              weight={700}
            />
            <ServiceListingTags tags={serviceListing.tags} size="md" mb="xl" />
            <ServiceListingCarousel
              attachmentURLs={serviceListing.attachmentURLs}
            />
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
              {businessSection}
              <DescriptionAccordionItem
                title="Description"
                description={serviceListing.description}
                showFullDescription={showFullDescription}
                setShowFullDescription={setShowFullDescription}
              />
            </Accordion>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper
              radius="md"
              bg={theme.colors.gray[0]}
              p="lg"
              withBorder
              mt={50}
            >
              <Group position="apart">
                <Text size="xl" weight={500}>
                  ${formatPriceForDisplay(serviceListing.basePrice)}
                </Text>
              </Group>
              <Button size="md" fullWidth mt="xs" onClick={handleClickBuyNow}>
                Buy now
              </Button>

              <SelectTimeslotModal
                petOwnerId={userId}
                serviceListing={serviceListing}
                opened={opened}
                onClose={close}
              />
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
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
