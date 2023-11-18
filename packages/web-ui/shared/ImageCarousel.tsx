import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import React from "react";

interface ImageCarouselProps {
  attachmentURLs: string[];
  imageHeight: number;
  altText: string;
  focusedImage?: number; // The index of the image in the list to focus on
  setFocusedImage?: (index: number) => void;
}

const ImageCarousel = ({
  attachmentURLs,
  imageHeight,
  altText,
  focusedImage,
  setFocusedImage,
}: ImageCarouselProps) => {
  const hasMultipleImages = attachmentURLs.length > 1;
  const slides =
    attachmentURLs.length > 0 ? (
      attachmentURLs.map((url) => (
        <Carousel.Slide key={url}>
          <Image src={url} height={imageHeight} alt={altText} fit="contain" />
        </Carousel.Slide>
      ))
    ) : (
      <Carousel.Slide key="placeholder">
        <Image
          src="/pethub-placeholder.png"
          height={imageHeight}
          alt={altText}
        />
      </Carousel.Slide>
    );

  return (
    <Carousel
      withControls={hasMultipleImages}
      withIndicators={hasMultipleImages}
      initialSlide={focusedImage}
      onSlideChange={(index) => {
        if (setFocusedImage) {
          setFocusedImage(index);
        }
      }}
      loop
    >
      {slides}
    </Carousel>
  );
};

export default ImageCarousel;
