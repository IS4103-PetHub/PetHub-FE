import { subtle } from "crypto";
import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Badge,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Box,
  useMantineTheme,
  Button,
  Loader,
  Center,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconBlockquote,
  IconBuildingStore,
  IconClick,
  IconMail,
  IconPhone,
  IconWorldWww,
} from "@tabler/icons-react";
import Link from "next/link";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";

import AddressCard from "web-ui/shared/pb-applications/AddressCard";
import api from "@/api/axiosConfig";
import DescriptionAccordionItem from "@/components/service-listing-discovery/DescriptionAccordionItem";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";
import { useGetServiceListingByPetBusinessId } from "@/hooks/service-listing";
import { PetBusiness } from "@/types/types";

interface PetBusinessDetailsProps {
  petBusiness: PetBusiness;
}

export default function PetBusinessDetails({
  petBusiness,
}: PetBusinessDetailsProps) {
  const theme = useMantineTheme();
  const [showFullDescription, setShowFullDescription] = useToggle();
  const ACCORDION_VALUES = ["business", "description"];

  const { data: serviceListings = [], isLoading } =
    useGetServiceListingByPetBusinessId(petBusiness.userId);

  // console.log(petBusiness);
  // console.log(serviceListings);

  const listingsSection = (
    <Box mb="xl">
      <Group position="apart" mb="md">
        <Text size="xl" weight={600}>
          Service listings ({serviceListings?.length})
        </Text>
        <Button>View all</Button>
      </Group>

      {isLoading ? (
        // still fetching
        <Box h={400} sx={{ verticalAlign: "center" }}>
          <Center h="100%" w="100%">
            <Loader />
          </Center>
        </Box>
      ) : (
        <Carousel
          slideSize="70%"
          height="100%"
          align="start"
          slideGap="md"
          loop
          draggable={serviceListings.length > 3}
          withControls={serviceListings.length > 3}
          controlSize={18}
        >
          {/* display first 5 listings in carousel*/}
          {serviceListings?.slice(0, 5).map((serviceListing) => (
            <Carousel.Slide size="30%" key={serviceListing.serviceListingId}>
              <ServiceListingCard serviceListing={serviceListing} />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Box>
  );

  const businessSection = (
    <Accordion.Item value="business" p="sm" mb="xl">
      <Accordion.Control
        icon={<IconBuildingStore color={theme.colors.indigo[5]} />}
        sx={{ "&:hover": { cursor: "default" } }}
      >
        <Text size="xl" weight={600}>
          Business information
        </Text>
      </Accordion.Control>
      <Accordion.Panel ml={5} mr={5}>
        <Stack spacing={5}>
          <Group>
            <Text weight={500}>{petBusiness.companyName}</Text>
            {/*display visit website button only if PB has website url*/}
            {petBusiness.websiteURL ? (
              <Link href={petBusiness.websiteURL}>
                <Button
                  compact
                  variant="subtle"
                  leftIcon={<IconClick size="1rem" />}
                  ml={-10}
                >
                  Visit website
                </Button>
              </Link>
            ) : null}
          </Group>
          <Text color="dimmed" size="sm">
            UEN: {petBusiness.uen}
          </Text>
          <Group spacing="xs">
            <IconPhone color="gray" size="1.2rem" />
            <Text size="sm">{petBusiness.contactNumber}</Text>
          </Group>
          <Group spacing="xs">
            <IconMail color="gray" size="1.2rem" />
            <Text size="sm">{petBusiness.businessEmail}</Text>
          </Group>
        </Stack>

        {/*if there are addresses*/}
        {petBusiness.businessAddresses.length > 0 ? (
          <>
            <Divider mt="lg" />
            <Text weight={600} mt="md">
              Locations ({petBusiness.businessAddresses.length})
            </Text>
            <Group spacing={0}>
              {petBusiness.businessAddresses.map((address) => (
                <AddressCard
                  key={address.addressId}
                  address={address}
                  disabled
                  ml={0}
                  mt="md"
                  mr="md"
                />
              ))}
            </Group>
          </>
        ) : null}
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <Container mt={50} size="70vw" sx={{ overflow: "hidden" }}>
      <Group>
        <PageTitle title={petBusiness.companyName} />
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 90 }}
        >
          {petBusiness.businessType}
        </Badge>
      </Group>
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
        {listingsSection}
        {businessSection}
        <DescriptionAccordionItem
          title="Business description"
          description={petBusiness.businessDescription}
          showFullDescription={showFullDescription}
          setShowFullDescription={setShowFullDescription}
        />
      </Accordion>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const petBusiness = await (await api.get(`/users/pet-businesses/${id}`)).data;
  return { props: { petBusiness } };
}
