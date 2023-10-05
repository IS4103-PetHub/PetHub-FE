import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import React from "react";

const IMAGE_HEIGHT = 500;

interface ServiceListingCarouselProps {
  attachmentURLs: string[];
}

const ServiceListingCarousel = ({
  attachmentURLs,
}: ServiceListingCarouselProps) => {
  const hasMultipleImages = attachmentURLs.length > 1;
  const slides =
    attachmentURLs.length > 0 ? (
      attachmentURLs.map((url) => (
        <Carousel.Slide key={url}>
          <Image src={url} height={IMAGE_HEIGHT} alt="Service Listing Photo" />
        </Carousel.Slide>
      ))
    ) : (
      <Carousel.Slide key="placeholder">
        <Image
          src="/pethub-placeholder.png"
          height={500}
          alt="Service Listing Photo"
        />
      </Carousel.Slide>
    );

  return (
    <Carousel
      withControls={hasMultipleImages}
      withIndicators={hasMultipleImages}
      loop
    >
      {slides}
    </Carousel>
  );
};

export default ServiceListingCarousel;
