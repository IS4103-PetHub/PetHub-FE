import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Badge,
  Container,
  Group,
  Stack,
  Text,
  Box,
  useMantineTheme,
  Button,
  Loader,
  Center,
  Grid,
  Chip,
  Transition,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconBuildingStore,
  IconClick,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AccountStatusEnum,
  EMPTY_STATE_DELAY_MS,
  ServiceListing,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import api from "@/api/axiosConfig";
import BusinessLocationsGroup from "@/components/service-listing-discovery/BusinessLocationsGroup";
import DescriptionAccordionItem from "@/components/service-listing-discovery/DescriptionAccordionItem";
import InactivePetBusinessMessage from "@/components/service-listing-discovery/InactivePetBusinessMessage";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";
import { useGetServiceListingByPetBusinessIdAndAccountStatus } from "@/hooks/service-listing";
import { serviceListingSortOptions } from "@/types/constants";
import { PetBusiness } from "@/types/types";
import { sortRecords } from "@/util";

const CAROUSEL_SIZE = 5;

interface PetBusinessDetailsProps {
  petBusiness: PetBusiness;
}

export default function PetBusinessDetails({
  petBusiness,
}: PetBusinessDetailsProps) {
  const theme = useMantineTheme();
  const [showFullDescription, setShowFullDescription] = useToggle();
  const [showAllListings, setShowAllListings] = useToggle();
  const ACCORDION_VALUES = ["business", "description"];
  const [activeCategory, setActiveCategory] = useState("");
  const [sortStatus, setSortStatus] = useState<string>("recent");
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [isSearching, setIsSearching] = useToggle();
  const [searchStr, setSearchStr] = useState("");

  const { data: serviceListings = [], isLoading } =
    useGetServiceListingByPetBusinessIdAndAccountStatus(
      petBusiness.userId,
      petBusiness.accountStatus,
    );

  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);

  useEffect(() => {
    let newRecords = serviceListings;
    if (newRecords.length === 0) {
      return;
    }
    // handle filter by category
    if (activeCategory) {
      newRecords = serviceListings.filter(
        (serviceListing) => serviceListing.category === activeCategory,
      );
    }
    if (searchStr) {
      // handle search
      newRecords = newRecords.filter((serviceListing) =>
        serviceListing.title.toLowerCase().includes(searchStr.toLowerCase()),
      );
    }
    // handle sort
    newRecords = sortRecords(serviceListingSortOptions, newRecords, sortStatus);
    setRecords(newRecords);
  }, [serviceListings, sortStatus, activeCategory, searchStr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (serviceListings.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // prevent user from viewing pet business page if pet business is inactive
  if (petBusiness.accountStatus !== AccountStatusEnum.Active) {
    return <InactivePetBusinessMessage />;
  }

  const handleSearch = (_searchStr: string) => {
    if (!_searchStr) {
      setSearchStr("");
      setIsSearching(false);
      return;
    }
    setSearchStr(_searchStr);
    setIsSearching(true);
  };

  const serviceCategorySet = new Set(
    serviceListings.map((serviceListing) => serviceListing.category),
  );

  const serviceListingHeader = (
    <Text size="xl" weight={600}>
      Service listings ({serviceListings.length})
    </Text>
  );

  const listingsCarousel = (
    <Box mb="xl">
      <Group position="apart" mb="md">
        {serviceListingHeader}
        <Button
          onClick={() => setShowAllListings(true)}
          display={serviceListings.length > 0 ? "block" : "none"}
        >
          View all
        </Button>
      </Group>

      {isLoading ? (
        <Box h={400} sx={{ verticalAlign: "center" }}>
          <Center h="100%" w="100%">
            <Loader />
          </Center>
        </Box>
      ) : serviceListings.length === 0 ? (
        <Box h={400} sx={{ verticalAlign: "center" }}>
          <Center h="100%" w="100%">
            <Transition
              mounted={hasNoFetchedRecords}
              transition="fade"
              duration={100}
            >
              {(styles) => (
                <div style={styles}>
                  <SadDimmedMessage title="No service listings" />
                </div>
              )}
            </Transition>
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
          {/* display first few listings in carousel*/}
          {serviceListings?.slice(0, CAROUSEL_SIZE).map((serviceListing) => (
            <Carousel.Slide size="30%" key={serviceListing.serviceListingId}>
              <ServiceListingCard serviceListing={serviceListing} />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Box>
  );

  const allServiceListings = (
    <Box mt="xl">
      <LargeBackButton
        text="Back to business profile"
        onClick={() => setShowAllListings(false)}
        mb="xl"
      />
      {serviceListingHeader}

      <Group position="apart">
        <Chip.Group
          multiple={false}
          value={activeCategory}
          onChange={setActiveCategory}
        >
          <Group position="left" mt="sm" w="75%">
            <Chip value="" variant="filled">
              All
            </Chip>

            {Array.from(serviceCategorySet).map((serviceCategory) => (
              <Chip
                variant="filled"
                value={serviceCategory}
                key={serviceCategory}
              >
                {formatStringToLetterCase(serviceCategory)}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
        <SortBySelect
          data={serviceListingSortOptions}
          value={sortStatus}
          onChange={setSortStatus}
        />
      </Group>

      <SearchBar
        size="md"
        text="Search by service listing title"
        onSearch={handleSearch}
      />
      {isSearching && records.length === 0 ? (
        <Box h="50vh" sx={{ verticalAlign: "center" }}>
          <Center h="100%" w="100%">
            <NoSearchResultsMessage />
          </Center>
        </Box>
      ) : (
        <Grid mt="md" mb={80}>
          {records.map((serviceListing) => (
            <Grid.Col span={4} key={serviceListing.serviceListingId}>
              <ServiceListingCard serviceListing={serviceListing} />
            </Grid.Col>
          ))}
        </Grid>
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
          <BusinessLocationsGroup addresses={petBusiness.businessAddresses} />
        ) : null}
      </Accordion.Panel>
    </Accordion.Item>
  );

  return (
    <>
      <Head>
        <title>{petBusiness.companyName} - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
        {showAllListings ? (
          <>{allServiceListings}</>
        ) : (
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
            {listingsCarousel}
            {businessSection}
            <DescriptionAccordionItem
              title="Business description"
              description={petBusiness.businessDescription}
              showFullDescription={showFullDescription}
              setShowFullDescription={setShowFullDescription}
            />
          </Accordion>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const { data } = await await api.get(`/users/pet-businesses/${id}`);
  const petBusiness: PetBusiness = {
    userId: data.user.userId,
    companyName: data.companyName,
    uen: data.uen,
    businessType: data.businessType,
    businessDescription: data.businessDescription,
    websiteURL: data.websiteURL,
    contactNumber: data.contactNumber,
    email: data.user.email,
    accountType: data.user.accountType,
    accountStatus: data.user.accountStatus,
    dateCreated: data.user.dateCreated,
    businessAddresses: data.businessAddresses,
    businessEmail: data.businessEmail,
    petBusinessApplication: data.petBusinessApplication,
    commissionRule: data.commissionRule,
  };
  return { props: { petBusiness } };
}
