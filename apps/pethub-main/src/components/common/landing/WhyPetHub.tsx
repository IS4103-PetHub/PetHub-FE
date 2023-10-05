import {
  useMantineTheme,
  Box,
  Center,
  Card,
  Text,
  Grid,
  List,
  createStyles,
  Divider,
  Image,
} from "@mantine/core";
import React from "react";
import { PageTitle } from "web-ui";

const useStyles = createStyles((theme) => ({
  title: {
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: 0.4,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.dark[5],
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
}));

const WhyPetHub = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const petOwnerPoints = [
    "Explore a world of pet services at your fingertips",
    "Book appointments hassle-free",
    "Seamlessly manage all your pet-related needs",
  ];

  const petBusinessPoints = [
    "Showcase your services with minimal commission fees",
    "Effortlessly manage orders and appointments",
    "Gain valuable insights with our sales reports",
  ];

  return (
    <Box h={600} sx={{ backgroundColor: theme.colors.dark[6] }}>
      <Center w="100%" h="100%">
        <Box>
          <PageTitle align="center" title="Why PetHub?" color="white" mb={50} />
          <Grid grow gutter={50}>
            <Grid.Col span={6}>
              <Card shadow="md" miw={500} p="xl" radius="md">
                <Center>
                  <Image
                    src="/whypethub-PO.svg"
                    mb={2}
                    mt={2}
                    width={100}
                    alt="Pet Owner Icon"
                  />
                </Center>
                <Text className={classes.title}>Pet Owners</Text>
                <Divider mb="md" />
                <List m="0px 20px">
                  {petOwnerPoints.map((point) => (
                    <List.Item key={point}>{point}</List.Item>
                  ))}
                </List>
              </Card>
            </Grid.Col>

            <Grid.Col span={6}>
              <Card shadow="md" miw={500} p="xl" radius="md">
                <Center mb="xs" mt="xs">
                  <Image
                    src="/whypethub-PB.svg"
                    width={85}
                    alt="Pet Business Icon"
                  />
                </Center>
                <Text className={classes.title}>Pet Businesses</Text>
                <Divider mb="md" />
                <List m="0px 20px">
                  {petBusinessPoints.map((point) => (
                    <List.Item key={point}>{point}</List.Item>
                  ))}
                </List>
              </Card>
            </Grid.Col>
          </Grid>
        </Box>
      </Center>
    </Box>
  );
};

export default WhyPetHub;
