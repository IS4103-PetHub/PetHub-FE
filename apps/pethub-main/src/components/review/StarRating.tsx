import { useMantineTheme, RatingProps, Rating } from "@mantine/core";
import { IconPaw } from "@tabler/icons-react";
import React from "react";

interface StarRatingProps extends RatingProps {
  value: number;
  allowFractions?: boolean;
  viewOnly?: boolean;
  iconSize?: string;
}

const StarRating = ({
  value,
  allowFractions,
  viewOnly = false,
  iconSize = "1.5rem",
  ...props
}: StarRatingProps) => {
  const theme = useMantineTheme();

  return (
    <Rating
      mt={-2}
      value={value}
      {...(allowFractions ? { fractions: 8 } : {})}
      readOnly={viewOnly}
      emptySymbol={
        <IconPaw
          size={iconSize}
          color={theme.colors.yellow[7]}
          strokeWidth={1.5}
        />
      }
      fullSymbol={
        <IconPaw
          size={iconSize}
          color={theme.colors.yellow[7]}
          fill={theme.colors.yellow[4]}
          strokeWidth={1.5}
        />
      }
    />
  );
};

export default StarRating;
