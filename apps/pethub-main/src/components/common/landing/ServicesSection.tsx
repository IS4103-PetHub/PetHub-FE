import {
  Box,
  Card,
  Center,
  Grid,
  Text,
  createStyles,
  getStylesRef,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { formatStringToLetterCase } from "shared-utils";
import { PageTitle } from "web-ui";
import { landingPageCategories } from "@/types/constants";

const useStyles = createStyles((theme) => ({
  background: {
    backgroundColor: theme.colors.gray[2],
    verticalAlign: "center",
  },

  link: {
    color: theme.colors.dark[6],
    "&:hover": {
      transition: "margin 300ms ease",
      marginTop: -6,
      backgroundColor: theme.colors.indigo[5],
      color: "white",
      [`& .${getStylesRef("icon")}`]: {
        color: "white",
      },
    },
  },

  icon: {
    ref: getStylesRef("icon"),
    color: theme.colors.indigo[5],
    margin: "5px 0px",
  },
}));
const ServicesSection = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const categoryCards = landingPageCategories.map((category) => (
    <Grid.Col span={2} key={category.value}>
      <Card shadow="sm" mb="lg" miw={200} className={classes.link}>
        <Link href={`/service-listings?category=${category.value}`}>
          <Center>
            <category.icon className={classes.icon} stroke={1.5} size="2rem" />
          </Center>
          <Text align="center" weight={600} size="xl">
            {formatStringToLetterCase(category.label)}
          </Text>
        </Link>
      </Card>
    </Grid.Col>
  ));
  return (
    <Box className={classes.background} h={400}>
      <Center w="100%" h="100%">
        <Box>
          <PageTitle
            align="center"
            title="Explore pet services"
            pt="xl"
            color={theme.colors.indigo[8]}
          />
          <Grid grow p={50} gutter="xl">
            {categoryCards}
          </Grid>
        </Box>
      </Center>
    </Box>
  );
};

export default ServicesSection;
