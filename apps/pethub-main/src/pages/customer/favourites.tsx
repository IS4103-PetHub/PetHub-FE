import { Box, Container, Grid, Group, Transition } from "@mantine/core";
import { useMediaQuery, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
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
import {
  useAddServiceListingToFavourites,
  useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams,
  useRemoveServiceListingFromFavourites,
} from "@/hooks/pet-owner";
import { serviceListingSortOptions } from "@/types/constants";
import { AddRemoveFavouriteServiceListingPayload } from "@/types/types";
import { searchServiceListingsForCustomer, sortServiceListings } from "@/util";

interface FavouritesProps {
  userId: number;
}

export default function Favourites({ userId }: FavouritesProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 64em)");
  const isTablet = useMediaQuery("(max-width: 100em)");
  const [isSearching, setIsSearching] = useToggle();
  const [sortStatus, setSortStatus] = useState<string>("recent");

  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();

  // get selected category from router query
  const activeCategory = router.query?.category as string;

  const { data: serviceListings = [], isLoading } =
    useGetAllFavouriteServiceListingsByPetOwnerIdWithQueryParams(
      userId,
      activeCategory,
    );

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

  const addFavouriteMutation = useAddServiceListingToFavourites();
  const handleAddFavourite = async (
    payload: AddRemoveFavouriteServiceListingPayload,
    serviceListingTitle: string,
  ) => {
    try {
      await addFavouriteMutation.mutateAsync(payload);
      notifications.show({
        title: "Favourite Added",
        color: "green",
        icon: <IconCheck />,
        message: `Listing "${serviceListingTitle}" added to favourites.`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Adding Listing to Favourites",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const removeFavouriteMutation = useRemoveServiceListingFromFavourites();
  const handleRemoveFavourite = async (
    payload: AddRemoveFavouriteServiceListingPayload,
    serviceListingTitle: string,
  ) => {
    try {
      await removeFavouriteMutation.mutateAsync(payload);
      notifications.show({
        title: "Favourite Removed",
        color: "green",
        icon: <IconCheck />,
        message: `Listing "${serviceListingTitle}" removed from favourites.`,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error Removing Listing from Favourites",
        color: "red",
        icon: <IconX />,
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message,
      });
    }
  };

  const handleFavourite = (
    serviceListing: ServiceListing,
    isFavourite: boolean,
  ) => {
    const serviceListingId = serviceListing.serviceListingId;
    const payload: AddRemoveFavouriteServiceListingPayload = {
      userId,
      serviceListingId,
    };
    if (isFavourite) {
      handleRemoveFavourite(payload, serviceListing.title);
    } else {
      handleAddFavourite(payload, serviceListing.title);
    }
  };

  // Function to check if a listing is a favorite
  const isListingFavorite = (listingId: number) => {
    return serviceListings.some(
      (listing) => listing.serviceListingId === listingId,
    );
  };

  const listingCards = records?.map((serviceListing) => (
    <Grid.Col
      key={serviceListing.serviceListingId}
      span={isMobile ? 12 : isTablet ? 4 : 3}
    >
      <ServiceListingFavouriteCard
        serviceListing={serviceListing}
        currentFavourite={isListingFavorite(serviceListing.serviceListingId)}
        onFavourite={handleFavourite}
      />
    </Grid.Col>
  ));

  const handleChangeCategory = (newCategory: ServiceCategoryEnum) => {
    router.push({
      query: { category: newCategory },
    });
  };

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
                title="No favourited service listings found"
                subtitle="Go to 'Explore services' to find your favourite listings!"
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
        w="78%"
        text="Search by service listing title, business name"
        onSearch={handleSearch}
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
        <title>My Favourites - Pet Hub</title>
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
                      ? `My Favourites`
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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const userId = session.user["userId"];
  return { props: { userId } };
}
