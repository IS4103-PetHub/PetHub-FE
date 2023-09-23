import { Container, Text, Box } from "@mantine/core";
import axios from "axios";
import { getSession } from "next-auth/react";
import { PageTitle } from "web-ui";
import ServiceCategoryBadge from "@/components/service-listing-discovery/ServiceCategoryBadge";
import ServiceListingBreadcrumbs from "@/components/service-listing-discovery/ServiceListingBreadcrumbs";
import { ServiceListing } from "@/types/types";

interface ServiceListingDetailsProps {
  serviceListing: ServiceListing;
}

export default function ServiceListingDetails({
  serviceListing,
}: ServiceListingDetailsProps) {
  return (
    <Container mt={50}>
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
      <PageTitle title={serviceListing.title} />
      <Box h={500} />
      <Text size="xl" weight={600}>
        Description
      </Text>
      <Text>{serviceListing.description}</Text>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const serviceListing = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/api/service-listings/${id}`,
    )
  ).data;
  return { props: { serviceListing } };
}
