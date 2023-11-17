import { Center, Card, Divider, Text, Image } from "@mantine/core";
import React from "react";

interface BusinessValueCard {
  imageUrl: string;
  imageAltText: string;
  title: string;
  description: string;
}

const BusinessValueCard = ({
  imageUrl,
  imageAltText,
  title,
  description,
}: BusinessValueCard) => {
  return (
    <Center>
      <Card shadow="sm" padding="lg" radius="md" withBorder mih={300}>
        <Center mb="md" mt="xs">
          <Image src={imageUrl} width={70} alt={imageAltText} />
        </Center>
        <Text weight={700} size="md">
          {title}
        </Text>
        <Divider mb="md" />
        <Text>{description}</Text>
      </Card>
    </Center>
  );
};

export default BusinessValueCard;
