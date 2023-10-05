import {
  Divider,
  Paper,
  createStyles,
  getStylesRef,
  useMantineTheme,
  Text,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { serviceListingSideBarCategories } from "@/types/constants";

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

interface ServiceListingsSideBarProps {
  activeCategory: string;
  onChangeCategory(category: string): void;
}

const ServiceListingsSideBar = ({
  activeCategory,
  onChangeCategory,
}: ServiceListingsSideBarProps) => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const categoriesList = serviceListingSideBarCategories.map((category) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: activeCategory === category.value,
      })}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onChangeCategory(category.value);
      }}
      key={category.value}
    >
      <category.icon className={classes.linkIcon} stroke={1.5} />
      {category.label}
    </Link>
  ));

  return (
    <Paper
      radius="md"
      h="80vh"
      bg={theme.colors.gray[0]}
      p="lg"
      w="14vw"
      pos="fixed"
    >
      <Text size="lg" weight={600}>
        Categories
      </Text>
      <Divider mt={5} />
      {categoriesList}
    </Paper>
  );
};

export default ServiceListingsSideBar;
