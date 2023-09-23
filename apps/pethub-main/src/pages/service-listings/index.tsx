import {
  Box,
  Container,
  Grid,
  Group,
  Select,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useToggle } from "@mantine/hooks";

import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { PageTitle } from "web-ui";
import SearchBar from "web-ui/shared/SearchBar";
import ServiceListingCard from "@/components/service-listing-discovery/ServiceListingCard";
import ServiceListingsSideBar from "@/components/service-listing-discovery/ServiceListingsSideBar";
import { useGetAllServiceListings } from "@/hooks/service-listing";
import { ServiceListing } from "@/types/types";
import { searchServiceListingsForCustomer } from "@/util";

export default function ServiceListings() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 64em)");
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { data: serviceListings = [] } = useGetAllServiceListings();
  const [records, setRecords] = useState<ServiceListing[]>(serviceListings);

  // useEffect(() => console.log(serviceListings), [serviceListings]);

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(serviceListings);
      setPage(1);
      return;
    }

    setIsSearching(true);
    const results = searchServiceListingsForCustomer(records, searchStr);
    setRecords(results);
    setPage(1);
  };

  const listingCards = records.map((serviceListing) => (
    <Grid.Col
      key={serviceListing.serviceListingId}
      span={isMobile ? 12 : isTablet ? 4 : 3}
      onClick={() =>
        router.push(`${router.asPath}/${serviceListing.serviceListingId}`)
      }
    >
      <ServiceListingCard serviceListing={serviceListing} />
    </Grid.Col>
  ));

  const sortByOptions = [
    { value: "recent", label: "Recently added" },
    { value: "oldest", label: "Oldest" },
    { value: "priceLowToHigh", label: "Price (low to high)" },
    { value: "priceHighToLow", label: "Price (high to low)" },
  ];

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
                setActiveCategory={setActiveCategory}
              />
            </Grid.Col>
            <Grid.Col span={isMobile ? 12 : 10}>
              <Box ml="xl" mr="xl">
                <PageTitle title="All service listings" />
                <Group position="apart" align="center">
                  <SearchBar
                    size="md"
                    w="70%"
                    text="Search by service listing title, pet business name, category, tag"
                    onSearch={handleSearch}
                  />
                  <Select
                    w="25%"
                    size="md"
                    placeholder="Sort by"
                    clearable
                    data={sortByOptions}
                  />
                </Group>
              </Box>
              <Grid gutter="lg" m="sm">
                {listingCards}
              </Grid>
            </Grid.Col>
          </Grid>
        </Container>
      </main>
    </>
  );
}
