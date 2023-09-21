import {
  Box,
  Container,
  Grid,
  Paper,
  useMantineTheme,
  Text,
  Divider,
  createStyles,
  rem,
  getStylesRef,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBuildingCommunity,
  IconCut,
  IconList,
  IconShoppingBag,
  IconStethoscope,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import Head from "next/head";
import Link from "next/link";
import link from "next/link";
import { useState } from "react";
import { PageTitle } from "web-ui";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colors.dark[1],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.indigo[5],
      color: "white",
      [`& .${getStylesRef("icon")}`]: {
        color: "white",
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.colors.dark[2],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.colors.dark[6],
      color: theme.colors.gray[0],

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colors.gray[0],
      },
    },
  },
}));

const categories = [
  { icon: IconList, label: "All" },
  { icon: IconBuildingCommunity, label: "Pet boarding" },
  { icon: IconCut, label: "Pet grooming" },
  { icon: IconStethoscope, label: "Veterinary" },
  { icon: IconToolsKitchen2, label: "Dining" },
  { icon: IconShoppingBag, label: "Pet retail" },
];

export default function ServiceListings() {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [activeCategory, setActiveCategory] = useState("All");

  const categoriesList = categories.map((category) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: activeCategory === category.label,
      })}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setActiveCategory(category.label);
      }}
      key={category.label}
    >
      <category.icon className={classes.linkIcon} stroke={1.5} />
      {category.label}
    </Link>
  ));

  return (
    <>
      <Head>
        <title>Service Listings - Pet Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <Grid m="50px">
            <Grid.Col span={2}>
              <Paper radius="md" h="80vh" bg={theme.colors.gray[0]} p="lg">
                <Text size="lg" weight={600}>
                  Category
                </Text>
                <Divider mt={5} />
                {categoriesList}
                <Box h={300} />
                <Text size="lg" weight={600}>
                  Filters
                </Text>
                <Divider mt={5} />
              </Paper>
            </Grid.Col>
            <Grid.Col span={10}>
              <Box ml="xl">
                <PageTitle title="All service listings" />
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </main>
    </>
  );
}
