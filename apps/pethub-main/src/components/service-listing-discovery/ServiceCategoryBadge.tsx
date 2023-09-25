import { Badge, BadgeProps } from "@mantine/core";
import React from "react";
import { formatStringToLetterCase } from "shared-utils";
import { ServiceCategoryEnum } from "@/types/constants";

interface ServiceCategoryBadgeProps extends BadgeProps {
  category: ServiceCategoryEnum;
}

const categoryColourMap = new Map([
  [ServiceCategoryEnum.PetBoarding, "pink"],
  [ServiceCategoryEnum.PetGrooming, "green"],
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
