import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ServiceListing } from "shared-utils";
import CenterLoader from "web-ui/shared/CenterLoader";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import { useGetAllServiceListingsWithQueryParams } from "@/hooks/service-listing";
import { searchServiceListingsForCustomer } from "@/util";

interface SelectServiceListingProps {
  form: UseFormReturnType<any>;
}

export default function SelectServiceListing({
  form,
}: SelectServiceListingProps) {
  const [activeCategory, setActiveCategory] = useState<string>(null);
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ServiceListing[]>([]);
  const [isSearching, setIsSearching] = useToggle();
  const [visibleRows, setVisibleRows] = useState<number>(2);
  const [selectedServiceListingId, setSelectedServiceListingId] = useState<
    number | null
  >(null);

  const { data: serviceListings = [], isLoading } =
    useGetAllServiceListingsWithQueryParams(activeCategory, []);

  useEffect(() => {
    if (isSearching) {
      setSearchResults(searchResults);
      return;
    }
    setSearchResults(serviceListings);
  }, [serviceListings, isSearching, searchString]);

  const handleSearch = (searchStr: string) => {
    setSearchString(searchStr);
    setVisibleRows(2);
    if (searchStr.length === 0) {
      setIsSearching(false);
      setSearchResults(serviceListings);
      return;
    }
    setIsSearching(true);
    const results = searchServiceListingsForCustomer(
      serviceListings,
      searchStr,
    );
    setSearchResults(results);
  };

  const handleShowMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 2);
  };

  const handleShowLess = () => {
    setVisibleRows((prevVisibleRows) =>
      prevVisibleRows > 4 ? prevVisibleRows - 2 : 2,
    );
  };

  const visibleListings = searchResults.slice(0, visibleRows * 3);

  const handleRowClick = (serviceListingId: number) => {
    form.setValues({
      ...form.values,
      serviceListingId: serviceListingId,
    });
    setSelectedServiceListingId(serviceListingId); // Set the selected serviceListingId in the state
  };

  const serviceListingCards = visibleListings.map((listings) => (
    <Grid.Col span={4} key={listings.serviceListingId}>
      <Card
        radius="md"
        withBorder
        onClick={() => handleRowClick(listings.serviceListingId)}
        style={{
          backgroundColor:
            selectedServiceListingId === listings.serviceListingId
              ? "#f0f0f0"
              : "white",
        }}
      >
        <Group>
          <Box>
            <Image
              src={
                listings.attachmentURLs.length > 0
                  ? listings.attachmentURLs[0]
                  : "/pethub-placeholder.png"
              }
              height={70}
              width={70}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* <Badge size="xs">
                            ID {listings.serviceListingId}
                        </Badge> */}
            <Text
              weight={600}
              size="sm"
              sx={{ lineHeight: 1.4, wordWrap: "break-word" }}
            >
              {listings.title}
            </Text>
            <Text size="xs" color="dimmed" sx={{ wordWrap: "break-word" }}>
              {listings.petBusiness.companyName}
            </Text>
          </Box>
        </Group>
      </Card>
    </Grid.Col>
  ));

  const renderContent = () => {
    if (serviceListings.length === 0) {
      if (isLoading) {
        return <CenterLoader />;
      }
      return <SadDimmedMessage title="No Service Listing found" subtitle="" />;
    }

    return (
      <>
        {isSearching && searchResults.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <>{serviceListingCards}</>
        )}
      </>
    );
  };

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <SearchBar
            text="Search by service listing title, business name"
            onSearch={handleSearch}
          />
        </Grid.Col>
        {renderContent()}
      </Grid>
      <Box mt="xl">
        {visibleListings.length < searchResults.length && (
          <Button onClick={handleShowMore} style={{ marginRight: 8 }}>
            Show More Items
          </Button>
        )}
        {visibleRows > 2 && <Button onClick={handleShowLess}>Show Less</Button>}
      </Box>
    </>
  );
}
