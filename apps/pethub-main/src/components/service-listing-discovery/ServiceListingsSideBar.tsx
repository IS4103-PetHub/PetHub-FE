import {
  Box,
  Divider,
  Paper,
  createStyles,
  getStylesRef,
  useMantineTheme,
  Text,
} from "@mantine/core";
import {
  IconList,
  IconBuildingCommunity,
  IconCut,
  IconStethoscope,
  IconToolsKitchen2,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { ServiceCategoryEnum } from "@/types/constants";

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
  { icon: IconList, value: "ALL", label: "All" },
  {
    icon: IconBuildingCommunity,
    value: ServiceCategoryEnum.PetBoarding,
    label: "Pet boarding",
  },
  {
    icon: IconCut,
    value: ServiceCategoryEnum.PetGrooming,
    label: "Pet grooming",
  },
  {
    icon: IconStethoscope,
    value: ServiceCategoryEnum.Veterinary,
    label: "Veterinary",
  },
  {
    icon: IconToolsKitchen2,
    value: ServiceCategoryEnum.Dining,
    label: "Dining",
  },
  {
    icon: IconShoppingBag,
    value: ServiceCategoryEnum.PetRetail,
    label: "Pet retail",
  },
];

interface ServiceListingsSideBarProps {
  activeCategory: string;
  setActiveCategory(category: string): void;
}

const ServiceListingsSideBar = ({
  activeCategory,
  setActiveCategory,
}: ServiceListingsSideBarProps) => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const categoriesList = categories.map((category) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: activeCategory === category.value,
      })}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setActiveCategory(category.value);
      }}
      key={category.value}
    >
      <category.icon className={classes.linkIcon} stroke={1.5} />
      {category.label}
    </Link>
  ));

  return (
    <Paper radius="md" h="80vh" bg={theme.colors.gray[0]} p="lg">
      <Text size="lg" weight={600}>
        Categories
      </Text>
      <Divider mt={5} />
      {categoriesList}
    </Paper>
  );
};

export default ServiceListingsSideBar;
