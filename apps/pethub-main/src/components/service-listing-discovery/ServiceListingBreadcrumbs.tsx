import { Breadcrumbs, Anchor, Text, useMantineTheme } from "@mantine/core";

interface ServiceListingBreadcrumbsProps {
  title: string;
  id: number;
}

const ServiceListingBreadcrumbs = ({
  title,
  id,
}: ServiceListingBreadcrumbsProps) => {
  const theme = useMantineTheme();
  const items = [
    { title: "Home", href: "/" },
    { title: "Service Listings", href: "/service-listings" },
    { title: `${title}`, href: `/service-listings/${id}` },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} underline={false}>
      <Text color="dimmed" sx={{ ":hover": { color: theme.colors.dark[8] } }}>
        {item.title}
      </Text>
    </Anchor>
  ));

  return <Breadcrumbs>{items}</Breadcrumbs>;
};

export default ServiceListingBreadcrumbs;
