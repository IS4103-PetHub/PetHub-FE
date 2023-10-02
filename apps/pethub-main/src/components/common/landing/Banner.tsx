import {
  createStyles,
  Container,
  Box,
  rem,
  Text,
  BackgroundImage,
} from "@mantine/core";

const BANNER_HEIGHT = rem(500);

const useStyles = createStyles((theme) => ({
  inner: {
    height: BANNER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,8,18,0.5)",
  },
}));

const Banner = () => {
  const { classes } = useStyles();
  return (
    <BackgroundImage src="/pet-banner.jpg">
      <Container className={classes.inner} fluid>
        <Box p="10vw">
          <Text size="3rem" weight="600" color="white">
            Every pet deserves the best
          </Text>
          <Text size="1.5rem" color="white">
            Discover quality pet services at PetHub
          </Text>
        </Box>
      </Container>
    </BackgroundImage>
  );
};

export default Banner;
