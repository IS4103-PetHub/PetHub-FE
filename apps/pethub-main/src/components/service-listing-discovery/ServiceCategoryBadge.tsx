import { Badge, BadgeProps } from "@mantine/core";
import React from "react";
import { ServiceCategoryEnum, formatStringToLetterCase } from "shared-utils";

interface ServiceCategoryBadgeProps extends BadgeProps {
  category: ServiceCategoryEnum;
}

const categoryColourMap = new Map([
  [ServiceCategoryEnum.PetBoarding, "pink"],
  [ServiceCategoryEnum.PetGrooming, "blue"],
  [ServiceCategoryEnum.Dining, "orange"],
  [ServiceCategoryEnum.Veterinary, "cyan"],
  [ServiceCategoryEnum.PetRetail, "violet"],
]);

const ServiceCategoryBadge = ({
  category,
  ...props
}: ServiceCategoryBadgeProps) => {
  return (
    <Badge
      color={
        categoryColourMap.has(category)
          ? categoryColourMap.get(category)
          : "gray"
      }
      {...props}
    >
      {formatStringToLetterCase(category)}
    </Badge>
  );
};

export default ServiceCategoryBadge;
