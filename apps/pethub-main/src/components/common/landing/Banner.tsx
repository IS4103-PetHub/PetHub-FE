import {
  createStyles,
  Container,
  Box,
  rem,
  Text,
  BackgroundImage,
} from "@mantine/core";
import { useState } from "react";
import { Article } from "shared-utils";
import AnnouncementArticleBanner from "@/components/article/AnnouncementArticleBanner";

const BANNER_HEIGHT = rem(500);

const useStyles = createStyles((theme) => ({
  announcementBanner: {
    position: "absolute",
    marginTop: 10,
    width: "85%",
    left: "50%",
    transform: "translateX(-50%)",
  },
  inner: {
    height: BANNER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,8,18,0.5)",
  },
}));

interface BannerProps {
  announcementArticle: Article;
}

const Banner = ({ announcementArticle }: BannerProps) => {
  const { classes } = useStyles();
  const [isAnnouncementBannerOpen, setIsAnnouncementBannerOpen] =
    useState(true);

  return (
    <BackgroundImage src="/pet-banner.jpg">
      {isAnnouncementBannerOpen && (
        <div className={classes.announcementBanner}>
          <AnnouncementArticleBanner
            article={announcementArticle}
            closeBanner={() => setIsAnnouncementBannerOpen(false)}
          />
        </div>
      )}
      <Container className={classes.inner} fluid>
        <Box>
          <Box p="10vw">
            <Text size="3rem" weight="600" color="white">
              Every pet deserves the best
            </Text>
            <Text size="1.5rem" color="white">
              Discover quality pet services at PetHub
            </Text>
          </Box>
        </Box>
      </Container>
    </BackgroundImage>
  );
};

export default Banner;
