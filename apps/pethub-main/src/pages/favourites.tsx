import {
  Box,
  Container,
  Grid,
  Group,
  MultiSelect,
  Select,
  Transition,
} from "@mantine/core";
import { useMediaQuery, useToggle } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  EMPTY_STATE_DELAY_MS,
  ServiceCategoryEnum,
  ServiceListing,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import SortBySelect from "web-ui/shared/SortBySelect";
import ServiceListingFavouriteCard from "@/components/service-listing-discovery/ServiceListingFavouriteCard";
import ServiceListingsSideBar from "@/components/service-listing-discovery/ServiceListingsSideBar";
import { useGetAllServiceListingsWithQueryParams } from "@/hooks/service-listing";
import { useGetAllTags } from "@/hooks/tags";
import { serviceListingSortOptions } from "@/types/constants";
import { searchServiceListingsForCustomer, sortServiceListings } from "@/util";

export default function ServiceListings() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 64em)");
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<string>("recent");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  // get selected category from router query
  const activeCategory = router.query?.category as string;

  //CHANGE THIS to get all favourite listings by petowner ID
  const { data: serviceListings = [], isLoading } =
    useGetAllServiceListingsWithQueryParams(activeCategory, selectedTags);
  const { data: tags = [] } = useGetAllTags();

  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);

  /*
   * Effect Hooks
   */

  useEffect(() => {
    setRecords(sortServiceListings(serviceListings, sortStatus));
  }, [serviceListings, sortStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (serviceListings.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [serviceListings]);

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(serviceListings);
      return;
    }

    setIsSearching(true);
    const results = searchServiceListingsForCustomer(
      serviceListings,
      searchStr,
    );
    setRecords(results);
  };

  const handleChangeCategory = (newCategory: ServiceCategoryEnum) => {
    router.push({
      query: { category: newCategory },
    });
  };

  const listingCards = records?.map((serviceListing) => (
    <Grid.Col
      key={serviceListing.serviceListingId}
      span={isMobile ? 12 : isTablet ? 4 : 3}
    >
      <ServiceListingFavouriteCard serviceListing={serviceListing} />
    </Grid.Col>
  ));

  const renderContent = () => {
    if (serviceListings.length === 0) {
      if (isLoading) {
        // still fetching
        <CenterLoader />;
      }
      // no records fetched
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No service listings found"
                subtitle="Check back later for new service listings!"
              />
            </div>
          )}
        </Transition>
      );
    }

    return (
      <>
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <Grid gutter="lg" m="sm" mt={5}>
            {listingCards}
          </Grid>
        )}
      </>
    );
  };

  const searchAndSortGroup = (
    <Group position="apart" align="center">
      <SearchBar
        size="md"
        w="45%"
        text="Search by service listing title, business name"
        onSearch={handleSearch}
      />
      <MultiSelect
        w={isTablet ? "30%" : "32%"}
        size="md"
        mt={-25}
        label="Filter by tags"
        placeholder="Select tags"
        maxSelectedValues={3}
        dropdownPosition="bottom"
        clearable
        data={tags.map((tag) => tag.name)}
        value={selectedTags}
        onChange={setSelectedTags}
      />
      <SortBySelect
        data={serviceListingSortOptions}
        value={sortStatus}
        onChange={setSortStatus}
      />
    </Group>
  );

  return (
    <>
      <Head>
        <title>Service Listings - Pet Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <Grid m={isMobile ? 20 : 50}>
            <Grid.Col span={2} hidden={isMobile}>
              <ServiceListingsSideBar
                activeCategory={activeCategory}
                onChangeCategory={handleChangeCategory}
              />
            </Grid.Col>
            <Grid.Col span={isMobile ? 12 : 10}>
              <Box ml="xl" mr="xl">
                <PageTitle
                  title={
                    !activeCategory
                      ? `All service listings`
                      : formatStringToLetterCase(activeCategory)
                  }
                />
                {serviceListings.length > 0 ? searchAndSortGroup : null}
              </Box>
              {renderContent()}
            </Grid.Col>
          </Grid>
        </Container>
      </main>
    </>
  );
}
